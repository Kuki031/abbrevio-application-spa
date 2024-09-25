import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem("Bearer");

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem("Bearer");

  if (isLoggedIn) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};