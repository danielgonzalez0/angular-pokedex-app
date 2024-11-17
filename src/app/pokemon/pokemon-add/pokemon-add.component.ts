import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getPokemonColor,
  Pokemon,
  POKEMON_RULES,
} from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe, NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-add',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink, NgStyle],
  templateUrl: './pokemon-add.component.html',
  styleUrl: './pokemon-add.component.css',
})
export class PokemonAddComponent {
  readonly DEFAULT_IMG: string =
    'https://www.pokepedia.fr/images/thumb/e/e2/Pok%C3%A9_Ball-RS.png/200px-Pok%C3%A9_Ball-RS.png';

  readonly POKEMON_RULES = signal(POKEMON_RULES).asReadonly();
  private readonly isSubmitted = signal<boolean>(false);
  updatePicture: string | null = null;
  //services
  readonly pokemonService = inject(PokemonService);
  readonly router = inject(Router);
  private pokemonSubscription!: Subscription;

  //instanciation du formulaire
  readonly pokemonForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    picture: new FormControl(this.DEFAULT_IMG, [Validators.required]),
    life: new FormControl(10),
    damage: new FormControl(1),
    types: new FormArray(
      [new FormControl('Normal')],
      [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
    ),
  });

  ngOnInit() {
    this.pokemonForm.get('picture')?.valueChanges.subscribe((url) => {
      this.updatePicture = url;
    });
  }

  //getter
  get isSubmit(): boolean {
    return this.isSubmitted();
  }

  //getter pour les validations de formulaire
  get pokemonName(): FormControl {
    return this.pokemonForm.get('name') as FormControl;
  }
  get pokemonPicture(): FormControl {
    return this.pokemonForm.get('picture') as FormControl;
  }
  get pokemonLife(): FormControl {
    return this.pokemonForm.get('life') as FormControl;
  }
  get pokemonDamage(): FormControl {
    return this.pokemonForm.get('damage') as FormControl;
  }
  get pokemonTypeList(): FormArray {
    return this.pokemonForm.get('types') as FormArray;
  }
  get PokemonTypeListSelected(): number {
    return this.pokemonTypeList.controls.length;
  }
  // méthodes

  /**
   * increment the life or damage of the selected pokemon
   */
  // Méthode générique pour incrémenter les valeurs de life ou damage
  increment(controlName: 'life' | 'damage'): void {
    const control = this.pokemonForm.get(controlName) as FormControl;
    if (control) {
      control.setValue(control.value + 1);
    }
  }
  /**
   * increment the life or damage of the selected pokemon
   */
  // Méthode générique pour incrémenter les valeurs de life ou damage
  decrement(controlName: 'life' | 'damage'): void {
    const control = this.pokemonForm.get(controlName) as FormControl;
    if (control) {
      control.setValue(control.value - 1);
    }
  }

  getPokemonColor(type: string): string {
    return getPokemonColor(type);
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

  onSubmit(): void {
    this.isSubmitted.set(true);
    if (this.pokemonForm.invalid) {
      return;
    }
    const pokemon: Omit<Pokemon, 'id'> = {
      name: this.pokemonName.value,
      picture: this.pokemonPicture.value,
      life: this.pokemonLife.value,
      damage: this.pokemonDamage.value,
      types: this.pokemonTypeList.controls.map((control) => control.value) as [
        string,
        string?,
        string?
      ],
      created: new Date(),
    };

    this.pokemonSubscription = this.pokemonService
      .addPokemon(pokemon)
      .subscribe((pokemonAdded) => {
        this.router.navigate(['/pokemons', pokemonAdded.id]);
      });
  }

  ngOnDestroy(): void {
    this.isSubmitted.set(false);
    if (this.pokemonSubscription){
      this.pokemonSubscription.unsubscribe();
    }
  }
}
