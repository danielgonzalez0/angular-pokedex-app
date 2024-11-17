import { Observable, of } from 'rxjs';
import { POKEMON_LIST } from '../data/pokemon-list.fake';
import { Pokemon, PokemonList } from '../models/pokemon.model';
import { PokemonService } from './pokemon.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class PokemonLocalStorageService implements PokemonService {
  private localStorageKey = 'pokemons';

  // Initialise les données dans le localStorage si elles n'existent pas encore

  private initializePokemons(): void {
    const storedPokemons = localStorage.getItem(this.localStorageKey);
    if (!storedPokemons) {
      const initialPokemons: Pokemon[] = POKEMON_LIST;
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(initialPokemons)
      );
    }
  }

  // Récupère la liste des Pokémons depuis le localStorage.

  private getPokemonsFromStorage(): Pokemon[] {
    this.initializePokemons();
    const pokemons = localStorage.getItem(this.localStorageKey);
    return pokemons ? JSON.parse(pokemons) : [];
  }

  // Sauvegarde la liste des Pokémons dans le localStorage.

  private savePokemonsToStorage(pokemons: Pokemon[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(pokemons));
  }

  // Retourne la liste de tous les Pokémons.

  getPokemonList(): Observable<PokemonList> {
    const pokemons = this.getPokemonsFromStorage();
    return of(pokemons);
  }

  // Retourne le pokémon avec l'identifiant passé en paramètre.

  getPokemon(id: number): Observable<Pokemon> {
    const pokemons = this.getPokemonsFromStorage();
    const pokemon = pokemons.find((p) => p.id === id);
    return of(pokemon!); // Utilise '!' car le pokémon existe toujours.
  }

  // Met à jour un pokémon existant.

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const pokemons = this.getPokemonsFromStorage();
    const index = pokemons.findIndex((p) => p.id === pokemon.id);
    if (index !== -1) {
      pokemons[index] = pokemon;
      this.savePokemonsToStorage(pokemons);
    }
    return of(pokemon);
  }

  // Supprime un pokémon.

  deletePokemon(pokemonId: number): Observable<void> {
    let pokemons = this.getPokemonsFromStorage();
    pokemons = pokemons.filter((p) => p.id !== pokemonId);
    this.savePokemonsToStorage(pokemons);
    return of(void 0);
  }

  // Ajoute un pokémon.

  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    const pokemons = this.getPokemonsFromStorage();
    const newPokemon: Pokemon = {
      id: pokemons.length + 1,
      ...pokemon,
    };
    pokemons.push(newPokemon);
    this.savePokemonsToStorage(pokemons);
    return of(newPokemon);
  }

  // Retourne la liste des types valides pour un pokémon.

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
