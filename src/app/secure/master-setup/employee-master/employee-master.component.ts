import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/custom-validators/custom-validators';
import { ValidatorErrorMessages } from 'src/app/custom-validators/validators-error-message';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {
  public employeeId: any;
  public employeeDetails: any;
  public orgId: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public statusList = [{ value: 'ACTIVE', name: 'Active' }, { value: 'INACTIVE', name: 'Inactive' }];
  public designationList: any = [];
  public roleMasterList: any = [];
  public countryList: any = [];
  public stateList: any = [];
  public cityList: any = [];
  public currentDate = new Date();
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
    addressLine1: ['', [Validators.required, Validators.maxLength(250)]],
    addressLine2: ['', [Validators.maxLength(250)]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
    imagePath: [null],
    roleMaster: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    organizationId: ['', [Validators.required]]
  })

  constructor(public dialogRef: MatDialogRef<EmployeeMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private masterService: MasterService, private toaster: ToastrService) {
    this.employeeId = data.employeeId;
    this.orgId = data.orgId;
    this.action = data.action;
    this.openFormBasedOnActions();
  }

  ngOnInit(): void {
  }

  openFormBasedOnActions() {
    this.employeeForm.patchValue({
      id: this.employeeId,
    });
    this.getRoleMasterListByOrgId();
    this.getAllCountryList();
    if (this.action == 'add') {
      this.employeeForm.patchValue({
        organizationId: this.orgId,
      })
    } else if (this.action == 'edit') {
      this.getEmployeeDeatilsById();
      this.employeeForm.controls.emailId.disable();
    } else {

    }
  }

  getRoleMasterListByOrgId() {
    if (this.orgId && this.orgId != undefined && this.orgId != null) {
      this.masterService.getRoleMasterListByOrgId(this.orgId).subscribe(data => {
        if (data) {
          this.roleMasterList = data.content.roles;
        }
      }, error => {
        console.log('error in fetching role master list inside employee master component : ', error);
      })
    }
  }

  getAllCountryList() {
    this.masterService.getAllCountryList().subscribe(data => {
      console.log('data inside coutry list : ', data);
      if (data && data.length > 0) {
        this.countryList = data;
        // this.getStateListByCountryId();
      }
    }, error => {
      console.log('Error in getting Country list inside Employee Details : ', error.error.message);
    })
  }

  getStateListByCountryId() {
    this.stateList = [];
    this.employeeForm.controls.state.reset();
    this.cityList = [];
    this.employeeForm.controls.city.reset();
    let countryId = this.employeeForm.controls.country.value;
    if (countryId && countryId != null && countryId != undefined) {
      this.masterService.getStateListByCountryId(countryId).subscribe(data => {
        console.log('data inside state list : ', data);
        if (data && data.length > 0) {
          this.stateList = data;
          // this.getCityListByStateId();
        }
      }, error => {
        console.log('Error in getting State list inside Employee Details : ', error.error.message);
      })
    }
  }

  getCityListByStateId() {
    this.cityList = [];
    this.employeeForm.controls.city.reset();
    let stateId = this.employeeForm.controls.state.value;
    if (stateId && stateId != null && stateId != undefined) {
      this.masterService.getCityListByStateId(stateId).subscribe(data => {
        console.log('data inside city list : ', data);
        if (data && data.length > 0) {
          this.cityList = data;
        }
      }, error => {
        console.log('Error in getting City list inside Employee Details : ', error.error.message);
      })
    }
  }

  markFormAsTouched() {
    this.employeeForm.markAllAsTouched();
  }

  checkEmailIdIfAlreadyExistsOrNot() {
    let emailId = this.employeeForm.controls.emailId.value;
    if (emailId && emailId != undefined && emailId != null && emailId != '') {
      this.masterService.checkEmailIdOfEmployee(emailId).subscribe(data => {
        if (data && data.data && data.data.employee && data.data.employee != undefined && data.data.employee != null) {
          console.log('data.data.employee : ', data.data.employee);
          this.employeeForm.controls.emailId.setErrors({"emailAlreadyRegistered": true});
          // this.employeeForm.controls.emailId.updateValueAndValidity();
        } else {
          this.employeeForm.controls.emailId.setErrors(null);
          this.employeeForm.controls.emailId.setValidators([Validators.required, Validators.maxLength(50), CustomValidator.emailIdValidation]);
          this.employeeForm.controls.emailId.updateValueAndValidity();
        }
      }, error => {
        console.log('Error in checking employee email id : ', error);
      })
    }
  }

  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.saveEmployee(this.employeeForm.getRawValue()).subscribe(data => {
        console.log('data inside save : ', data);
        if (data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        console.log('Error in saving role master records : ', error.message);
        if (error.message == 'RECORD_ALREADY_EXISTS') {
          this.toaster.error("Record already exsits.", "ERROR");
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
        console.log('data inside save : ', data);
        if (data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        
        if (error.message == 'EMAIL_ID_ALREADY_REGISTERED') {
          this.toaster.error("E-Mail Id Already Registered.", "ERROR");
        } else {
          console.log('Error in saving designation records : ', error.message);
        }        
      })
    }
  }

  getEmployeeDeatilsById() {
    this.masterService.getEmployeeDeatilsById(this.employeeForm.controls.id.value).subscribe(data => {
      console.log('data inside get employee details : ', data);
      if (data && data != undefined && data != null) {
        this.patchEmployeeForm(data);
      }
    }, error => {
      console.log('error inside get employee details by id : ', error);
    })
  }

  patchEmployeeForm(employeeDetails) {
    console.log('employee details id : ', employeeDetails.id);
    this.employeeForm.patchValue({
      id: employeeDetails.id,
      empCode: employeeDetails.empCode,
      firstName: employeeDetails.firstName,
      middleName: employeeDetails.middleName,
      lastName: employeeDetails.lastName,
      status: employeeDetails.status,
      mobileNumber: employeeDetails.mobileNumber,
      emailId: employeeDetails.emailId,
      addressLine1: employeeDetails.addressLine1,
      addressLine2: employeeDetails.addressLine2,
      pincode: employeeDetails.pincode,
      country: employeeDetails.country,
      roleMaster: employeeDetails.roleMaster,
      dateOfJoining: new Date(employeeDetails.dateOfJoining),
      organizationId: employeeDetails.organizationId,
    });
    this.getStateListByCountryId();
    this.employeeForm.patchValue({
      state: employeeDetails.state,
    });
    this.getCityListByStateId();
    this.employeeForm.patchValue({
      city: employeeDetails.city
    });
  }

  uploadPhoto(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      var pattern = /\.(jpeg|jpg|png|img)$/i;
      // let format = this.file.name.split('.').pop();
      if (!this.file.name.match(pattern)) {
        this.toaster.warning("Invalid format of file", "WARNING");
        return;
      }
      else if (this.file.size > '1000000') {
        this.toaster.warning("Only 1 MB file will be uploaded", "WARNING");
        return;
      }
      let data = new FormData();
      data.append("file", this.file);
      data.append("location", "/src/main/resources/images");
    }
  }

  closePopUp() {
    this.dialogRef.close();
  }

}
