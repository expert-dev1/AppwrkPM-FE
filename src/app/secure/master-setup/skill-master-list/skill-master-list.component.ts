import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { SearchModel } from 'src/app/shared/models/search-model';
import { MasterService } from '../service/master.service';
import { SkillMasterComponent } from '../skill-master/skill-master.component';

@Component({
  selector: 'app-skill-master-list',
  templateUrl: './skill-master-list.component.html',
  styleUrls: ['./skill-master-list.component.scss']
})
export class SkillMasterListComponent implements OnInit {
  public columnsToBeDisplayed: string[] = ["name", "action"];
  public limit: number = 10;
  public offset: number = 0;
  public skillMasterList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;

  constructor(private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService,
    private messageService: MessageService) {
      this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
      this.getSkillMasterListByOrgIdWithPage();
  }

  ngOnInit(): void {
  }

  getSkillMasterListByOrgIdWithPage() {
    this.masterService.getSkillMasterListByOrgIdWithPage(this.searchModel).subscribe(data => {
      console.log('data inside get skill master list : ', data);
      if (data && data.data) {
        this.skillMasterList = data.data.content;
        this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error in fetching Skill Master List : ', error.error.message);
    })
  }

  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getSkillMasterListByOrgIdWithPage();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getSkillMasterListByOrgIdWithPage();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getSkillMasterListByOrgIdWithPage();
    }
  }

  openPopUp(skillMasterId, action) {
    if (action == 'delete') {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteSkillMasterById(skillMasterId);
        }
      })
    } else {
      const dialogRef = this.dialog.open(SkillMasterComponent, {
        width: '500px',
        data: { skillMasterId: skillMasterId, action: action },
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
            this.getSkillMasterListByOrgIdWithPage();
          }
        }
      });
    }
  }

  deleteSkillMasterById(skillMasterId) {
    this.masterService.deleteSkillMasterById(skillMasterId).subscribe(data => {
      if (data && data.data) {
        let messageObj = this.messageService.getMessage("DELETE");
        if (messageObj) {
          this.toastr.success(messageObj.description, messageObj.type);
        }
        this.getSkillMasterListByOrgIdWithPage();
      }
    }, error => {
      if (error.error.message.includes("Cannot delete or update a parent row: a foreign key constraint fails")) {
        let messageObj = this.messageService.getMessage("RECORD_ALREADY_USE");
        if (messageObj) {
          this.toastr.error(messageObj.description, messageObj.type);
        }
      } else {
        console.log("Error in deleteing Skill master by Id : ", error.error.message);
      }
    });
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) {
      this.searchModel.searchString = eventValue;
      this.getSkillMasterListByOrgIdWithPage();
    } else {
      this.searchModel.searchString = null;
      this.getSkillMasterListByOrgIdWithPage();
    }
  }

}
