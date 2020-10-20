import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public user: any;
  public loggedInUserName: string = "Admin";


  constructor(private tokenStorageService: StorageService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
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
    this.tokenStorageService.signOut();
    // window.location.reload();
    this.router.navigate(["login"]);
  }

  refreshPage() {
    window.location.reload();
  }
}
