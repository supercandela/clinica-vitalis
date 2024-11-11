import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role']; // Recibe el rol esperado desde la ruta
    const user = this.authService.usuarioActual; // Obtiene el usuario actual (debe incluir su rol)

    if (user && user.tipo === expectedRole) {
      return true; // Permite acceso si el rol coincide
    }

    // Redirige al usuario a una página de acceso denegado o login
    this.router.navigateByUrl('**');
    return false;
  }
}
