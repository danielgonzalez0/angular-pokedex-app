import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DatePipe, NgStyle } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';
import { getPokemonColor } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-profile',
  standalone: true,
  imports: [DatePipe, RouterLink, PageNotFoundComponent, NgStyle],
  templateUrl: './pokemon-profile.component.html',
  styleUrl: './pokemon-profile.component.css',
})
export class PokemonProfileComponent {
  //injection de dependance pour récupérer méthodes et attributs de la classe ActivatedRoute et PokemonService
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly pokemonService = inject(PokemonService);
  //récupération de l'id du pokemon à partir de l'url
  readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));
  //récupération des informations du pokemon à partir de l'id et gestion des erreurs
  private readonly pokemonResponse = toSignal(
    this.pokemonService.getPokemon(this.pokemonId).pipe(
      map((value) => ({ value, error: undefined })),
      catchError((error) => of({ value: undefined, error }))
    )
  );

  // En attente de la réponse HTTP

  readonly loading = computed(() => !this.pokemonResponse());

  // Cas d'erreur HTTP

  readonly error = computed(() => this.pokemonResponse()?.error);

  // Cas de succès HTTP

  readonly pokemon = computed(() => this.pokemonResponse()?.value);

  // constructor() {
  //   console.log('route', this.route);
  //   console.log('pokemonId', this.pokemonId);
  //   console.log('pokemon', this.pokemon());
  // }

  getPokemonColor(type: string): string {
    if (!type) return 'black';
    return getPokemonColor(type);
  }

  deletePokemon(pokemonId: number) {
    this.pokemonService.deletePokemon(pokemonId).subscribe(() => {
      this.router.navigate(['/pokemons']);
    });
  }
}
