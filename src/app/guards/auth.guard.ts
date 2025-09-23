import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: Auth) {}

  async canActivate(): Promise<boolean | UrlTree> {
    // Espera un momento a que Firebase exponga el usuario
    const uid = await this.auth.waitForUid?.(1500) ?? this.auth.getUid();
    if (uid) return true;
    return this.router.parseUrl('/login');
  }
}
