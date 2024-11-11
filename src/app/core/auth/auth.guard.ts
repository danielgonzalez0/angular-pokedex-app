import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  console.info('Le guard a bien été appelé !');
  const authService = inject(AuthService)
  const router = inject(Router)

  if(!authService.isLoggedIn()){
    router.navigate(['/login'])
    return false
  }

  return true;
};
