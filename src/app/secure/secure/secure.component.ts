import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';
import { PERMISSIONS } from 'src/app/core/modals/permission-model';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {
  events: string[] = [];
  opened: boolean = true;
  constructor(private storageService: StorageService, private router: Router,
    private authService: AuthService, public dialog: MatDialog, private toastr: ToastrService, 
    private messageService: MessageService) { }

  public menuList = [    
    {
      title:'Dashboard', icon:'dashboard', capsName:'EMPLOYEE_TIME_SHEET', routerLink:'/secure/dashboard/employeeDashboard'
    },
    {
      title:'Organisation', icon:'business', capsName:'ORGANIZATION', routerLink:'/secure/masterSetup/organisation'
    },
    {
      title:'Role Master', icon:'person', capsName:'ROLE_MASTER', routerLink:'/secure/masterSetup/roles', 
    },
    {
      title:'Designation', icon:'layers', capsName:'DESIGNATION', routerLink:'/secure/masterSetup/designation'
    },
    {
      title:'Skill Master', icon:'school', capsName:'SKILL_MASTER', routerLink:'/secure/masterSetup/skills'
    },
    {
      title:'Employee', icon:'people', capsName:'EMPLOYEE' , routerLink:'/secure/masterSetup/employee'
    },    
    {
      title:'Mark Attendance', icon:'published_with_changes', capsName:'MARK_UNMARK_ATTENDANCE', routerLink:'/secure/timeSheet/attendance'
    },
    {
      title:'Projects', icon:'assignment_ind', capsName:'PROJECT', routerLink:'/secure/masterSetup/projects'
    },
    {
      title:'Organization Calender', icon:'date_range', capsName:'ORGANIZATION_CALENDAR', routerLink:'/secure/masterSetup/organizationCalender'
    },
    {
      title:'Time-sheet', icon:'assignment_turned_in', capsName:'EMPLOYEE_TIME_SHEET', routerLink:'/secure/timeSheet/employeeTimeSheet'
    },
    {
      title:'Time-sheet status change', icon:'supervised_user_circle', capsName:'TIME_SHEET_STATUS_CAHNGE', routerLink:'/secure/timeSheet/statusChange'
    },
    {
      title:'Employee Attendance Report', icon:'grading', capsName:'EMPLOYEE_ATTENDANCE_REPORT', routerLink:'/secure/timeSheet/attendanceReport'
    },
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

  hideOrShowModuleButton(capsNameOfModule) {
    let weatherModuleIsVissibleToUserOrNot = false;
    let userRolesIdsList = this.storageService.getUserRoles();
    let permissionsOfModule = PERMISSIONS[capsNameOfModule];
    if (permissionsOfModule && permissionsOfModule != undefined && permissionsOfModule != null) {
      weatherModuleIsVissibleToUserOrNot = userRolesIdsList.some(item => permissionsOfModule.includes(item));
      return weatherModuleIsVissibleToUserOrNot;
    }
    return weatherModuleIsVissibleToUserOrNot;
  }

}
