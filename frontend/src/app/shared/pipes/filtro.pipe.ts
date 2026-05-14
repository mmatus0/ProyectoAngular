import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {
  transform(items: any[], termino: string, campos: string[] = []): any[] {
    if (!items || !termino || termino.trim() === '') return items;

    const term = termino.toLowerCase();

    return items.filter(item =>
      campos.some(campo =>
        item[campo]?.toString().toLowerCase().includes(term)
      )
    );
  }
}
