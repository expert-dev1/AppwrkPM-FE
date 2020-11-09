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
  public isLogin = false;
  public roleIdList = [];  
  public roleAs: string;
  constructor(private http: HttpClient, private storageService: StorageService) { }

  /**
   * @author Amit Malik
   * @description This function throws the error or exception to the method from which it is invoked
   * @param error Error from backend
   */
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

  /**
   * @author Amit Malik
   * @description This function sends the data or response of the API
   * @param response response or data from API
   */
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

  /**
   * @author Amit Malik
   * @description This function saves the data in the session storage when user login in the application
   * @param loginInUserDetails Login user details when user logged in then all the details should be stored in the session storage
   */
  afterLoginSetSomeDetails(loginInUserDetails) {
    this.storageService.saveAccessToken(loginInUserDetails.accessToken);
    this.storageService.saveRefereshToken(loginInUserDetails.refreshToken);
    this.storageService.saveUser(loginInUserDetails.user);    
    this.roleIdList = loginInUserDetails.roleList;
    this.storageService.saveUserRoles(loginInUserDetails.roleList);
    this.isLogin = loginInUserDetails.isLoggedIn
  }

  /**
   * @author Amit Malik
   * @description When user lick on the login button then this method invoke which hits the API on the backend
   * @param data login form 
   */
  login(data): Observable<any> {
    let url = AUTH_API + 'login';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description This method is invoked when token for user expires then to get the refershed token from backend API 
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.storageService.getRefereshToken();
    const data = {
      "refreshToken": refreshToken,
      "userId": this.storageService.getUser().userId,
      "employeeId": this.storageService.getUser().employeeId
    }
    let url = AUTH_API + 'getRefreshToken';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        this.setRefershTokenAndJWTInStorage(response);
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description this. method is used to set / save the refersh token and updated JWT in tghe session storage
   * @param response data from backend for referesh token
   */
  setRefershTokenAndJWTInStorage(response) {
    this.storageService.saveAccessToken(response.data.data.jwtToken);
    this.storageService.saveRefereshToken(response.data.data.refershToken);
  }

  /**
   * @author Amit Malik
   * @description When user click on logout button then back end API hits to change some details in the user
   * @param userId Logged in user id
   */
  signOut(userId): Observable<any> {
    this.isLogin = false;
    let url = AUTH_API + 'logout?userId=' + userId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description When user wants to change the password the this method invokes which hits the change password API on the backend
   * @param data change password form
   */
  changePassword(data: any): Observable<any> {
    let url = AUTH_API + 'changePassword';
    return this.http.post(url,data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }
}
