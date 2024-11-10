import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe, NgStyle } from '@angular/common';
import {
  getPokemonColor,
  Pokemon,
  POKEMON_RULES,
} from '../../models/pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    JsonPipe,
    NgStyle,
    PageNotFoundComponent,
  ],
  templateUrl: './pokemon-edit.component.html',
  styleUrl: './pokemon-edit.component.css',
})
export class PokemonEditComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly pokemonService = inject(PokemonService);
  readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));
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

  readonly POKEMON_RULES = signal(POKEMON_RULES).asReadonly();

  //instanciation du formulaire
  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),

    life: new FormControl(),
    damage: new FormControl(),
    types: new FormArray(
      [],
      [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
    ),
  });

  constructor() {
    //fn qui se déclenche une fois à la réponse req http
    effect(() => {
      const pokemon = this.pokemon();
      if (pokemon) {
        this.form.patchValue({
          name: pokemon.name,
          life: pokemon.life,
          damage: pokemon.damage,
        });
        pokemon.types.forEach((type) => {
          //Form array vide et on lui passe des formControls pour chaque type
          this.pokemonTypeList.push(new FormControl(type));
        });
      }
    });
  }

  //validation du formulaire
  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl;
  }

  //form array pour les types
  /**
   * return the selected pokemon types
   */
  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  get PokemonTypeListSelected(): number {
    return this.pokemonTypeList.controls.length;
  }

  /**
   * return if given type is selected or not
   */
  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  /**
   * Add or remove a given type in the selected Pokemon list.
   */
  onPokemonTypeChange(type: string, isChecked: boolean): void {
    if (isChecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);
      this.pokemonTypeList.removeAt(index);
    }
    console.log(this.PokemonTypeListSelected);
  }

  /**
   * increment the life or damage of the selected pokemon
   */
  // Méthode générique pour incrémenter les valeurs de life ou damage
  increment(controlName: 'life' | 'damage'): void {
    const control = this.form.get(controlName) as FormControl;
    if (control) {
      control.setValue(control.value + 1);
    }
  }
  /**
   * increment the life or damage of the selected pokemon
   */
  // Méthode générique pour incrémenter les valeurs de life ou damage
  decrement(controlName: 'life' | 'damage'): void {
    const control = this.form.get(controlName) as FormControl;
    if (control) {
      control.setValue(control.value - 1);
    }
  }

  getPokemonColor(type: string): string {
    return getPokemonColor(type);
  }

  onSubmit() {
    const isFormValid = this.form.valid;
    const pokemon = this.pokemon();

    if (isFormValid && pokemon) {
      const updatedPokemon: Pokemon = {
        ...pokemon,
        name: this.pokemonName.value as string,
        life: this.pokemonLife.value,
        damage: this.pokemonDamage.value,
        types: this.pokemonTypeList.value,
      };

      this.pokemonService.updatePokemon(updatedPokemon).subscribe(() => {
        this.router.navigate(['/pokemons', this.pokemonId]);
      });
    }
  }
}
