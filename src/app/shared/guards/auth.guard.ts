import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    href: string = '';

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        this.redirectToLogin();

        return true;
    }

    private redirectToLogin(): void {
        localStorage.clear();
        this.href = window.location.href = environment.appUrl;
        //this.router.navigate([this.href]);
    }

}