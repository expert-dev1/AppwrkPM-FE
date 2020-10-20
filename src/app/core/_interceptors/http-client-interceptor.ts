import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';


@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

    constructor (private storageService: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const token = this.storageService.getToken();
        if (token) {
            const cloned = req.clone({headers: req.headers.set("Authorization", "Bearer " + token)});
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
