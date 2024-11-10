import { inject, Injectable } from '@angular/core';
import { POKEMON_LIST } from '../data/pokemon-list.fake';
import { Pokemon, PokemonList } from '../models/pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly POKEMON_API_URL = 'http://localhost:3000/pokemons';

  getPokemonList(): Observable<PokemonList> {
    return this.http.get<PokemonList>(this.POKEMON_API_URL);
  }

  getPokemon(pokemonId: number): Pokemon {
    const pokemon = POKEMON_LIST.find((pokemon) => pokemon.id === pokemonId);
    if (!pokemon) {
      throw new Error(`no pokemon found with id ${pokemonId}`);
    }
    return pokemon;
  }

  getPokemonTypes(): string[] {
    return [
      'Plante',
      'Feu',
      'Eau',
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Vol',
    ];
  }
}
