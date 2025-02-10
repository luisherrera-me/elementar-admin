import { CanActivateFn } from '@angular/router';

export const authLoginGuard: CanActivateFn = (route, state) => {
  return true;
};
