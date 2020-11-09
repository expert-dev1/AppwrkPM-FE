import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ValidatorErrorMessages } from 'src/app/core';
import { MessageService } from 'src/app/core/services/message/message.service';
import { UnsavedChangesConfirmationPopupComponent } from 'src/app/shared/components/unsaved-changes-confirmation-pop-up/unsaved-changes-confirmation-popup.component';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { CanComponentDeactivate } from 'src/app/shared/guards/unsaved-changes-guard';
import { SearchModel } from 'src/app/shared/models/search-model';
import { AddEditEmployeeTimeSheetComponent } from '../add-edit-employee-time-sheet/add-edit-employee-time-sheet.component';
import { TimeSheetService } from '../service/time-sheet.service';

@Component({
  selector: 'app-employee-time-sheet',
  templateUrl: './employee-time-sheet.component.html',
  styleUrls: ['./employee-time-sheet.component.scss']
})
export class EmployeeTimeSheetComponent implements OnInit, CanComponentDeactivate {

  canDeactivate() {
    let navigate: boolean;
    if (this.formList.invalid)
      return false;
    else {
      let unsavedData = this.formList.value.filter(e => e.canEdit);
      console.log('toRouteOnDashboardAfterSave : ', this.toRouteOnDashboardAfterSave);
      if (unsavedData.length > 0 && this.toRouteOnDashboardAfterSave)
        return false;
      else {
        return true;
      }
    }
  }

  unSavedChangesCheckOnApply() {
    let unSavedChanges = this.formList.value.filter(obj => obj.canEdit);
    if (unSavedChanges && unSavedChanges != undefined && unSavedChanges != null && unSavedChanges.length != 0) {
      return true;
    } else {
      return false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    let value: boolean = this.unSavedChangesCheckOnApply();
    alert(value);
    return !value;
  }

  public form: FormGroup;
  public formList: FormArray;
  public sumOfMinutes: number = 0;
  public limit: number = 10;
  public offset: number = 0;
  public employeeTimeSheetList: any = [];
  public sortDirection: any = "DESC";
  public sortField: any = "id";
  public searchModel: any;
  public selectedPage: any;
  public totalPage: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public displayedColumns: string[] = ["taskName", "projectName", "taskDescription", "taskDate", "numberOfHours", "action"];
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public toRouteOnDashboardAfterSave: boolean = true;


  constructor(private formBuilder: FormBuilder, private timeSheetService: TimeSheetService,
    private toaster: ToastrService, private messageService: MessageService, public dialog: MatDialog,
    private router: Router) {
    this.searchModel = new SearchModel(this.limit, this.offset, 0, this.sortDirection, this.sortField);
    this.formList = this.formBuilder.array([]);
    this.form = this.formBuilder.group({
      'formArray': this.formList
    });
    this.getTimeSheetListIfDefinedAnyWithPagination();
  }

  ngOnInit(): void {
  }

  getTimeSheetListIfDefinedAnyWithPagination() {
    this.timeSheetService.getTimeSheetListIfDefinedAnyWithPagination(this.searchModel).subscribe(data => {
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

  get formInstance(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      taskName: [''],
      projectId: [''],
      projectName: [''],
      taskDescription: [''],
      taskDate: [''],
      numberOfHours: [''],
      employeeId: [''],
      organizationId: [''],
      canEdit: [false, []],
    });
  }

  clearFormList() {
    while (this.formList.length !== 0) {
      this.formList.removeAt(0)
    }
    this.dataSource.next(this.formList.controls);
  }

  patchData(employeeTimeSheetList) {
    this.clearFormList();
    employeeTimeSheetList.forEach(element => {
      let form = this.formInstance;
      console.log('element : ', element);
      form.patchValue({
        id: element.id,
        employeeId: element.employeeId,
        taskName: element.taskName,
        projectId: element.projectId,
        projectName: element.project.name,
        taskDescription: element.taskDescription,
        taskDate: element.taskDate,
        numberOfHours: element.numberOfHours,
        canEdit: false
      });
      console.log('form : ', form.value);
      this.formList.push(form);
    });
    console.log('form list : ', this.formList.value);
    this.calculateTotalNumberOfHours();
    this.dataSource.next(this.formList.controls);
  }

  openPopUp(index, action, timeSheetDetails) {
    if (action == 'delete') {
      if (timeSheetDetails.id == 0) {
        this.formList.removeAt(0);
        this.dataSource.next(this.formList.controls);
        this.calculateTotalNumberOfHours();
      } else {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          width: '500px',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.deleteTimeSheetFromDb(timeSheetDetails.id, index);
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(AddEditEmployeeTimeSheetComponent, {
        width: '1000px',
        height: '500px',
        disableClose: true,
        data: { index: index, action: action, timeSheetDetails: timeSheetDetails },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.action == 'add') {
            this.addForm(result);
          } else {
            this.patchForm(result, index);
          }
        }
      });
    }
  }

  deleteTimeSheetFromDb(timeSheetId, index) {
    this.timeSheetService.deleteTimeSheetFromDb(timeSheetId).subscribe(data => {
      if (data.data) {
        let messageObj = this.messageService.getMessage("DELETE");
        if (messageObj) {
          this.toaster.success(messageObj.description, messageObj.type);
        }
        this.formList.removeAt(0);
        this.dataSource.next(this.formList.controls);
        this.calculateTotalNumberOfHours();
      }
    }, error => {
      console.log('Error in delete time sheet from DB : ', error);
    })
  }

  addForm(result) {
    // let index = result.index;
    let timeSheetDetails = result.timeSheetData;
    let form = this.formInstance;
    form.patchValue({
      id: timeSheetDetails.id,
      taskName: timeSheetDetails.taskName,
      projectId: timeSheetDetails.projectId,
      projectName: timeSheetDetails.projectName,
      taskDescription: timeSheetDetails.taskDescription,
      taskDate: timeSheetDetails.taskDate,
      numberOfHours: timeSheetDetails.numberOfHours,
      employeeId: '',
      organizationId: '',
      canEdit: [true, []],
    });
    this.formList.push(form);
    this.dataSource.next(this.formList.controls);
    this.calculateTotalNumberOfHours();
  }

  patchForm(result, index) {
    let timeSheetDetailsAfterPatch = result.timeSheetData;
    (this.form.get("formArray") as FormArray).at(index).get("id").setValue(timeSheetDetailsAfterPatch.id);
    (this.form.get("formArray") as FormArray).at(index).get("taskName").setValue(timeSheetDetailsAfterPatch.taskName);
    (this.form.get("formArray") as FormArray).at(index).get("projectId").setValue(timeSheetDetailsAfterPatch.projectId);
    (this.form.get("formArray") as FormArray).at(index).get("projectName").setValue(timeSheetDetailsAfterPatch.projectName);
    (this.form.get("formArray") as FormArray).at(index).get("taskDescription").setValue(timeSheetDetailsAfterPatch.taskDescription);
    (this.form.get("formArray") as FormArray).at(index).get("taskDate").setValue(timeSheetDetailsAfterPatch.taskDate);
    (this.form.get("formArray") as FormArray).at(index).get("numberOfHours").setValue(timeSheetDetailsAfterPatch.numberOfHours);
    (this.form.get("formArray") as FormArray).at(index).get("employeeId").setValue(timeSheetDetailsAfterPatch.employeeId);
    (this.form.get("formArray") as FormArray).at(index).get("organizationId").setValue(timeSheetDetailsAfterPatch.organizationId);
    (this.form.get("formArray") as FormArray).at(index).get("canEdit").setValue(true);
    this.calculateTotalNumberOfHours();
  }

  openPopUpForUnsavedChanges() {
    let messageObj = this.messageService.getMessage("POP_UP_CONFIRMATION_MESSAGE");
    const dialogRef = this.dialog.open(UnsavedChangesConfirmationPopupComponent, {
      width: '400px',
      disableClose: true,
      data: { title: 'Confirm', message: messageObj['description'], confirmButtonName: 'Yes', cancelButtonName: 'No' }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        return true;
      } else {
        return false;
      }
    });
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
            this.getTimeSheetListIfDefinedAnyWithPagination();
          }
        }
      });
    } else {
      if (pageIndex >= 0 && pageIndex < this.totalPage) {
        this.selectedPage = pageIndex;
        this.searchModel.offset = pageIndex;
        this.getTimeSheetListIfDefinedAnyWithPagination();
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
            this.getTimeSheetListIfDefinedAnyWithPagination();
          }
          else {
            this.searchModel.sortDirection = "DESC";
            this.searchModel.sortField = "id";
            this.getTimeSheetListIfDefinedAnyWithPagination();
          }
        }
      });
    } else {
      if (sort.direction) {
        this.searchModel.sortDirection = sort.direction;
        this.searchModel.sortField = sort.active;
        this.getTimeSheetListIfDefinedAnyWithPagination();
      }
      else {
        this.searchModel.sortDirection = "DESC";
        this.searchModel.sortField = "id";
        this.getTimeSheetListIfDefinedAnyWithPagination();
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
            this.getTimeSheetListIfDefinedAnyWithPagination();
          } else {
            this.searchModel.searchString = null;
            this.getTimeSheetListIfDefinedAnyWithPagination();
          }
        }
      });
    } else {
      if (eventValue && eventValue != undefined && eventValue != null) {
        this.searchModel.searchString = eventValue;
        this.getTimeSheetListIfDefinedAnyWithPagination();
      } else {
        this.searchModel.searchString = null;
        this.getTimeSheetListIfDefinedAnyWithPagination();
      }
    }
  }

  calculateTotalNumberOfHours() {
    let totalNumberOfMinutes = 0;
    this.formList.value.forEach(element => {
      let removedDotsString = element.numberOfHours.split(":");
      let minutes = parseInt(removedDotsString[0]) * 60 + parseInt(removedDotsString[1]); //1111
      totalNumberOfMinutes = totalNumberOfMinutes + minutes;
    });
    this.sumOfMinutes = totalNumberOfMinutes;
  }

  save() {
    if (this.formList.value.length > 0) {
      let listToSave = [];
      this.formList.value.forEach(element => {
        if (element.canEdit) {
          listToSave.push(element);
        }
      });
      if (listToSave.length > 0) {
        this.timeSheetService.saveTimeSheets(listToSave).subscribe(data => {
          if (data && data.data) {
            let messageObj = this.messageService.getMessage("TIME_SHEET_SAVED_SUCCESSFULLY");
            if (messageObj) {
              this.toaster.success(messageObj.description, messageObj.type);
            }
            this.toRouteOnDashboardAfterSave = false;
            this.router.navigate(['secure/dashboard/employeeDashboard']);
          }
        }, error => {
          console.log('Error in save time sheet : ', error);
        });
      }
    } else {

    }
  }

}
