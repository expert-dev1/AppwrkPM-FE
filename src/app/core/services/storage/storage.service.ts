import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const ACCESS_TOKEN_KEY = 'access-token';
const REFERESH_TOKEN_KEY = 'referesh_token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private secretKey: string = "appwrkPM@2020";

  constructor(private router: Router) {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  signOut() {
    window.sessionStorage.clear();
  }

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

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
  }

  public saveAccessToken(accessToken) {
    // var encryptedData = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  public saveRefereshToken(refereshToken) {
    // var encryptedData = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    window.sessionStorage.removeItem(REFERESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFERESH_TOKEN_KEY, refereshToken);
  }

  public delete(key) {
    window.localStorage.removeItem(key);
  }

  public getAccessToken(): string {
    // var encryptedData = window.sessionStorage.getItem(TOKEN_KEY);
    // if (encryptedData)
    //   return CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefereshToken(): string {
    // var encryptedData = window.sessionStorage.getItem(TOKEN_KEY);
    // if (encryptedData)
    //   return CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return window.sessionStorage.getItem(REFERESH_TOKEN_KEY);
  }

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  // remove all keys
  public clearAll() {
    window.localStorage.clear();
  }
}
