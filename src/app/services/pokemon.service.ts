import { Observable } from 'rxjs';
import { Pokemon, PokemonList } from '../models/pokemon.model';

export abstract class PokemonService {
  abstract getPokemonList(): Observable<PokemonList>;
  abstract getPokemon(id: number): Observable<Pokemon>;
  abstract updatePokemon(pokemon: Pokemon): Observable<Pokemon>;
  abstract deletePokemon(pokemonId: number): Observable<void>;
  abstract addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>;
  abstract getPokemonTypes(): string[];
}
