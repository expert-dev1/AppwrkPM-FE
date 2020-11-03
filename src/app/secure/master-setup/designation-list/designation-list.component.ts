import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { SearchModel } from 'src/app/shared/models/search-model';
import { DesignationMasterComponent } from '../designation-master/designation-master.component';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss']
})
export class DesignationListComponent implements OnInit {

  public columnsToBeDisplayed: string[] = ["name", "description", "action"];
  public limit: number = 10;
  public offset: number = 0;
  public orgId: any = 1;
  public designationList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;

  constructor(private storageService: StorageService, private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService,
    private messageService: MessageService) {
    // this.orgId = this.storageService.getUser().employee.organization.id;
    if (this.orgId && this.orgId != null && this.orgId != undefined) {
      this.searchModel = new SearchModel(this.limit, this.offset, this.orgId, this.sortDirection, this.sortField);
      this.getDesignationListByOrgIdWithPagination();
    }
  }

  ngOnInit(): void {
  }

  getDesignationListByOrgIdWithPagination() {
    this.masterService.getDesignationListByOrgIdWithPagination(this.searchModel).subscribe(data => {
      console.log('data inside get designation list : ', data);
      if (data && data.data) {
        this.designationList = data.data.content;
        this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error in fetching Desination List : ', error.error.message);
    })
  }

  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getDesignationListByOrgIdWithPagination();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getDesignationListByOrgIdWithPagination();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getDesignationListByOrgIdWithPagination();
    }
  }

  openPopUp(designationId, action) {
    if (action == 'delete') {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        data: { designationId: designationId },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteDesignationById(designationId);
        }
      })
    } else {
      const dialogRef = this.dialog.open(DesignationMasterComponent, {
        width: '500px',
        data: { designationId: designationId, orgId: this.orgId, action: action },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
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
            this.getDesignationListByOrgIdWithPagination();
          }
        }
      });
    }
  }

  deleteDesignationById(designationId) {
    this.masterService.deleteDesignationById(designationId).subscribe(data => {
      if (data && data.data) {
        let messageObj = this.messageService.getMessage("DELETE");
        if (messageObj) {
          this.toastr.success(messageObj.description, messageObj.type);
        }
        this.getDesignationListByOrgIdWithPagination();
      }
    }, error => {
      if (error.error.message.includes("Cannot delete or update a parent row: a foreign key constraint fails")) {
        let messageObj = this.messageService.getMessage("RECORD_ALREADY_USE");
        if (messageObj) {
          this.toastr.error(messageObj.description, messageObj.type);
        }
      } else {
        console.log("Error in deleteing Designation master by Id : ", error.error.message);
      }
    });
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) {
      this.searchModel.searchString = eventValue;
      this.getDesignationListByOrgIdWithPagination();
    } else {
      this.searchModel.searchString = null;
      this.getDesignationListByOrgIdWithPagination();
    }
  }
}
