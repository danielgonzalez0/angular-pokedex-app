import { Component, computed, signal } from '@angular/core';
import { Pokemon, PokemonList } from './models/pokemon.model';
import { POKEMON_LIST } from './data/pokemon-list.fake';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  pokemonList = signal<PokemonList>(POKEMON_LIST);

  size = (pokemon: Pokemon): string => {
    switch (true) {
      case pokemon.life < 15:
        return 'Petit';
      case pokemon.life > 25:
        return 'Grand';
      default:
        return 'Moyen';
    }
  };

  incrementLife(pokemon: Pokemon): void {
    pokemon.life = pokemon.life + 1;
  }

  decrementeLife(pokemon: Pokemon): void {
 pokemon.life = pokemon.life - 1;
  }
}
