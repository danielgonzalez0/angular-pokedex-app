import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { getPokemonColor } from '../models/pokemon.model';

@Directive({
  selector: '[appPokemonBorder]',
  standalone: true,
})
export class PokemonBorderDirective {
  private initialColor: string;
  @Input({ required: true }) pokemonType!: string;

  constructor(private el: ElementRef) {
    this.initialColor = this.el.nativeElement.style.borderColor;
    this.el.nativeElement.style.borderWidth = '2px';
  }

  private setBorder(color: string) {
    this.el.nativeElement.style.borderColor = color;
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = this.getBorderColor();
    this.setBorder(color);
  }

  @HostListener('mouseleave') onMouseLeave() {
    const color = this.initialColor;
    this.setBorder(color);
  }
  private getBorderColor(): string {
  return  getPokemonColor(this.pokemonType);
  }
}
