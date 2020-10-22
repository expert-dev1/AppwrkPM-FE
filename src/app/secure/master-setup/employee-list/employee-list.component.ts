import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { STATUS_MAP } from 'src/app/core/modals/constant';
import { StorageService } from 'src/app/core/services/storage/storage.service';
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
  public orgId: any = 1;
  public employeeList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;
  public statusMap = STATUS_MAP;

  constructor(private storageService: StorageService, private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService) {
    if (this.orgId && this.orgId != null && this.orgId != undefined) {
      this.searchModel = new SearchModel(this.limit, this.offset, this.orgId, this.sortDirection, this.sortField);
      this.getEmployeeListByOrgIdWithPagination();
    }
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
    const dialogRef = this.dialog.open(EmployeeMasterComponent, {
      width: '1200px',
      height: '600px',
      data: { employeeId: employeeId, orgId: this.orgId, action: action },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result after save : ', result)
      if (result) {
        if (result.success) {
          if (result.action == 'add') {
            this.toastr.success("Record saved successfully", "SUCCESS");
          } else {
            this.toastr.success("Record updated successfully", "SUCCESS");
          }
          this.getEmployeeListByOrgIdWithPagination();
        }
      }
    });
  }

}
