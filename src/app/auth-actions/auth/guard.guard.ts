import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!localStorage.getItem("Bearer");

  if (isLoggedIn) {
    const router = new Router();
    router.navigate(['/home']);
    return false;
  }

  return true;
};