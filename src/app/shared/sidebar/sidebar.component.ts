import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public selectedItem: any;
  public userDetails: any;
  constructor(private tokenStorageService: StorageService, public router: Router) {
    // this.userDetails = this.tokenStorageService.getUser().employee;
    let routedUrl = this.router.url.split("/");
    if (routedUrl.length > 0) {
      this.selectedItem = routedUrl[3];
    }
  }

  ngOnInit(): void {
  }

  // 'user','secure', 'admin'
  setAction(tab, module, subModule) {
    this.selectedItem = tab;
    this.router.navigate([module + '/' + subModule +'/' + tab]);
  }
}
