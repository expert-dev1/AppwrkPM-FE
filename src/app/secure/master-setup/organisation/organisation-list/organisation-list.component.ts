import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MasterService } from '../../service/master.service';
import { SearchModel } from 'src/app/shared/models/search-model';
import { STATUS_MAP } from 'src/app/core/modals/constant';
import { Router } from '@angular/router';


@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss']
})
export class OrganisationListComponent implements OnInit {

  public displayedColumns: string[] = ['orgCode', 'orgName', 'status', 'action'];
  public limit: number = 10;
  public offset: number = 0;
  public orgId: any = 1;
  public organizationList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;
  public statusMap = STATUS_MAP;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private masterService: MasterService, private router: Router) {
    this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
    this.getOrganisationListWithPagination();
  }

  ngOnInit(): void {
    
  }

  getOrganisationListWithPagination() {
    this.masterService.getOrganisationListWithPagination(this.searchModel).subscribe(data => {
      if (data && data.data) {
        this.organizationList = data.data.content;
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
      this.getOrganisationListWithPagination();
    }
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.searchModel.sortDirection = sort.direction;
      this.searchModel.sortField = sort.active;
      this.getOrganisationListWithPagination();
    }
    else {
      this.searchModel.sortDirection = "DESC";
      this.searchModel.sortField = "id";
      this.getOrganisationListWithPagination();
    }
  }

  routeToAddAndEditOrganization(orgId, action) {
    this.router.navigate(['secure/masterSetup/organisation/'+ action +'/' + orgId]);
  }

  doFilter(eventValue) {
    if (eventValue && eventValue != undefined && eventValue != null) {
      this.searchModel.searchString = eventValue;
      this.getOrganisationListWithPagination();
    } else {
      this.searchModel.searchString = null;
      this.getOrganisationListWithPagination();
    }    
  }

}
