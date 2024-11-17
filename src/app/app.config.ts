import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { PokemonAddComponent } from './pokemon/pokemon-add/pokemon-add.component';
import { PokemonService } from './services/pokemon.service';
import { PokemonLocalStorageService } from './services/pokemon-local-storage.service';
import { PokemonJSONServerService } from './services/pokemon-json-server.service';
import { environment } from '../environments/environment';

function pokemonServiceFactory(): PokemonService {
  return environment.production
    ? new PokemonLocalStorageService()
    : new PokemonJSONServerService();
}

// 👇
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'page de connexion',
  },
  {
    path: 'pokemons',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: PokemonListComponent,
        title: 'Pokedex',
      },
      {
        path: 'create',
        component: PokemonAddComponent,
        title: 'Pokemon',
      },
      {
        path: 'edit/:id',
        component: PokemonEditComponent,
        title: 'Pokémon',
      },
      {
        path: ':id',
        component: PokemonProfileComponent,
        title: 'Pokemon',
      },
    ],
  },
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: 'Page not found' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: PokemonService, useFactory: pokemonServiceFactory },
  ],
};
