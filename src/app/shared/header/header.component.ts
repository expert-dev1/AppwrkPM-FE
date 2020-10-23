import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: any;
  public loggedInUserName: string = "Admin";


  constructor(private storageService: StorageService, private router: Router,
    private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.activatedRoute.url.subscribe(() => {
      // this.user = this.tokenStorageService.getUser().employee;
      // if (this.user && this.user != null && this.user != undefined) {        
      //   this.loggedInUserName = this.user.fullName;
      // }
    })
  }

  ngOnInit() {

  }

  logout() {
    let userId = this.storageService.getUser().userId;
    this.authService.signOut(userId).subscribe(data => {
      if (data && data.data) {
        this.storageService.signOut();
        // window.location.reload();
        this.router.navigate(["login"]);
      }
    }, error => {
      console.log('Errpr in logout : ', error);
    });
  }

  refreshPage() {
    window.location.reload();
  }
}
