import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  name = signal<string>('Pikachu');
  life = signal<number>(21);
  
  size = computed((): string=>{
 switch (true) {
   case this.life() < 15:
     return 'Petit';
   case this.life() > 25:
     return 'Grand';
   default:
     return 'Moyen';
 }
  })

  incrementLife(): void {
    this.life.update((n) => n + 1);
    console.log('+1 point de vie');
  }

  decrementeLife(): void {
    this.life.update((n) => n - 1);
    console.log('-1 point de vie');
  }

}
