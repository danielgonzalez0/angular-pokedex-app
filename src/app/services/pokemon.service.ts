import { Injectable } from '@angular/core';
import { POKEMON_LIST } from '../data/pokemon-list.fake';
import { Pokemon, PokemonList } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  getPokemonList(): PokemonList {
    return POKEMON_LIST;
  }

  getPokemon(pokemonId: number): Pokemon {
    const pokemon = POKEMON_LIST.find((pokemon) => pokemon.id === pokemonId);
    if (!pokemon) {
      throw new Error(`no pokemon found with id ${pokemonId}`);
    }
    return pokemon;
  }

  getPokemonTypes():string[]{
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
