import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const nationalGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  return authService.reauthenticateUser('national');
};
