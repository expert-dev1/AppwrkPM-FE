import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const ACCESS_TOKEN_KEY = 'access-token';
const REFERESH_TOKEN_KEY = 'referesh_token';
const USER_KEY = 'auth-user';
const USER_ROLE_LIST_KEY = 'auth-user-role-list';
const USER_CHECK_IN_CHECK_OUT = 'user-check-in-check-out';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private router: Router) {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  /**
   * @author Amit Malik
   * @description Attach a click event to the document. When the user clicks anywhere in the document
   */
  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  /**
   * @author Amit Malik
   * @description when user logout then user details and all the detials should be deleted or cleared from the local storage
   */
  signOut() {
    window.sessionStorage.clear();
  }

  /**
   * @author Amit Malik
   * @description to check weather token is present or not
   * @param event Event
   */
  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      try {
        let loginToken = this.getAccessToken();
        if (loginToken == undefined) {
          this.router.navigate(['/login']);
        }
      }
      catch (e) { }
      // this.onSubject.next({ key: event.key, value: v });
    }
  }

  /**
   * @author Amit Malik
   * @description remove the attched event
   */
  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
  }

  /**
   * @author Amit Malik
   * @description Save the JWT in the local storage
   * @param accessToken Access Token or JWT
   */
  public saveAccessToken(accessToken) {
    // var encryptedData = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  /**
   * @author Amit Malik
   * @description Save the Refersh Token in the local storage
   * @param accessToken Refersh Token
   */
  public saveRefereshToken(refereshToken) {
    // var encryptedData = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    window.sessionStorage.removeItem(REFERESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFERESH_TOKEN_KEY, refereshToken);
  }

  /**
   * @author Amit Malik
   * @description To remove the user details or any field which is in the loca;l or session storage with the help of key
   * @param key Key which is present in the local storage from which we can access data from the session or local storage
   */
  public delete(key) {
    window.localStorage.removeItem(key);
  }

  /**
   * @author Amit Malik
   * @description Get the access token or JWT
   */
  public getAccessToken(): string {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * @author Amit Malik
   * @description Get the Referesh token
   */
  public getRefereshToken(): string {
    // var encryptedData = window.sessionStorage.getItem(TOKEN_KEY);
    // if (encryptedData)
    //   return CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return window.sessionStorage.getItem(REFERESH_TOKEN_KEY);
  }

  /**
   * @author Amit Malik
   * @description save the User details
   */
  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * @author Amit Malik
   * @description get the User details
   */
  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }  

  /**
   * @author Amit Malik
   * @description Save the user check-in / check-out status for attendance
   * @param attendanceRecord User Attendance record weather user is check-in or check out
   */
  public saveUserCheckInCheckOutStatus(attendanceRecord) {
    window.sessionStorage.removeItem(USER_CHECK_IN_CHECK_OUT);
    window.sessionStorage.setItem(USER_CHECK_IN_CHECK_OUT, JSON.stringify(attendanceRecord));
  }

  /**
   * @author Amit Malik
   * @description Get user check-in / check-out status
   */
  public getUserCheckInCheckOutStatus() {
    return JSON.parse(sessionStorage.getItem(USER_CHECK_IN_CHECK_OUT));
  }

  /**
   * @author Amit Malik
   * @description Save the user roles ids for the Authorization purpose
   * @param userRoleIdList User role list for Authorization or Auth Guard
   */
  public saveUserRoles(userRoleIdList) {
    window.sessionStorage.removeItem(USER_ROLE_LIST_KEY);
    let userRoleIdsListToSave = [];
    if (userRoleIdList && userRoleIdList != undefined && userRoleIdList != null) {
      userRoleIdList.forEach(element => {
        userRoleIdsListToSave.push(element.roleMasterId);
      });
      window.sessionStorage.setItem(USER_ROLE_LIST_KEY, JSON.stringify(userRoleIdsListToSave));
    }
  }

  /**
   * @author Amit Malik
   * @description Get user ROles for the permissions / for checkking weather the user have the permission to access the module or not
   */
  public getUserRoles() {
    return JSON.parse(sessionStorage.getItem(USER_ROLE_LIST_KEY));
  }

  /**
   * @author Amit Malik
   * @description remove all keys or details when user logs out
   */
  public clearAll() {
    window.localStorage.clear();
  }
  
}
