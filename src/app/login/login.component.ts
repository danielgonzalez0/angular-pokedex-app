import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly name = signal<string>('');
  readonly password = signal<string>('');
  readonly message = signal<string>(`Vous êtes déconnecté.`);
  private loginSubscription!: Subscription;
  public readonly isLoading = signal<boolean>(true);

  ngOnInit() {
    this.checkLocalStorageConnection();
    this.checkauthentification(false);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.message.set('Tentative de connexion en cours ...');
    this.isLoading.set(true);
    this.checkauthentification(true);
    this.persistConnection();

  }

  persistConnection(): void {
    localStorage.setItem(
      'app-pokedex',
      JSON.stringify({ id: this.name(), mpd: this.password() })
    );
  }

  checkLocalStorageConnection() {
    const data = localStorage.getItem('app-pokedex');
    if (data) {
      const { id, mpd } = JSON.parse(data);
      this.name.set(id);
      this.password.set(mpd);
    }
    this.isLoading.set(false);
  }

  checkauthentification(isOnSubmit: boolean): void {
    this.loginSubscription = this.authService
      .login(this.name(), this.password())
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.name.set('');
          this.password.set('');
          if (isOnSubmit) {
            this.message.set('Échec de la connexion. Veuillez réessayer.');
          }
          return;
        }
        this.isLoading.set(false);
        this.router.navigate(['/pokemons']);
      });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
