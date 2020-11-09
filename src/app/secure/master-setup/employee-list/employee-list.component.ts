import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { STATUS_MAP } from 'src/app/core/modals/constant';
import { MessageService } from 'src/app/core/services/message/message.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { SearchModel } from 'src/app/shared/models/search-model';
import { EmployeeMasterComponent } from '../employee-master/employee-master.component';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  public columnsToBeDisplayed: string[] = ["empCode", "firstName", "lastName", "status", "designation.name", "emailId", "action"];
  public limit: number = 10;
  public offset: number = 0;
  public employeeList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;
  public statusMap = STATUS_MAP;

  constructor(private storageService: StorageService, private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService,
    private messageService: MessageService) {
      this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
      this.getEmployeeListByOrgIdWithPagination();
  }

  ngOnInit(): void {
  }

  getEmployeeListByOrgIdWithPagination() {
    this.masterService.getEmployeeListByOrgIdWithPagination(this.searchModel).subscribe(data => {
      if (data && data.data) {
        this.employeeList = data.data.content;
        this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error in fetching Employee Master List : ', error.error.message);
    })
  }

  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getEmployeeListByOrgIdWithPagination();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getEmployeeListByOrgIdWithPagination();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getEmployeeListByOrgIdWithPagination();
    }
  }

  openPopUp(employeeId, action) {
    if (action == 'delete') {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.changeStatusOfEmployee(employeeId);
        }
      })
    } else {
      const dialogRef = this.dialog.open(EmployeeMasterComponent, {
        width: '1200px',
        height: '600px',
        data: { employeeId: employeeId, action: action },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('result after save : ', result)
        if (result) {
          if (result.success) {
            if (result.action == 'add') {
              let messageObj = this.messageService.getMessage("SAVE");
              if (messageObj) {
                this.toastr.success(messageObj.description, messageObj.type);
              }
            } else {
              let messageObj = this.messageService.getMessage("UPDATE");
              if (messageObj) {
                this.toastr.success(messageObj.description, messageObj.type);
              }
            }
            this.getEmployeeListByOrgIdWithPagination();
          }
        }
      });
    }
  }

  changeStatusOfEmployee(employeeId) {
    this.masterService.changeStatusOfEmployee(employeeId).subscribe(data => {
      if (data && data.data) {
        let messageObj = this.messageService.getMessage("DELETE");
        if (messageObj) {
          this.toastr.success(messageObj.description, messageObj.type);
        }
        this.getEmployeeListByOrgIdWithPagination();
      }
    }, error => {
        console.log("Error in change Status Of Employee : ", error);
    });
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) {
      this.searchModel.searchString = eventValue;
      this.getEmployeeListByOrgIdWithPagination();
    } else {
      this.searchModel.searchString = null;
      this.getEmployeeListByOrgIdWithPagination();
    }    
  }

}
