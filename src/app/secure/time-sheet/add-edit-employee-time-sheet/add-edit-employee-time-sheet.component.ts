import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorErrorMessages } from 'src/app/core';
import { MessageService } from 'src/app/core/services/message/message.service';
import { MasterService } from '../../master-setup/service/master.service';

@Component({
  selector: 'app-add-edit-employee-time-sheet',
  templateUrl: './add-edit-employee-time-sheet.component.html',
  styleUrls: ['./add-edit-employee-time-sheet.component.scss']
})
export class AddEditEmployeeTimeSheetComponent implements OnInit {

  public currentDate: Date = new Date();
  public index: any;
  public action: any;
  public projectList = [];
  public timeSheetDetails: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;

  public timeSheetForm = this.formBuilder.group({
    id: [0],
    taskName: ['', [Validators.required, Validators.maxLength(100)]],
    projectId: ['', [Validators.required]],
    projectName: [''],
    taskDescription: ['', [Validators.required]],
    taskDate: ['', [Validators.required]],
    numberOfHours: ['', [Validators.required]],
    employeeId: [],
  });

  constructor(public dialogRef: MatDialogRef<AddEditEmployeeTimeSheetComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private toastr: ToastrService, private messageService: MessageService, private masterService: MasterService) {
    this.index = data.index;
    this.action = data.action;
    if (this.action == 'edit') {
      this.timeSheetDetails = data.timeSheetDetails;
    }
    this.getProjectListByOrgIdAndLoggedInEmployeeId();
    
  }

  ngOnInit(): void {
  }

  openForm() {
    if (this.action == 'add') {
      this.timeSheetForm.controls.taskDate.setValue(this.currentDate);
    } else {
      this.timeSheetForm.patchValue({
        id: this.timeSheetDetails.id,
        taskName: this.timeSheetDetails.taskName,
        projectId: this.timeSheetDetails.projectId,
        projectName: this.timeSheetDetails.projectName,
        taskDescription: this.timeSheetDetails.taskDescription,
        taskDate: this.timeSheetDetails.taskDate,
        numberOfHours: this.timeSheetDetails.numberOfHours,
        employeeId: this.timeSheetDetails.employeeId && this.timeSheetDetails.employeeId != undefined
          && this.timeSheetDetails.employeeId != null ? this.timeSheetDetails.employeeId : null,
      })
    }
  }

  getProjectListByOrgIdAndLoggedInEmployeeId() {
    this.masterService.getProjectListByOrgIdAndLoggedInEmployeeId().subscribe(data => {
      console.log('');
      if (data && data.data) {
        this.projectList = data.data;
        this.openForm();
      }
    }, error => {
      console.log('Error in getting project list by Org Ids : ', error);
    })
  }

  setProjectName(event) {
    if (event.project.name) {
      this.timeSheetForm.controls.projectName.setValue(event.project.name);
    }
  }

  save() {
    if (this.timeSheetForm.invalid) {
      this.timeSheetForm.markAllAsTouched();
      let messageObj = this.messageService.getMessage("PLEASE_FILL_ALL_REQUIRED_FIELDS");
      if (messageObj) {
        this.toastr.error(messageObj.description, messageObj.type);
      }
    } else {
      this.dialogRef.close({ index: this.index, timeSheetData: this.timeSheetForm.getRawValue(), action: this.action });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
