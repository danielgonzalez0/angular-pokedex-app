import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pokemon-profile',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './pokemon-profile.component.html',
  styleUrl: './pokemon-profile.component.css',
})
export class PokemonProfileComponent {
  //injection de dependance pour récupérer méthodes et attributs de la classe ActivatedRoute et PokemonService
  readonly route = inject(ActivatedRoute);
  readonly pokemonService = inject(PokemonService);
  //récupération de l'id du pokemon à partir de l'url
  readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));
  //récupération des informations du pokemon à partir de l'id
  readonly pokemon = toSignal(
    this.pokemonService.getPokemon(this.pokemonId)
  );

  constructor(){
    console.log('route', this.route);
    console.log('pokemonId', this.pokemonId);
    console.log('pokemon', this.pokemon());
  }
}
