import { Component, computed, inject, signal } from '@angular/core';
import { Pokemon, PokemonList } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { CreateSignal } from '../../utils/CreateSignal';
import { DatePipe } from '@angular/common';
import { PokemonBorderDirective } from '../../directives/pokemon-border.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonBorderDirective, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent {
  private readonly pokemonService = inject(PokemonService);
  readonly searchTerm = signal<string>('');
  pokemonList = signal<PokemonList>(this.pokemonService.getPokemonList());
  filteredPokemonList = computed<PokemonList>(() => this.filterPokemonList());
  count = new CreateSignal(0);

  // On place `watch()` ici pour s'assurer qu'il est appelé une seule fois
  constructor() {
    this.count.watch(() =>
      console.log('Compteur mis à jour :', this.count.call())
    );
  }

  increment(): void {
    this.count.update((n) => n + 1);
  }
  decrement(): void {
    this.count.update((n) => n - 1);
  }

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

  searchTermCase(): string {
    return this.searchTerm().toLowerCase().trim();
  }

  filterPokemonList(): PokemonList {
    if (this.searchTermCase() === '') {
      return this.pokemonList();
    } else {
      return this.pokemonList().filter((pokemon) =>
        pokemon.name.toLowerCase().includes(this.searchTermCase())
      );
    }
  }
}