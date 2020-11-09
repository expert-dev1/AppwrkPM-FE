import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ValidatorErrorMessages } from 'src/app/core';
import { MessageService } from 'src/app/core/services/message/message.service';
import { UnsavedChangesConfirmationPopupComponent } from 'src/app/shared/components/unsaved-changes-confirmation-pop-up/unsaved-changes-confirmation-popup.component';
import { SearchModel } from 'src/app/shared/models/search-model';
import { TimeSheetService } from '../service/time-sheet.service';

@Component({
  selector: 'app-time-sheet-status-change',
  templateUrl: './time-sheet-status-change.component.html',
  styleUrls: ['./time-sheet-status-change.component.scss']
})
export class TimeSheetStatusChangeComponent implements OnInit {

  canDeactivate() {
    let navigate: boolean;
    if (this.formList.invalid)
      return false;
    else {
      let unsavedData = this.formList.value.filter(e => e.isMultiSelectChecked);
      if (unsavedData.length > 0)
        return false;
      else {
        return true;
      }
    }
  }

  unSavedChangesCheckOnApply() {
    let unSavedChanges = this.formList.value.filter(obj => obj.isMultiSelectChecked);
    if (unSavedChanges && unSavedChanges != undefined && unSavedChanges != null && unSavedChanges.length != 0) {
      return true;
    } else {
      return false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    let value: boolean = this.unSavedChangesCheckOnApply();
    return !value;
  }

  public form: FormGroup;
  public formList: FormArray;
  public sumOfMinutes: number = 0;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;

  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public limit: number = 10;
  public offset: number = 0;
  public employeeTimeSheetList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;
  public displayedColumns: string[] = ["employee.firstName", "project.name", "taskName", "taskDescription", "taskDate", "numberOfHours", "status", "action"];

  constructor(private formBuilder: FormBuilder, private timeSheetService: TimeSheetService,
    private toaster: ToastrService, private messageService: MessageService, public dialog: MatDialog,
    private router: Router) {
    this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
    this.formList = this.formBuilder.array([]);
    this.form = this.formBuilder.group({
      'formArray': this.formList
    });
    this.getEmployeeTimeSheetForStatusChangeWithPagination();
  }

  ngOnInit(): void {
  }

  get formInstance(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      employeeId: [''],
      employeeFullName: [''],
      taskName: [''],
      projectId: [''],
      projectName: [''],
      taskDescription: [''],
      taskDate: [''],
      numberOfHours: [''],
      isApproved: [''],
      isRejected: [''],
      isPending: [''],
      isMultiSelectChecked: [''],
    });
  }

  getEmployeeTimeSheetForStatusChangeWithPagination() {
    this.timeSheetService.getEmployeeTimeSheetForStatusChangeWithPagination(this.searchModel).subscribe(data => {
      console.log('Employee Time Sheet : ', data.data);
      if (data && data.data) {
        this.employeeTimeSheetList = data.data.content;
        this.patchData(this.employeeTimeSheetList);
        this.limit = data.data.limit;
        this.offset = data.data.currentPageNumber;
        this.totalPage = data.data.totalPages;
        if (this.offset == 0) {
          this.selectedPage = this.offset;
        }
      }
    }, error => {
      console.log('Error in getting employee time sheet : ', error);
    })
  }

  clearFormList() {
    while (this.formList.length !== 0) {
      this.formList.removeAt(0)
    }
    this.dataSource.next(this.formList.controls);
  }

  patchData(employeeTimeSheetList) {
    this.clearFormList();
    console.log('employeeTimeSheetList : ', employeeTimeSheetList);
    employeeTimeSheetList.forEach(element => {
      let form = this.formInstance;
      console.log('element : ', element);
      form.patchValue({
        id: element.id,
        employeeId: element.employeeId,
        employeeFullName: element.employee.fullName,
        taskName: element.taskName,
        projectId: element.projectId,
        projectName: element.project.name,
        taskDescription: element.taskDescription,
        taskDate: element.taskDate,
        numberOfHours: element.numberOfHours,
        isApproved: element.isApproved,
        isRejected: element.isRejected,
        isPending: element.isPending,
      });
      console.log('form : ', form.value);
      this.formList.push(form);
    });
    console.log('form list : ', this.formList.value);
    this.dataSource.next(this.formList.controls);
  }

  pageChanges(pageIndex: number) {
    let value = this.unSavedChangesCheckOnApply();
    if (value) {
      let messageObj = this.messageService.getMessage("POP_UP_CONFIRMATION_MESSAGE");
      const dialogRef = this.dialog.open(UnsavedChangesConfirmationPopupComponent, {
        width: '400px',
        disableClose: true,
        data: { title: 'Confirm', message: messageObj['description'], confirmButtonName: 'Yes', cancelButtonName: 'No' }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          if (pageIndex >= 0 && pageIndex < this.totalPage) {
            this.selectedPage = pageIndex;
            this.searchModel.offset = pageIndex;
            this.getEmployeeTimeSheetForStatusChangeWithPagination();
          }
        }
      });
    } else {
      if (pageIndex >= 0 && pageIndex < this.totalPage) {
        this.selectedPage = pageIndex;
        this.searchModel.offset = pageIndex;
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      }
    }
  }

  sortData(sort: Sort) {
    let value = this.unSavedChangesCheckOnApply();
    if (value) {
      let messageObj = this.messageService.getMessage("POP_UP_CONFIRMATION_MESSAGE");
      const dialogRef = this.dialog.open(UnsavedChangesConfirmationPopupComponent, {
        width: '400px',
        disableClose: true,
        data: { title: 'Confirm', message: messageObj['description'], confirmButtonName: 'Yes', cancelButtonName: 'No' }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          if (sort.direction) {
            this.searchModel.sortDirection = sort.direction;
            this.searchModel.sortField = sort.active;
            this.getEmployeeTimeSheetForStatusChangeWithPagination();
          }
          else {
            this.searchModel.sortDirection = "DESC";
            this.searchModel.sortField = "id";
            this.getEmployeeTimeSheetForStatusChangeWithPagination();
          }
        }
      });
    } else {
      if (sort.direction) {
        this.searchModel.sortDirection = sort.direction;
        this.searchModel.sortField = sort.active;
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      }
      else {
        this.searchModel.sortDirection = "DESC";
        this.searchModel.sortField = "id";
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      }
    }
  }

  doFilter(eventValue) {
    let value = this.unSavedChangesCheckOnApply();
    if (value) {
      let messageObj = this.messageService.getMessage("POP_UP_CONFIRMATION_MESSAGE");
      const dialogRef = this.dialog.open(UnsavedChangesConfirmationPopupComponent, {
        width: '400px',
        disableClose: true,
        data: { title: 'Confirm', message: messageObj['description'], confirmButtonName: 'Yes', cancelButtonName: 'No' }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          if (eventValue && eventValue != undefined && eventValue != null) {
            this.searchModel.searchString = eventValue;
            this.getEmployeeTimeSheetForStatusChangeWithPagination();
          } else {
            this.searchModel.searchString = null;
            this.getEmployeeTimeSheetForStatusChangeWithPagination();
          }
        }
      });
    } else {
      if (eventValue && eventValue != undefined && eventValue != null) {
        this.searchModel.searchString = eventValue;
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      } else {
        this.searchModel.searchString = null;
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      }
    }
  }

  bulkUpdateTimeSheetStatus(approveOrReject) {
    let listToSave = [];
    this.formList.value.forEach(element => {
      if (element.isMultiSelectChecked) {
        if (approveOrReject == 'APPROVE') {
          element.isApproved = true;
          element.isPending = false;
          element.isRejected = false;
          listToSave.push(element);
        } else {
          element.isApproved = false;
          element.isPending = false;
          element.isRejected = true;
          listToSave.push(element);
        }
      }
    });
    if (listToSave && listToSave.length > 0) {
      this.timeSheetService.bulkUpdateTimeSheetStatus(listToSave).subscribe(data => {
        if (data && data.data) {
          this.getEmployeeTimeSheetForStatusChangeWithPagination();
        }
      }, error => {
        console.log('Error in bulk Update Time Sheet Status : ', error);
      })
    }
  }

  changeStatusOfSingleTaskInTimeSheet(row, approveOrReject) {
    let formsValue = (row as FormGroup).getRawValue();
    if (approveOrReject == "APPROVE") {
      formsValue.isApproved = true;
      formsValue.isRejected = false;
      formsValue.isPending = false;
    } else {
      formsValue.isApproved = false;
      formsValue.isRejected = true;
      formsValue.isPending = false;
    }
    this.timeSheetService.changeStatusOfSingleTaskInTimeSheet(formsValue).subscribe(data => {
      if (data && data.data) {
        (row as FormGroup).controls.isPending.setValue(false);
        this.getEmployeeTimeSheetForStatusChangeWithPagination();
      }
    }, error => {
      console.log('Error in bulk Update Time Sheet Status : ', error);
    })
  }
}
