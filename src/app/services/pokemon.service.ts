import { inject, Injectable } from '@angular/core';
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

  getPokemon(pokemonId: number): Observable<Pokemon> {
    const url = this.http.get<Pokemon>(`${this.POKEMON_API_URL}/${pokemonId}`);
    console.log('url', url);
    return this.http.get<Pokemon>(`${this.POKEMON_API_URL}/${pokemonId}`);
  }

  // getPokemon(pokemonId: number): Pokemon {
  //   const pokemon = POKEMON_LIST.find((pokemon) => pokemon.id === pokemonId);
  //   if (!pokemon) {
  //     throw new Error(`no pokemon found with id ${pokemonId}`);
  //   }
  //   return pokemon;
  // }

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
