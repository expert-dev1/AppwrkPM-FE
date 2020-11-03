import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';


@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

    private refreshingInProgress: boolean;
    private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private storageService: StorageService,
        private authService: AuthService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.storageService.getAccessToken();
        return next.handle(this.addAuthorizationHeader(req)).pipe(
            catchError(err => {
                // in case of 401 http error
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    // get refresh tokens
                    const refreshToken = this.storageService.getRefereshToken();
                    // if there are tokens then send refresh token request
                    if (refreshToken) {
                        console.log('check hit for referesh token');
                        return this.refreshToken(req, next);
                    }
                    // otherwise logout and redirect to login page
                    return this.logoutAndRedirect(err);
                }
                // in case of 403 http error (refresh token failed)
                if (err instanceof HttpErrorResponse && err.status === 403) {
                    // logout and redirect to login page
                    return this.logoutAndRedirect(err);
                }
                // if error has status neither 401 nor 403 then just return this error
                return throwError(err);
            })
        );
    }

    private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
        const token = this.storageService.getAccessToken();
        if (token) {
            return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }
        return request;
    }

    private logoutAndRedirect(err): Observable<HttpEvent<any>> {
        let userId = this.storageService.getUser().userId;
        this.authService.signOut(userId).subscribe(data => {
            if (data) {
                this.storageService.signOut();
                this.router.navigateByUrl('/login');
            }
        }, error => {
            console.log('Error in signing out by intercepter : ', error);
        });
        return throwError(err);
    }

    private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('inside get regeresh token method in interceptors');
        if (!this.refreshingInProgress) {
            this.refreshingInProgress = true;
            this.accessTokenSubject.next(null);
            return this.authService.refreshToken().pipe(
                switchMap((res) => {
                    this.refreshingInProgress = false;
                    this.accessTokenSubject.next(res.accessToken);
                    // repeat failed request with new token
                    return next.handle(this.addAuthorizationHeader(request));
                })
            );
        } else {
            // wait while getting new token
            return this.accessTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    // repeat failed request with new token
                    return next.handle(this.addAuthorizationHeader(request));
                }));
        }
    }
}
