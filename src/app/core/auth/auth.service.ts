import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isLoggedIn = signal<Boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

login(name: string, password: string): Observable<boolean> {
    // Faites appel à un autre service d'authentification si besoin ...
    const isLoggedIn = name === 'Pikachu#' && password === 'Pikachu#';
    this._isLoggedIn.set(isLoggedIn);

    return of(isLoggedIn).pipe(delay(1000));
  }
}
