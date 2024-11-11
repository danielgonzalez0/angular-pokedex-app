import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './login/login.component';

// 👇
const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    title: 'page de connexion'
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
  ],
};
