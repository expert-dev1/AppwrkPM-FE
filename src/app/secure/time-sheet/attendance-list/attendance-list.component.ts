import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SearchModel } from 'src/app/shared/models/search-model';
import { TimeSheetService } from '../service/time-sheet.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {

  public columnsToBeDisplayed: string[] = ["employee.firstName", "employee.designation.name", "checkInDate", "checkOutDate", "breakTimeInMin", "id"];
  public limit: number = 10;
  public offset: number = 0;
  public attendanceList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;

  constructor(private timeSheetService: TimeSheetService) {
      this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
      this.getEmployeeAttendanceListByOrgIdWithPage();
  }

  ngOnInit(): void {
  }

  getEmployeeAttendanceListByOrgIdWithPage() {
    this.timeSheetService.getEmployeeAttendanceListByOrgIdWithPage(this.searchModel).subscribe(data => {
      if (data && data.data) {
        this.attendanceList = data.data.content;
        this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error inside get attendance list by orgId with page : ', error);
    })
  }

  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getEmployeeAttendanceListByOrgIdWithPage();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getEmployeeAttendanceListByOrgIdWithPage();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getEmployeeAttendanceListByOrgIdWithPage();
    }
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) {
      this.searchModel.searchString = eventValue;
      this.getEmployeeAttendanceListByOrgIdWithPage();
    } else {
      this.searchModel.searchString = null;
      this.getEmployeeAttendanceListByOrgIdWithPage();
    }
  }
}
