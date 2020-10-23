import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from '../../service/master.service';
import { SearchModel } from 'src/app/shared/models/search-model';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss']
})
export class OrganisationListComponent implements OnInit {

  displayedColumns: string[] = ['orgName', 'orgCode', 'status'];
  dataSource: MatTableDataSource<any>;
  searchParams:SearchModel = {
    limit:5,
    offset:0,
    orgId:1,
    sortDirection:"ASC",
    sortField:'id',
  }
  totalItems= 0;
  isLoadingResults=true;
  isLoadingError;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private masterService: MasterService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList(){
    this.masterService.getOrganisationList(this.searchParams).subscribe(resp => {
      this.dataSource = new MatTableDataSource(resp.content);
      this.totalItems = resp.totalItems;
      this.isLoadingResults = false;
    },err=>{
      this.isLoadingResults = false;
      this.isLoadingError = "Error in loading result"
    })
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => {
              this.isLoadingResults = true;
              this.searchParams = {
                limit: this.paginator.pageSize,
                offset: (this.paginator.pageIndex * this.paginator.pageSize) ,
                orgId:1,
                sortDirection:this.sort.direction || this.searchParams.sortDirection,
                sortField:this.sort.active || this.searchParams.sortField
              }
              this.getProjectList();
              console.log(this.paginator.pageIndex,this.sort.direction, this.paginator.pageSize, this.sort )
            }
            )).subscribe(resp => {

        })
  }


  // pageChanges(pageIndex: number) {
  //   if (pageIndex >= 0 && pageIndex < this.totalPage) {
  //     this.selectedPage = pageIndex;
  //     this.searchModel.offset = pageIndex;
  //     this.getEmployeeListByOrgIdWithPagination();
  //   }
  // }

  // sortData(sort: Sort) {
  //   if (sort.direction) {
  //     this.searchModel.sortDirection = sort.direction;
  //     this.searchModel.sortField = sort.active;
  //     this.getEmployeeListByOrgIdWithPagination();
  //   }
  //   else {
  //     this.searchModel.sortDirection = "DESC";
  //     this.searchModel.sortField = "id";
  //     this.getEmployeeListByOrgIdWithPagination();
  //   }
  // }

}