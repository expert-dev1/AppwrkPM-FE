import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router, private storageService: StorageService,
    private toastr: ToastrService, private messageService: MessageService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any) {
    let userDetails = this.storageService.getUser();
    if (userDetails) {
      let userRoleIdList = this.storageService.getUserRoles();
      let appliedRoleOnRoutes = route.data.role;
      if (appliedRoleOnRoutes && appliedRoleOnRoutes != undefined && appliedRoleOnRoutes != null) {
        let count = 0;
        for (let userRole of appliedRoleOnRoutes) {
          let ifUserHavePermission = userRoleIdList.find(obj => obj == userRole);
          if (ifUserHavePermission && ifUserHavePermission != undefined && ifUserHavePermission != null) {
            count++;
          }
        }
        if (count > 0) {
          return true;
        } else {
          let messageObj = this.messageService.getMessage("USER_NOT_AUTHORIZED_TO_ACCESS_THESE_MODULES");
          if (messageObj) {
            this.toastr.error(messageObj.description, messageObj.type);
          }
          this.authService.signOut(userDetails.userId);
          this.router.navigate(['/login']);
          return false;
        }
      }
    }
    let messageObj = this.messageService.getMessage("UN_AUTHORIZED_USER");
    if (messageObj) {
      this.toastr.error(messageObj.description, messageObj.type);
    }
    this.authService.signOut(userDetails.userId);
    this.router.navigate(['/login']);
    return false;
  }

}
