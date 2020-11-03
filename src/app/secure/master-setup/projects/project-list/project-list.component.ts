import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MasterService } from '../../service/master.service';
import { SearchModel } from 'src/app/shared/models/search-model';
import { Router } from '@angular/router';
import { PROJECT_STATUS_MAP, PROJECT_TIME_TYPE_MAP } from 'src/app/core/modals/constant';
// import { merge } from 'rxjs';
// import { tap } from 'rxjs/operators';


// export interface ProjectData {
//   amount: string
//   createdAt: string
//   endDate: string
//   id: number
//   name: string
//   organizationId: number
//   platformTypeId: number
//   startDate: string
//   status: string
//   timeType: string
//   updatedAt: string
// }


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'startDate', 'platform_type.name', 'amount', 'status', 'timeType', 'action'];
  public searchModel: any;
  public limit: number = 10;
  public offset: number = 0;
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public orgId: any = 1;
  public projectList: any = [];
  public selectedPage: any;
  public totalPage: any;
  public projectStatusMap = PROJECT_STATUS_MAP;
  public projectTimeTypeMap = PROJECT_TIME_TYPE_MAP;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private masterService: MasterService, private router: Router) {
    if (this.orgId && this.orgId != null && this.orgId != undefined) {
      this.searchModel = new SearchModel(this.limit, this.offset, this.orgId, this.sortDirection, this.sortField);
      this.getProjectList();
    }
  }

  ngOnInit(): void {

  }

  getProjectList() {
    this.masterService.getProjectList(this.searchModel).subscribe(data => {
      this.projectList = data.data.content;
      this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
    }, error => {
      console.log('Error in fetching Employee Master List : ', error);
    })
  }


  pageChanges(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPage) {
      this.selectedPage = pageIndex;
      this.searchModel.offset = pageIndex;
      this.getProjectList();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getProjectList();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getProjectList();
    }
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) { 
      this.searchModel.searchString = eventValue;
      this.getProjectList();
    } else {
      this.searchModel.searchString = null;
      this.getProjectList();
    }    
  }

  routeToAddAndEditProject(projectId, action) {
    this.router.navigate(['secure/masterSetup/projects/'+ action +'/' + projectId]);
  }

}
