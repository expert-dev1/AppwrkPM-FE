import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { STATUS_LIST } from 'src/app/core/modals/constant';
import { MessageService } from 'src/app/core/services/message/message.service';
import { CustomValidator, ValidatorErrorMessages } from '../../../core';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {

  public employeeId: any;
  public employeeDetails: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public statusList = STATUS_LIST;
  public designationList: any = [];
  public roleMasterList: any = [];
  public skillMasterList: any = [];
  public permanentCountryList: any = [];
  public permanentStateList: any = [];
  public permanentCityList: any = [];
  public currentCountryList: any = [];
  public currentStateList: any = [];
  public currentCityList: any = [];
  public selectedListForRoleMaster: any = [];
  public selectedListForSkillMaster: any = [];
  public currentDate = new Date();
  public routerSubscription: Subscription;
  public isEditable = true;
  public file: any;
  public photo = "./../../../../assets/small-images/upload-photo.png";


  public employeeForm = this.formBuilder.group({
    id: ['0'],
    empCode: [''],
    firstName: ['', [Validators.required, Validators.maxLength(50), CustomValidator.alphabetValidate]],
    middleName: ['', [Validators.maxLength(50), CustomValidator.alphabetValidate]],
    lastName: ['', [Validators.required, Validators.maxLength(50), CustomValidator.alphabetValidate]],
    status: ['', [Validators.required]],
    mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    emailId: ['', [Validators.required, Validators.maxLength(50), CustomValidator.emailIdValidation]],
    permanentAddressLine1: ['', [Validators.required, Validators.maxLength(250)]],
    permanentAddressLine2: ['', [Validators.maxLength(250)]],
    permanentCountry: ['', [Validators.required]],
    permanentState: ['', [Validators.required]],
    permanentCity: ['', [Validators.required]],
    permanentPincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
    sameAsPermanentAddress: [false],
    currentAddressLine1: ['', [Validators.required, Validators.maxLength(250)]],
    currentAddressLine2: ['', [Validators.maxLength(250)]],
    currentCountry: ['', [Validators.required]],
    currentState: ['', [Validators.required]],
    currentCity: ['', [Validators.required]],
    currentPincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
    imagePath: [null],
    roleMasterId: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    designationId: ['', [Validators.required]],
    skillMasterIds: ['', [Validators.required]],
  })

  constructor(private formBuilder: FormBuilder, private masterService: MasterService, private toaster: ToastrService,
    private activatedRoute: ActivatedRoute, private messageService: MessageService) {
    this.routerSubscription = this.activatedRoute.url.subscribe((params) => {
      this.action = this.activatedRoute.snapshot.params.action;
      this.employeeId = this.activatedRoute.snapshot.params.employeeId;
      this.employeeForm.patchValue({ id: this.employeeId });
      this.openFormBasedOnActions();
    });
  }

  ngOnInit(): void {
  }

  submitStep1() {
    let element: HTMLElement = document.getElementById('step1next') as HTMLElement;
    element.click();
  }

  submitStep2() {
    let element: HTMLElement = document.getElementById('step2next') as HTMLElement;
    element.click();
  }

  submitStep3() {
    let element: HTMLElement = document.getElementById('step3next') as HTMLElement;
    element.click();
  }

  openFormBasedOnActions() {
    this.employeeForm.patchValue({
      id: this.employeeId,
    });
    this.getRoleMasterListByOrgId();
    this.getAllCountryList();
    this.getDesignationListByOrgId();
    this.getSkillMasterListByOrgId();
    if (this.action == 'edit') {
      this.getEmployeeDeatilsById();
      this.employeeForm.controls.emailId.disable();
    }
  }

  getSkillMasterListByOrgId() {
    this.masterService.getSkillMasterListByOrgId().subscribe(data => {
      if (data && data.data) {
        this.skillMasterList = data.data;
      }
    }, error => {
      console.log('error in fetching role master list inside employee master component : ', error);
    })
  }

  getRoleMasterListByOrgId() {
    this.masterService.getRoleMasterListByOrgId().subscribe(data => {
      if (data && data.data) {
        this.roleMasterList = data.data;
      }
    }, error => {
      console.log('error in fetching role master list inside employee master component : ', error);
    })
  }

  onChangeOfSameAsPermanentAddress() {
    let sameAsPermanentAddress = this.employeeForm.controls.sameAsPermanentAddress.value;
    console.log('sameAsPermanentAddress : ', sameAsPermanentAddress);
    if (sameAsPermanentAddress) {
      this.employeeForm.patchValue({
        currentAddressLine1: this.employeeForm.value.permanentAddressLine1,
        currentAddressLine2: this.employeeForm.value.permanentAddressLine2,
        currentCountry: this.employeeForm.value.permanentCountry,
        currentState: this.employeeForm.value.permanentState,
        currentCity: this.employeeForm.value.permanentCity,
        currentPincode: this.employeeForm.value.permanentPincode,
      });
    } else {
      this.employeeForm.controls.currentAddressLine1.reset();
      this.employeeForm.controls.currentAddressLine2.reset();
      this.employeeForm.controls.currentCountry.reset();
      this.employeeForm.controls.currentState.reset();
      this.currentStateList = [];
      this.employeeForm.controls.currentCity.reset();
      this.currentCityList = [];
      this.employeeForm.controls.currentPincode.reset();
    }
  }

  getDesignationListByOrgId() {
    this.masterService.getDesignationListByOrgId().subscribe(data => {
      if (data && data.data) {
        this.designationList = data.data;
      }
    }, error => {
      console.log('error in fetching role master list inside employee master component : ', error);
    })
  }

  getAllCountryList() {
    this.masterService.getAllCountryList().subscribe(data => {
      if (data && data.data) {
        this.permanentCountryList = data.data;
        this.currentCountryList = data.data;
        // this.getStateListByCountryId();
      }
    }, error => {
      console.log('Error in getting Country list inside Employee Details : ', error.error.message);
    })
  }

  getStateListByCountryIdForPerState() {
    this.permanentStateList = [];
    this.employeeForm.controls.permanentState.reset();
    this.permanentCityList = [];
    this.employeeForm.controls.permanentCity.reset();
    let countryId = this.employeeForm.controls.permanentCountry.value;
    if (countryId && countryId != null && countryId != undefined) {
      this.masterService.getStateListByCountryId(countryId).subscribe(data => {
        if (data && data.data) {
          this.permanentStateList = data.data;
          // this.getCityListByStateId();
        }
      }, error => {
        console.log('Error in getting State list inside Employee Details : ', error.error.message);
      })
    }
  }

  getStateListByCountryIdForCurState() {
    this.currentStateList = [];
    this.employeeForm.controls.currentState.reset();
    this.currentCityList = [];
    this.employeeForm.controls.currentCity.reset();
    let countryId = this.employeeForm.controls.currentCountry.value;
    if (countryId && countryId != null && countryId != undefined) {
      this.masterService.getStateListByCountryId(countryId).subscribe(data => {
        if (data && data.data) {
          this.currentStateList = data.data;
          // this.getCityListByStateId();
        }
      }, error => {
        console.log('Error in getting State list inside Employee Details : ', error.error.message);
      })
    }
  }

  getCityListByStateIdForPerCity() {
    this.permanentCityList = [];
    this.employeeForm.controls.permanentCity.reset();
    let stateId = this.employeeForm.controls.permanentState.value;
    if (stateId && stateId != null && stateId != undefined) {
      this.masterService.getCityListByStateId(stateId).subscribe(data => {
        if (data && data.data) {
          this.permanentCityList = data.data;
        }
      }, error => {
        console.log('Error in getting City list inside Employee Details : ', error.error.message);
      })
    }
  }

  getCityListByStateIdForCurCity() {
    this.currentCityList = [];
    this.employeeForm.controls.currentCity.reset();
    let stateId = this.employeeForm.controls.currentState.value;
    if (stateId && stateId != null && stateId != undefined) {
      this.masterService.getCityListByStateId(stateId).subscribe(data => {
        if (data && data.data) {
          this.currentCityList = data.data;
        }
      }, error => {
        console.log('Error in getting City list inside Employee Details : ', error.error.message);
      })
    }
  }

  markFormAsTouched() {
    this.employeeForm.markAllAsTouched();
  }

  selectAllChecked(event) {
    if (event.target.checked) {
      let allClassesIds = this.roleMasterList.map(item => item.id);
      this.selectedListForRoleMaster = allClassesIds;
      this.employeeForm.controls.roleMasterId.setValue(allClassesIds);
    } else {
      this.selectedListForRoleMaster = [];
      this.employeeForm.controls.roleMasterId.setValue('');
    }
  }

  checkEmailIdIfAlreadyExistsOrNot() {
    let emailId = this.employeeForm.controls.emailId.value;
    if (emailId && emailId != undefined && emailId != null && emailId != '') {
      this.masterService.checkEmailIdOfEmployee(emailId).subscribe(data => {
        if (data && data.data) {
          this.employeeForm.controls.emailId.setErrors(null);
          this.employeeForm.controls.emailId.setValidators([Validators.required, Validators.maxLength(50), CustomValidator.emailIdValidation]);
          this.employeeForm.controls.emailId.updateValueAndValidity();
        } else {
          this.employeeForm.controls.emailId.setErrors({ "emailAlreadyRegistered": true });
          let messageObj = this.messageService.getMessage("EMAIL_ALREADY_EXISTS");
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        }
      }, error => {
        console.log('Error in checking employee email id : ', error);
      })
    }
  }

  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.markFormAsTouched();
      let messageObj = this.messageService.getMessage("PLEASE_FILL_ALL_REQUIRED_FIELDS");
      if (messageObj) {
        this.toaster.error(messageObj.description, messageObj.type);
      }
    } else {
      console.log('data : ', this.employeeForm.getRawValue());
      this.masterService.saveEmployee(this.employeeForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          // this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.message == 'EMAIL_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving employee records : ', error.message);
        }
        // console.log('Error in saving role master records : ', error.error.message);
      })
    }
  }

  updateEmployee() {
    if (this.employeeForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.updateEmployee(this.employeeForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          // this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.error.message == 'EMAIL_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving designation records : ', error.message);
        }
      })
    }
  }

  getEmployeeDeatilsById() {
    this.masterService.getEmployeeDeatilsById(this.employeeForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.patchEmployeeForm(data.data);
      }
    }, error => {
      console.log('error inside get employee details by id : ', error);
    })
  }

  patchEmployeeForm(employee) {
    let employeeDetails = employee.employee;
    let roleMasterId = employee.roleEmployeeList;
    let skillMasterIds = employee.skillEmployeeList;
    this.employeeForm.patchValue({
      id: employeeDetails.id,
      empCode: employeeDetails.empCode,
      firstName: employeeDetails.firstName,
      middleName: employeeDetails.middleName,
      lastName: employeeDetails.lastName,
      status: employeeDetails.status,
      mobileNumber: employeeDetails.mobileNumber,
      emailId: employeeDetails.emailId,
      permanentAddressLine1: employeeDetails.permanentAddressLine1,
      permanentAddressLine2: employeeDetails.permanentAddressLine2,
      permanentCountry: employeeDetails.permanentCountry,
      permanentPincode: employeeDetails.permanentPincode,
      sameAsPermanentAddress: employeeDetails.sameAsPermanentAddress,
      currentAddressLine1: employeeDetails.currentAddressLine1,
      currentAddressLine2: employeeDetails.currentAddressLine2,
      currentCountry: employeeDetails.currentCountry,
      currentPincode: employeeDetails.currentPincode,
      imagePath: [null],
      dateOfJoining: employeeDetails.dateOfJoining,
      designationId: employeeDetails.designationId
      // skillMasterIds: ['', [Validators.required]],
    });
    this.getStateListByCountryIdForPerState();
    this.getStateListByCountryIdForCurState();
    this.employeeForm.patchValue({
      permanentState: employeeDetails.permanentState,
      currentState: employeeDetails.currentState,
    });
    this.getCityListByStateIdForPerCity();
    this.getCityListByStateIdForCurCity();
    this.employeeForm.patchValue({
      permanentCity: employeeDetails.permanentCity,
      currentCity: employeeDetails.currentCity
    });
    if (roleMasterId && roleMasterId != null && roleMasterId != undefined && roleMasterId.length > 0) {
      let sectionsIdsArray = [];
      roleMasterId.forEach(element => {
        sectionsIdsArray.push(parseInt(element.roleMasterId));
      });
      this.employeeForm.controls.roleMasterId.patchValue(sectionsIdsArray);
    }

    if (skillMasterIds && skillMasterIds != null && skillMasterIds != undefined && skillMasterIds.length > 0) {
      let sectionsIdsArray = [];
      skillMasterIds.forEach(element => {
        sectionsIdsArray.push(parseInt(element.skillMasterId));
      });
      this.employeeForm.controls.skillMasterIds.patchValue(sectionsIdsArray);
    }
  }

  uploadPhoto(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      var pattern = /\.(jpeg|jpg|png|img)$/i;
      if (!this.file.name.match(pattern)) {
        let messageObj = this.messageService.getMessage("INVALID_FILE_FORMAT");
        if (messageObj) {
          this.toaster.warning(messageObj.description, messageObj.type);
        }
        return;
      }
      else if (this.file.size > '1000000') {
        let messageObj = this.messageService.getMessage("INVALID_FILE_SIZE");
        if (messageObj) {
          this.toaster.warning(messageObj.description, messageObj.type);
        }
        return;
      }
      this.employeeForm.patchValue({
        imagePath: this.file
      });
      const reader = new FileReader();
      reader.onload = () => {
        this.photo = reader.result as string;
      }
      reader.readAsDataURL(this.file);
      // let data = new FormData();
      // data.append("file", this.file);
      // // data.append("location", "/src/main/resources/images");
      // this.employeeForm.controls.imagePath.setValue(data);
      // this.employeeForm.get('imagePath').updateValueAndValidity();
    }
  }
}
