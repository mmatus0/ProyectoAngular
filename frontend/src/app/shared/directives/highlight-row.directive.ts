import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[appHighlightRow]',
  standalone: true
})
export class HighlightRowDirective {

  @Input() appHighlightRow: string = '#f0f4ff';
  @Input() defaultColor: string    = '';

  private el = inject(ElementRef);

  ngOnInit() {
    this.defaultColor = this.el.nativeElement.style.backgroundColor || '';
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlightRow;
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.transition = 'background-color 0.15s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = this.defaultColor;
  }
}