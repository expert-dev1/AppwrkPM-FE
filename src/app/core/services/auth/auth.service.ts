import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'
import { StorageService } from '../storage/storage.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API = environment.AUTH_API;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storageService: StorageService) { }


  errorHandler(error) {
    try {
      return throwError(error);
    } catch (ex) {
      // console.log(ex);
    }
    if (error) {
      return throwError(error);
    } else {
      return throwError("The action could not be completed due to an internal error. Try the action again.");
    }
  }

  successResponse(response) {
    try {
      if (response && response.data) {
        return response.data;
      } else if (response) {
        return response.json().data;
      }
    } catch (ex) { }
    return response;
  }

  login(data): Observable<any> {
    let url = AUTH_API + 'login';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  refreshToken(): Observable<any> {
    console.log('inside get referesh token');
    const refreshToken = this.storageService.getRefereshToken();
    const data = {
      "refreshToken": refreshToken,
      "userId": this.storageService.getUser().userId,
      "employeeId": this.storageService.getUser().employeeId
    }
    let url = AUTH_API + 'getRefreshToken';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        // this.storageService.saveAccessToken(response);
        // this.storageService.saveRefereshToken(response);
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  signOut(userId): Observable<any> {
    let url = AUTH_API + 'logout?userId=' + userId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }
}
