import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Resolve, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthResolver implements Resolve<void> {
    href: string = '';

    constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    async ngOnInit(): Promise<void> { }

    resolve(): void {

        this.href = window.location.href = environment.appUrl;
        this.router.navigate([this.href]);

    }
}
