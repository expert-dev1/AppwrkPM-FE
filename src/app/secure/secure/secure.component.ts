import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {
  events: string[] = [];
  opened: boolean = true;
  constructor(private storageService: StorageService, private router: Router,
    private authService: AuthService, public dialog: MatDialog, private toastr: ToastrService, private messageService: MessageService) { }

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
    },
    {
      title:'Organization Calender', icon:'date_range' ,routerLink:'/secure/masterSetup/organizationCalender'
    }
  ]

  ngOnInit(): void {
  }

  toggleClick(){
    this.opened=!this.opened;
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

  openPopUpForChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '500px',
      disableClose: true,
      position: {top: '2%'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        let messageObj = this.messageService.getMessage("PASSWORD_CHANGED_SUCCESSFULLY");
          if (messageObj) {
            this.toastr.success(messageObj.description, messageObj.type);
          }
      }
    })
  }

}
