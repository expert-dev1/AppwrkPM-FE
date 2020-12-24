import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'
const MASTER_API = environment.MASTER_API;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  projectPlatformList = [];
  employeeList = [];
  projectList = [];

  constructor(private http: HttpClient) { }

  /**
    * @author Amit Malik
    * @description This function throws the error or exception to the method from which it is invoked
    * @param error Error from backend
   */
  errorHandler(error) {
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

  /**
   * @author Amit Malik
   * @description This function sends the data or response of the API
   * @param response response or data from API
   */
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

  /**
   * @author Amit Malik
   * @description get Role List By Org Id With Pagination
   * @param data Search Model
   */
  getRoleListByOrgIdWithPagination(data): Observable<any> {
    let url = MASTER_API + 'roleMaster/getRoleMasterListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description Save Role Master
   * @param data Role Master Form
   */
  saveRoleMaster(data): Observable<any> {
    let url = MASTER_API + 'roleMaster';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description Update Role Master by role master id
   * @param data Role Master Form
   */
  updateRoleMaster(data): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId=' + data.id;
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description get Role Master Deatils By role master Id
   * @param roleMasterId Role Master Id
   */
  getRoleMasterDeatilsById(roleMasterId): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId=' + roleMasterId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description Delete Role Master Record by Role Master Id
   * @param roleId Role Master Id
   */
  deleteRoleById(roleId): Observable<any> {
    let url = MASTER_API + 'roleMaster?roleMasterId=' + roleId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @author Amit Malik
   * @description get Role Master list By Organization Id
   */
  getRoleMasterListByOrgId(): Observable<any> {
    let url = MASTER_API + 'roleMaster/getRoleMasterListByOrgId';
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
    return this.http.post(url, data).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateEmployee(data): Observable<any> {
    let url = MASTER_API + 'employee';
    return this.http.put(url, data).pipe(
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

  getDesignationListByOrgId(): Observable<any> {
    let url = MASTER_API + 'designation/getDesignationListByOrgId';
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


  getEmployeeListWithOrgId(): Observable<any> {
    if (this.employeeList.length) {
      return of(this.employeeList)
    } else {
      let url = MASTER_API + 'employee/getEmployeeListByOrgId';
      return this.http.get(url).pipe(
        map((resp: any) => {
          let list = resp.data.data
          this.employeeList = list
          return list
        })
      );
    }
  }

  getProjectPlatformTypes(): Observable<any> {
    if (this.projectPlatformList.length) {
      return of(this.projectPlatformList)
    } else {
      let url = MASTER_API + 'seedData/getPlatformTypeList';
      return this.http.get(url).pipe(
        map((resp: any) => {
          let list = resp.data.data
          this.projectPlatformList = list
          return list
        })
      );
    }
  }

  verifyProjectName(name, id): Observable<any> {
    let url = MASTER_API + 'projects/checkIfProjectNameAlreadyExists?name=' + name + '&projectId=' + id;
    return this.http.get(url);
  }

  getProjectList(data): Observable<any> {
    let url = MASTER_API + 'projects/getProjectListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getOrganisationListWithPagination(data): Observable<any> {
    let url = MASTER_API + 'organization/getOrganizationListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  changeStatusOfEmployee(employeeId): Observable<any> {
    let url = MASTER_API + 'employee?employeeId=' + employeeId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getOrganizationDetailsById(orgId): Observable<any> {
    let url = MASTER_API + 'organization?orgId=' + orgId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveOrganization(data): Observable<any> {
    let url = MASTER_API + 'organization';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateOrganization(data): Observable<any> {
    let url = MASTER_API + 'organization';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  checkOrganizationCode(orgCode, orgId): Observable<any> {
    let url = MASTER_API + 'organization/checkOrganizationCode?orgCode=' + orgCode + "&orgId=" + orgId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveOrganizationEvent(data): Observable<any> {
    let url = MASTER_API + 'organizationCalendar';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getEventsAndHolidaysListForOrganizationCalendar(): Observable<any> {
    let url = MASTER_API + 'organizationCalendar/getEventsAndHolidaysListForOrganizationCalendar';
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveProjectDTO(data): Observable<any> {
    let url = MASTER_API + 'projects';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateProjectDTO(data): Observable<any> {
    let url = MASTER_API + 'projects';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getProjectDetailsById(projectId): Observable<any> {
    let url = MASTER_API + 'projects?projectId=' + projectId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  deleteClientMoreInfoById(clientMoreInfoId): Observable<any> {
    let url = MASTER_API + 'projects/deleteClientMoreInfoById?clientMoreInfoId=' + clientMoreInfoId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  deleteEmployeeProjectById(employeeProjectId): Observable<any> {
    let url = MASTER_API + 'projects/deleteEmployeeProjectById?employeeProjectId=' + employeeProjectId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getProjectListByOrgIdAndLoggedInEmployeeId(): Observable<any> {
    let url = MASTER_API + 'projects/getProjectListByOrgIdAndLoggedInEmployeeId';
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getOrganizationEventDeatils(orgCalId): Observable<any> {
    let url = MASTER_API + 'organizationCalendar?orgCalId=' + orgCalId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  
  updateOrganizationEvent(data): Observable<any> {
    let url = MASTER_API + 'organizationCalendar'
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }
  
  deleteOrganizationEventsById(orgCalId): Observable<any> {
    let url = MASTER_API + 'organizationCalendar?orgCalId=' + orgCalId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getSkillMasterListByOrgIdWithPage(data): Observable<any> {
    let url = MASTER_API + 'skillMaster/getSkillMasterListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getSkillMasterDeatilsById(skillMasterId): Observable<any> {
    let url = MASTER_API + 'skillMaster?skillMasterId=' + skillMasterId;
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveSkillMaster(data): Observable<any> {
    let url = MASTER_API + 'skillMaster';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  updateSkillMaster(data): Observable<any> {
    let url = MASTER_API + 'skillMaster';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getSkillMasterListByOrgId(): Observable<any> {
    let url = MASTER_API + 'skillMaster/getSkillMasterListByOrgId';
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  deleteSkillMasterById(skillMasterId): Observable<any> {
    let url = MASTER_API + 'skillMaster?skillMasterId=' + skillMasterId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }
}
