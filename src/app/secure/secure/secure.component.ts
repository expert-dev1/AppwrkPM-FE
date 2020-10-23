import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {
  events: string[] = [];
  opened: boolean = true;
  constructor(private tokenStorageService: StorageService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  menuList = [
    {
      title:'Role Master', icon:'person' ,routerLink:'/secure/masterSetup/roles'
    },
    {
      title:'Designation', icon:'layers' ,routerLink:'/secure/masterSetup/designation'
    },
    {
      title:'Employee', icon:'people' ,routerLink:'/secure/masterSetup/employee'
    },
    {
      title:'Projects', icon:'assignment_ind' ,routerLink:'/secure/masterSetup/projects'
    },
    {
      title:'Organisation', icon:'business' ,routerLink:'/secure/masterSetup/organisation'
    }
  ]

  ngOnInit(): void {
  }

  toggleClick(){
    this.opened=!this.opened;
  }

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigate(["login"]);
  }

}
