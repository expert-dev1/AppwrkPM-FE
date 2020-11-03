import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { FormArray } from '@angular/forms';
import { MORE_INFORMATION_LIST, MORE_INFORMATION_MAP, PROJECT_NAME_STATUS, PROJECT_STATUS_LIST, PROJECT_TIME_TYPE_LIST } from 'src/app/core/modals/constant';
import { ValidatorErrorMessages } from 'src/app/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/core/services/message/message.service';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss']
})
export class AddEditProjectComponent implements OnInit {

  public displayedColumns: string[] = ["employeeFullName", "checkInDate", "checkOutDate", "action"];
  public displayedColumnsForClientMoreInformation: string[] = ["key", "infoValue", "action"];
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceForClientInformation = new BehaviorSubject<AbstractControl[]>([]);
  public currentDate = new Date();
  public projectStatusList = PROJECT_STATUS_LIST;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public projectTimeTypeList = PROJECT_TIME_TYPE_LIST;
  public employeeList = [];
  public platformList = [];
  public selectedListForEmployee = [];
  public projectNameStatus = PROJECT_NAME_STATUS.PENDING;
  public loading;
  public routerSubscription: Subscription;
  public action: any;
  public projectId: any;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public isEditable = true;
  public clientMoreInfoList = [];
  public employeeProjectList = [];
  public moreInformationList = MORE_INFORMATION_LIST;

  public moreInformationMap = MORE_INFORMATION_MAP;

  public projectInfoForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]], //start date of project
    endDate: ['',], //start date of project
    platformTypeId: ['', [Validators.required]], // linkedIn/upwork
    timeType: ['HOURLY', [Validators.required]], // fixed/hourly
    amount: [''], // fixed/hourly
    status: ['PENDING', [Validators.required]], //yet to start, in process, completed, on hold, delievered
    // employeeId: [[], [Validators.required]], //list of resources working on this project
    description: ['', Validators.required]
  });

  public clientInfoForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', Validators.email],
    showAltEmail: [false],
    altEmail: [''],
    skypeId: [''],
    moreInfo: [''],
    clientInformations: this.formBuilder.array([]),
  });
  public employeeProjectFormList: FormArray;
  public employeeProjectForm: FormGroup;



  constructor(private formBuilder: FormBuilder, private masterService: MasterService, private router: Router, private activatedRoute: ActivatedRoute,
    private toaster: ToastrService, public dialog: MatDialog, private messageService: MessageService) {
    this.routerSubscription = this.routerSubscription = this.activatedRoute.url.subscribe((params) => {
      this.action = this.activatedRoute.snapshot.params.action;
      this.projectId = this.activatedRoute.snapshot.params.id;
      this.projectInfoForm.patchValue({ id: this.projectId });
      this.employeeProjectFormList = this.formBuilder.array([]);
      this.employeeProjectForm = this.formBuilder.group({
        'formArray': this.employeeProjectFormList
      });
      this.openFormAccordingToAction();
    });
  }

  openFormAccordingToAction() {
    this.masterService.getEmployeeListWithOrgId().subscribe(resp => {
      this.employeeList = resp;
    });
    this.masterService.getProjectPlatformTypes().subscribe(resp => {
      this.platformList = resp;
    });
    this.checkProjectName()
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    if (this.action == 'edit') {
      this.getProjectDetailsById();
    } else if (this.action != 'add') {
      this.projectInfoForm.disable();
      this.clientInfoForm.disable();
      this.employeeProjectFormList.disable();
      this.getProjectDetailsById();
    }
  }

  ngOnInit(): void {

  }

  getProjectDetailsById() {
    this.masterService.getProjectDetailsById(this.projectInfoForm.controls.id.value).subscribe(data => {
      this.patchProjectForm(data.data.project);
      this.clientMoreInfoList = data.data.clientMoreInformationList
      this.patchClientAndClientMoreInfoForm(data.data.clientInfo, this.clientMoreInfoList);
      this.employeeProjectList = data.data.employeeProjectList;
      this.patchEmployeeProjectList(this.employeeProjectList);
    }, error => {
      console.log('error inside getProjectDetailsById : ', error);
    })
  }

  patchProjectForm(projectDetails) {
    this.projectInfoForm.patchValue({
      id: projectDetails.id,
      name: projectDetails.name,
      startDate: projectDetails.startDate,
      endDate: projectDetails.endDate && projectDetails.endDate != null ? projectDetails.endDate : null,
      platformTypeId: projectDetails.platformTypeId,
      timeType: projectDetails.timeType,
      amount: projectDetails.amount && projectDetails.amount != null ? projectDetails.amount : null,
      status: projectDetails.status,
      organizationId: projectDetails.organizationId,
      description: projectDetails.description,
    });
  }

  patchClientAndClientMoreInfoForm(clientInfo, clientMoreInformationList) {
    this.clientInfoForm.patchValue({
      id: clientInfo.id,
      name: clientInfo.name,
      email: clientInfo.email,
      showAltEmail: clientInfo.altEmail && clientInfo.altEmail != null ? true : false,
      altEmail: clientInfo.altEmail,
      skypeId: clientInfo.skypeId,
      moreInfo: clientInfo.moreInfo,
    });
    if (clientMoreInformationList && clientMoreInformationList != undefined && clientMoreInformationList != null && clientMoreInformationList.length > 0) {
      this.clearDataFormClientMoreInfo();
      clientMoreInformationList.forEach(element => {
        this.clientInformations.push(this.formBuilder.group({
          id: element.id,
          key: element.key,
          value: element.value,
          canEdit: [false]
        }));
      });
      this.dataSourceForClientInformation.next(this.clientInformations.controls);
    }
  }

  patchEmployeeProjectList(employeeProjectList) {
    this.clearFormList();
    employeeProjectList.forEach(element => {
      let form = this.employeeProjectFormInstance;
      form.patchValue({
        id: element.id,
        employeeId: element.employeeId,
        employeeFullName: element.employee.fullName,
        projectId: element.projectId,
        checkInDate: element.checkInDate,
        checkOutDate: element.checkOutDate,
        canEdit: false,
        canDelete: false,
      });
      this.employeeProjectFormList.push(form);
    });
    this.dataSource.next(this.employeeProjectFormList.controls);
  }

  clearDataFormClientMoreInfo() {
    while (this.clientInformations.length !== 0) {
      this.clientInformations.removeAt(0)
    }
  }

  get clientInformations() {
    return this.clientInfoForm.get('clientInformations') as FormArray;
  }

  addClientMoreInformations() {
    this.clientInformations.push(this.formBuilder.group({
      id: '0',
      key: '',
      value: '',
      canEdit: [true]
    }));
    this.dataSourceForClientInformation.next(this.clientInformations.controls);
  }

  checkProjectName() {
    this.projectInfoForm.controls.name.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
    ).subscribe(resp => {
      if (resp == '') { return }
      this.projectNameStatus = PROJECT_NAME_STATUS.CHECKING;
      this.masterService.verifyProjectName(resp, this.projectInfoForm.controls.id.value).subscribe(result => {
        if (result.data.data == true) {
          this.projectNameStatus = PROJECT_NAME_STATUS.VERIFIED;
        } else {
          this.projectInfoForm.controls['name'].setErrors({ 'unavailable': true });
          this.projectNameStatus = PROJECT_NAME_STATUS.UNAVAILABLE;
        }
      })
    })
  }

  showAlternativeEmail(value) {
    this.clientInfoForm.patchValue({ showAltEmail: value });
    if (!value) {
      this.clientInfoForm.patchValue({ altEmail: '' })
    }
  }

  restrictDate() {
    let startDate = this.projectInfoForm.controls.startDate.value;
    let endDate = this.projectInfoForm.controls.endDate.value;
    if (startDate && startDate != undefined && startDate != null
      && endDate && endDate != undefined && endDate != null) {
      if (startDate > endDate) {
        this.projectInfoForm.controls.endDate.reset();
        let messageObj = this.messageService.getMessage("END_DATE_NOT_LESS_THAN_START_DATE");
        if (messageObj) {
          this.toaster.success(messageObj.description, messageObj.type);
        }
      }
    }
  }

  onTimeTypeSelection() {
    let timeType = this.projectInfoForm.controls.timeType.value;
    if (timeType) {
      if (timeType == 'FIXED') {
        this.projectInfoForm.controls.amount.setValidators([Validators.required]);
      } else {
        this.projectInfoForm.controls.amount.clearValidators();
        this.projectInfoForm.controls.amount.updateValueAndValidity();
      }
    }
  }

  submitStep1() {
    let element: HTMLElement = document.getElementById('step1next') as HTMLElement;
    element.click();
  }

  submitStep2() {
    let element: HTMLElement = document.getElementById('step2next') as HTMLElement;
    element.click();
  }

  checkForDuplicate(index, row) {
    let formArray = this.clientInfoForm.get('clientInformations') as FormArray;
    console.log('row value : ', (row as FormGroup).value);
    console.log('index : ', index);
    if (formArray && formArray.length > 0) {
      let indexOfFormArray = 0;
      formArray.value.forEach(element => {
        if ((row as FormGroup).controls.key.value && (row as FormGroup).controls.key.value != undefined && (row as FormGroup).controls.key.value != null) {
          console.log('');
          if ((row as FormGroup).controls.key.value == element.key && index != indexOfFormArray) {
            (row as FormGroup).controls.key.reset();
            let messageObj = this.messageService.getMessage("RECORD_ALREADY_EXISTS");
            if (messageObj) {
              this.toaster.error(messageObj.description, messageObj.type);
            }
          }
        }        
        indexOfFormArray++;
      });
    }
  }

  get employeeProjectFormInstance(): FormGroup {
    return this.formBuilder.group({
      id: ['0'],
      employeeId: ['', [Validators.required]],
      employeeFullName: [''],
      projectId: [''],
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]],
      canEdit: [true],
      canDelete: [false],
    });
  }

  addEmployeeToAssign(event) {
    let employeesWhoAreAlreadyEntered = this.employeeProjectFormList.value.filter(row => row.employeeId == event.id);
    if (employeesWhoAreAlreadyEntered && employeesWhoAreAlreadyEntered.length > 0) {
      let messageObj = this.messageService.getMessage("EMPLOYEE_ALREADY_ASSIGNED");
      if (messageObj) {
        this.toaster.error(messageObj.description, messageObj.type);
      }
    } else {
      let form = this.employeeProjectFormInstance;
      form.patchValue({
        employeeId: event.id,
        employeeFullName: event.fullName,
        projectId: this.projectInfoForm.controls.id.value
      })
      this.employeeProjectFormList.insert(0, form);
      this.dataSource.next(this.employeeProjectFormList.controls);
    }
  }

  restrictCheckInCheckOutDate(index, row) {
    let checkInDate = (row as FormGroup).controls.checkInDate.value;
    let checkOutDate = (row as FormGroup).controls.checkOutDate.value;
    if (checkInDate && checkInDate != undefined && checkInDate != null
      && checkOutDate && checkOutDate != undefined && checkOutDate != null) {
      if (checkInDate > checkOutDate) {
        (row as FormGroup).controls.checkOutDate.reset();
        let messageObj = this.messageService.getMessage("CHECK_IN_DATE_NOT_LESS_THAN_CHECK_OUT_DATE");
        if (messageObj) {
          this.toaster.success(messageObj.description, messageObj.type);
        }
      }
    }
  }

  edit(element, index) {
    if (element.canEdit) {
      this.employeeProjectList.forEach(elem => {
        if (element.id == elem.id) {
          (this.employeeProjectForm.get("formArray") as FormArray).at(index).get("employeeFullName").setValue(elem.employee.fullName);
          (this.employeeProjectForm.get("formArray") as FormArray).at(index).get("checkInDate").setValue(elem.checkInDate);
          (this.employeeProjectForm.get("formArray") as FormArray).at(index).get("checkOutDate").setValue(elem.checkOutDate);
        }
      });
      (this.employeeProjectForm.get("formArray") as FormArray).at(index).get("canEdit").setValue(false);
    } else {
      (this.employeeProjectForm.get("formArray") as FormArray).at(index).get("canEdit").setValue(true);
    }
  }

  editClientMoreinfo(row) {
    if ((row as FormGroup).controls.canEdit.value) {
      this.clientMoreInfoList.forEach(elem => {
        if ((row as FormGroup).controls.id.value == elem.id) {
          (row as FormGroup).controls.key.setValue(elem.key);
          (row as FormGroup).controls.value.setValue(elem.value);
        }
      });
      (row as FormGroup).controls.canEdit.setValue(false);
    } else {
      (row as FormGroup).controls.canEdit.setValue(true);
    }
  }

  deleteClientMoreInfo(row, index) {
    if (row.id != 0) {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteClientMoreInfoById(row.id, index);
        }
      })
    } else {
      this.clientInformations.removeAt(index);
      this.dataSourceForClientInformation.next(this.clientInformations.controls);
    }
  }

  delete(element, index) {
    if (element.id != 0) {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteEmployeeProjectById(element.id, index);
        }
      })
    } else {
      this.employeeProjectFormList.removeAt(index);
      this.dataSource.next(this.employeeProjectFormList.controls);
    }
  }

  deleteClientMoreInfoById(clientMoreInfoId, index) {
    this.masterService.deleteClientMoreInfoById(clientMoreInfoId).subscribe(data => {
      if (data && data.data) {
        this.clientInformations.removeAt(index);
        this.dataSourceForClientInformation.next(this.clientInformations.controls);
        this.toaster.success("Some of client info deleted successfully.", "SUCCESS");
      }
    }, error => {
      console.log("Error in deleting client more info : ", error);
    })
  }

  deleteEmployeeProjectById(employeeProjectId, index) {
    this.masterService.deleteEmployeeProjectById(employeeProjectId).subscribe(data => {
      if (data && data.data) {
        this.employeeProjectFormList.removeAt(index);
      this.dataSource.next(this.employeeProjectFormList.controls);
        this.toaster.success("Employee Successfully removed from this project.", "SUCCESS");
      }
    }, error => {
      console.log("Error in deleting client more info : ", error);
    })
  }

  clearFormList() {
    while (this.employeeProjectFormList.length !== 0) {
      this.employeeProjectFormList.removeAt(0)
    }
    this.dataSource.next(this.employeeProjectFormList.controls);
  }

  save() {
    if (this.projectInfoForm.invalid || this.clientInfoForm.invalid || this.employeeProjectFormList.invalid) {
      this.toaster.error("Please fill all the required fields.", "ERROE");
      this.projectInfoForm.markAllAsTouched();
      this.clientInfoForm.markAllAsTouched();
      this.employeeProjectFormList.markAllAsTouched();
    } else {
      let projectDTO = {
        'projectInfo': this.projectInfoForm.value,
        'clientInfo': this.clientInfoForm.value,
        'employeeProjectList': null
      }
      let listToSave: any = [];
      this.employeeProjectFormList.value.forEach(element => {
        if (element.canEdit) {
          listToSave.push(element);
        }
      });
      projectDTO.employeeProjectList = listToSave;
      this.masterService.saveProjectDTO(projectDTO).subscribe(data => {
        if (data && data.data) {
          let messageObj = this.messageService.getMessage("SAVE");
          if (messageObj) {
            this.toaster.success(messageObj.description, messageObj.type);
          }
        }
        this.router.navigate(['secure/masterSetup/projects/edit/' + data.data.id]);
      }, error => {
        console.log('Error in saving data : ', error);
      });
    }
  }

  update() {
    if (this.projectInfoForm.invalid || this.clientInfoForm.invalid || this.employeeProjectFormList.invalid) {
      let messageObj = this.messageService.getMessage("FILL_ALL_DETAILS");
      if (messageObj) {
        this.toaster.error(messageObj.description, messageObj.type);
      }
      this.projectInfoForm.markAllAsTouched();
      this.clientInfoForm.markAllAsTouched();
      this.employeeProjectFormList.markAllAsTouched();
    } else {
      let projectDTO = {
        'projectInfo': this.projectInfoForm.value,
        'clientInfo': this.clientInfoForm.value,
        'employeeProjectList': null
      }
      let listToSave: any = [];
      this.employeeProjectFormList.value.forEach(element => {
        if (element.canEdit) {
          listToSave.push(element);
        }
      });
      projectDTO.employeeProjectList = listToSave;
      this.masterService.updateProjectDTO(projectDTO).subscribe(data => {
        if (data && data.data) {
          let messageObj = this.messageService.getMessage("UPDATE");
          if (messageObj) {
            this.toaster.success(messageObj.description, messageObj.type);
          }
          this.getProjectDetailsById();
        }
      }, error => {
        console.log('Error in saving data : ', error);
      });
    }
  }

}
