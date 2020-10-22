import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment} from '../../../../environments/environment'
const MASTER_API = environment.MASTER_API;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  projectPlatformList=[];

  constructor(private http: HttpClient) { }

  employeeList = []

  errorHandler(error) {
    console.log("error", error)
    try {
      return throwError(error);
    } catch (ex) {
      // console.log(ex);
    }
    if (error) {
      return throwError(error);
    } else {
      return throwError("The action could not be completed due to an internal error. Try the action again.");
    }
  }

  successResponse(response) {
    try {
      if (response && response.data) {
        return response.data;
      } else if (response) {
        return response.json().data;
      }
    } catch (ex) { }
    return response;
  }

  getRoleListByOrgIdWithPagination(data): Observable<any> {
    let url = MASTER_API + 'roleMaster/getRoleMasterListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveRoleMaster(data): Observable<any> {
    let url = MASTER_API + 'roleMaster';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateRoleMaster(data): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId='+ data.id;
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getRoleMasterDeatilsById(roleMasterId): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId=' + roleMasterId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  deleteRoleById(roleId): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId=' + roleId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getRoleMasterListByOrgId(orgId): Observable<any> {
    let url = MASTER_API + 'roleMaster/getRoleMasterListByOrgId?orgId=' + orgId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getEmployeeListByOrgIdWithPagination(data): Observable<any> {
    let url = MASTER_API + 'employee/getEmployeeListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  checkEmailIdOfEmployee(emailId): Observable<any> {
    let url = MASTER_API + 'employee/checkEmailIdOfEmployee?emailId=' + emailId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveEmployee(data): Observable<any> {
    let url = MASTER_API + 'employee';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateEmployee(data): Observable<any> {
    let url = MASTER_API + 'employee';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getEmployeeDeatilsById(employeeId): Observable<any> {
    let url = MASTER_API + 'employee?employeeId=' + employeeId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getAllCountryList(): Observable<any> {
    let url = MASTER_API + 'seedData/getAllCountryList';
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getStateListByCountryId(countryId): Observable<any> {
    let url = MASTER_API + 'seedData/getAllStateListByCountryId?countryId=' + countryId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getCityListByStateId(stateId): Observable<any> {
    let url = MASTER_API + 'seedData/getAllCityListByStateId?stateId=' + stateId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getDesignationListByOrgIdWithPagination(data): Observable<any> {
    let url = MASTER_API + 'designation/getDesignationListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  deleteDesignationById(designationId): Observable<any> {
    let url = MASTER_API + 'designation?designationId=' + designationId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getDesignationDeatilsById(designationId): Observable<any> {
    let url = MASTER_API + 'designation?designationId=' + designationId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getDesignationListByOrgId(orgId: any): Observable<any> {
    let url = MASTER_API + 'designation/getDesignationListByOrgId?orgId=' + orgId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveDesignation(data): Observable<any> {
    let url = MASTER_API + 'designation';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateDesignation(data): Observable<any> {
    let url = MASTER_API + 'designation';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }


  getEmployeeListWithOrgId(): Observable<any>{
    if(this.employeeList.length){
      return of(this.employeeList)
    } else {
      let orgId = 1
      let url = MASTER_API + 'employee/getEmployeeListByOrgId?orgId=' + orgId;
      return this.http.get(url).pipe(
        map((resp:any)=>{
          let list = resp.data.data.employeeList
          this.employeeList = list
          return list
        })
      );
    }
  }

  getProjectPlatformTypes(): Observable<any>{
    if(this.projectPlatformList.length){
      return of(this.projectPlatformList)
    } else {
      let url = MASTER_API +  'seedData/getPlatformTypeList';
      return this.http.get(url).pipe(
        map((resp:any)=>{
          let list = resp.data.data.platformTypeList
          this.projectPlatformList = list
          return list
        })
      );
    }
  }

  addNewProject(data): Observable<any>{
    let url = MASTER_API + 'projects';
    return this.http.post(url,data, httpOptions);
  }

  verifyProjectName(name): Observable<any>{
    let orgId = 1
    let url = MASTER_API + 'projects/checkIfProjectNameAlreadyExists?name=' + name + '&orgId=' + orgId;
    return this.http.get(url);
  }
}
