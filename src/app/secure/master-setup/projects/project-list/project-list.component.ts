import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from '../../service/master.service';
import { SearchModel } from 'src/app/shared/models/search-model';


export interface ProjectData {
  amount: string
  createdAt: string
  endDate: string
  id: number
  name: string
  organizationId: number
  platformTypeId: number
  startDate: string
  status: string
  timeType: string
  updatedAt: string
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'startDate', 'platformType', 'status'];
  dataSource: MatTableDataSource<ProjectData>;
  searchParams:SearchModel = {
    limit:10,
    offset:0,
    orgId:1,
    sortDirection:"DESC",
    sortField:'id'
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private masterService: MasterService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectList()
  }

  getProjectList(){
    this.masterService.getProjectList(this.searchParams).subscribe(resp => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
