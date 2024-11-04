import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { JsonPipe, NgStyle } from '@angular/common';
import { getPokemonColor } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, JsonPipe, NgStyle],
  templateUrl: './pokemon-edit.component.html',
  styleUrl: './pokemon-edit.component.css',
})
export class PokemonEditComponent {
  readonly route = inject(ActivatedRoute);
  readonly pokemonService = inject(PokemonService);
  readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));
  readonly pokemon = signal(
    this.pokemonService.getPokemon(this.pokemonId)
  ).asReadonly();

  //instanciation du formulaire
  readonly form = new FormGroup({
    name: new FormControl(this.pokemon().name),
    life: new FormControl(this.pokemon().life),
    damage: new FormControl(this.pokemon().damage),
    types: new FormArray(
      this.pokemon().types.map((type) => new FormControl(type))
    ),
  });

  //form array pour les types

  /**
   * return the selected pokemon types
   */
  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
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
    console.log(this.form.value);
  }
}

