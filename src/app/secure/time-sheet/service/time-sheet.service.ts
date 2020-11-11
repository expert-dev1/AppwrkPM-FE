import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const TIME_SHEET_API = environment.TIME_SHEET_API;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

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

  deleteTimeSheetFromDb(timeSheetId: any): Observable<any> {
    let url = TIME_SHEET_API + 'timeSheet/deleteTimeSheetFromDb?timeSheetId=' + timeSheetId;
    return this.http.delete(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  saveTimeSheets(data): Observable<any> {
    let url = TIME_SHEET_API + 'timeSheet';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getEmployeeTimeSheetForStatusChangeWithPagination(data): Observable<any> {
    let url = TIME_SHEET_API + 'timeSheet/getEmployeeTimeSheetForStatusChangeWithPagination';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  bulkUpdateTimeSheetStatus(data): Observable<any> {
    let url = TIME_SHEET_API + 'timeSheet/bulkUpdateTimeSheetStatus';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  changeStatusOfSingleTaskInTimeSheet(data) {
    let url = TIME_SHEET_API + 'timeSheet/changeStatusOfSingleTaskInTimeSheet';
    return this.http.put(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getTimeSheetListIfDefinedAnyWithPagination(data): Observable<any> {
    let url = TIME_SHEET_API + 'timeSheet/getTimeSheetListIfDefinedAnyWithPagination';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  getEmployeeAttendanceListByOrgIdWithPage(data): Observable<any> {
    let url = TIME_SHEET_API + 'employeeAttendance/getEmployeeAttendanceListByOrgIdWithPage';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  
  markAttendanceOfLoggedInEmployee(data): Observable<any> {
    let url = TIME_SHEET_API + 'employeeAttendance';
    return this.http.post(url, data, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }

  checkIfUserCheckedInOrNot(): Observable<any> {
    let url = TIME_SHEET_API + 'employeeAttendance/checkIfUserCheckedInOrNot';
    return this.http.get(url, httpOptions).pipe(
      map(response => {
        return this.successResponse(response);
      }),
      catchError(this.errorHandler)
    );
  }
}
