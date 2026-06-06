import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../../../core/services/faq.service';

interface IFaq {
  id: number;
  categoria: string;
  pregunta: string;
  respuesta: string;
  orden: number;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

  private faqService = inject(FaqService);

  faqs             = signal<IFaq[]>([]);
  loading          = signal<boolean>(true);
  abierto          = signal<number | null>(null);
  categoriaActiva  = signal<string>('');

  categorias = computed(() => {
    const cats = new Set(this.faqs().map(f => f.categoria));
    return Array.from(cats);
  });

  faqsFiltradas = computed(() =>
    this.faqs().filter(f => f.categoria === this.categoriaActiva())
  );

  ngOnInit() {
    this.faqService.getFaqs().subscribe({
      next: (resp) => {
        this.faqs.set(resp.data);
        if (resp.data.length > 0) {
          this.categoriaActiva.set(resp.data[0].categoria);
          this.abierto.set(resp.data[0].id);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  seleccionarCategoria(cat: string) {
    this.categoriaActiva.set(cat);
    const primera = this.faqs().find(f => f.categoria === cat);
    this.abierto.set(primera ? primera.id : null);
  }

  toggle(id: number) {
    this.abierto.set(this.abierto() === id ? null : id);
  }
}