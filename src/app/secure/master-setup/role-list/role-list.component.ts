import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { SearchModel } from 'src/app/shared/models/search-model';
import { RoleMasterComponent } from '../role-master/role-master.component';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  public columnsToBeDisplayed: string[] = ["name", "description", "action"];
  public limit: number = 10;
  public offset: number = 0;
  public orgId: any = 1;
  public roleList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;

  constructor(private storageService: StorageService, private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService) {
    // this.orgId = this.storageService.getUser().employee.organization.id;
    if (this.orgId && this.orgId != null && this.orgId != undefined) {
      this.searchModel = new SearchModel(this.limit, this.offset, this.orgId, this.sortDirection, this.sortField);
      this.getRoleListByOrgIdWithPagination();
    }  
  }

  ngOnInit(): void {
  }

  getRoleListByOrgIdWithPagination() {
    this.masterService.getRoleListByOrgIdWithPagination(this.searchModel).subscribe(data => {
      if (data && data.data) {
        this.roleList = data.data.content;
        this.limit =  data.data.limit;
        this.offset =  data.data.currentPageNumber;
        this.totalPage =  data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error in fetching Role Master List : ', error.error.message);
    })
  }

  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getRoleListByOrgIdWithPagination();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getRoleListByOrgIdWithPagination();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getRoleListByOrgIdWithPagination();
    }
  }

  openPopUp(roleId, action) {
    if (action == 'delete') {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        data: {roleMasterId: roleId},
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteRoleById(roleId);
        }
      })
    } else {
      const dialogRef = this.dialog.open(RoleMasterComponent, {
        width: '500px',
        data: {roleMasterId: roleId, orgId: this.orgId, action: action},
        disableClose: true
      });  
      dialogRef.afterClosed().subscribe(result => {
        console.log('result after save : ',result)
        if (result) {
          if (result.success) {
            if (result.action == 'add') {
              this.toastr.success("Record saved successfully", "SUCCESS");
            } else {
              this.toastr.success("Record updated successfully", "SUCCESS");
            }            
            this.getRoleListByOrgIdWithPagination();
          }
        }        
      });
    }
  }

  deleteRoleById(roleId) {
    this.masterService.deleteRoleById(roleId).subscribe(data => {
      console.log('data : ', data);
      if (data && data.data) {
        this.toastr.success("Record deleted successfully", "SUCCESS");
        this.getRoleListByOrgIdWithPagination();
      }
    }, error => {
      if (error.error.message.includes("Cannot delete or update a parent row: a foreign key constraint fails")) {
        this.toastr.error("Record in use.", "ERROR");
      } else {
        console.log("Error in deleteing role master by Id : ", error.error.message);
      }
    });
  }
}
