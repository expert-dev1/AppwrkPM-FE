import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CustomValidator, ValidatorErrorMessages } from 'src/app/core';
import { STATUS_LIST } from 'src/app/core/modals/constant';
import { MessageService } from 'src/app/core/services/message/message.service';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-organization-master',
  templateUrl: './organization-master.component.html',
  styleUrls: ['./organization-master.component.scss']
})
export class OrganizationMasterComponent implements OnInit {

  public orgId: any;
  public action: any;
  public singleRecordOfOrganization: any;
  public routerSubscription: Subscription;
  public countryList: any = [];
  public stateList: any = [];
  public cityList: any = [];
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public statusList = STATUS_LIST;

  public organizationForm = this.formBuilder.group({
    id: [''],
    orgCode: ['', [Validators.required, Validators.maxLength(50), CustomValidator.userNameValidation]],
    orgName: ['', [Validators.required, Validators.maxLength(50)]],
    emailId: ['', [Validators.required, Validators.maxLength(50), CustomValidator.emailIdValidation]],
    mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    status: ['', [Validators.required, Validators.maxLength(50)]],
    addressLine1: ['', [Validators.required, Validators.maxLength(200)]],
    addressLine2: ['', [Validators.maxLength(200)]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.maxLength(200)]]
  });

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private toaster: ToastrService,
    private masterService: MasterService, private messageService: MessageService) {
    this.routerSubscription = this.routerSubscription = this.activatedRoute.url.subscribe((params) => {
      this.action = this.activatedRoute.snapshot.params.action;
      this.orgId = this.activatedRoute.snapshot.params.id;
      this.openFormAccordingToAction();
    });
  }

  ngOnInit(): void {
  }

  openFormAccordingToAction() {
    this.organizationForm.controls.id.setValue(this.orgId);
    this.getAllCountryList();
    if (this.action == 'add') {

    } else if (this.action == 'edit') {
      this.getOrganizationDetailsById();
    }
  }

  getAllCountryList() {
    this.masterService.getAllCountryList().subscribe(data => {
      if (data && data.data) {
        this.countryList = data.data;
        // this.getStateListByCountryId();
      }
    }, error => {
      console.log('Error in getting Country list inside Employee Details : ', error.error.message);
    })
  }

  getStateListByCountryId() {
    this.stateList = [];
    this.organizationForm.controls.state.reset();
    this.cityList = [];
    this.organizationForm.controls.city.reset();
    let countryId = this.organizationForm.controls.country.value;
    if (countryId && countryId != null && countryId != undefined) {
      this.masterService.getStateListByCountryId(countryId).subscribe(data => {
        if (data && data.data) {
          this.stateList = data.data;
          // this.getCityListByStateId();
        }
      }, error => {
        console.log('Error in getting State list inside Employee Details : ', error.error.message);
      })
    }
  }

  getCityListByStateId() {
    this.cityList = [];
    this.organizationForm.controls.city.reset();
    let stateId = this.organizationForm.controls.state.value;
    if (stateId && stateId != null && stateId != undefined) {
      this.masterService.getCityListByStateId(stateId).subscribe(data => {
        if (data && data.data) {
          this.cityList = data.data;
        }
      }, error => {
        console.log('Error in getting City list inside Employee Details : ', error.error.message);
      })
    }
  }

  getOrganizationDetailsById() {
    this.masterService.getOrganizationDetailsById(this.organizationForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.patchOrganizationForm(data.data);
      }
    }, error => {
      console.log('Error in getOrganizationDetailsById : ', error);
    })
  }

  patchOrganizationForm(organizationDetails) {
    this.organizationForm.patchValue({
      id: organizationDetails.id,
      orgName: organizationDetails.orgName,
      orgCode: organizationDetails.orgCode,
      status: organizationDetails.status,
      addressLine1: organizationDetails.addressLine1,
      addressLine2: organizationDetails.addressLine2,
      pincode: organizationDetails.pincode,
      country: organizationDetails.country,
      emailId: organizationDetails.emailId,
      mobileNumber: organizationDetails.mobileNumber
    });
    this.getStateListByCountryId();
    this.organizationForm.patchValue({
      state: organizationDetails.state,
    });
    this.getCityListByStateId();
    this.organizationForm.patchValue({
      city: organizationDetails.city
    });
  }

  checkOrganizationCode() {
    let orgCode = this.organizationForm.controls.orgCode.value;
    let orgId = this.organizationForm.controls.id.value;
    if (orgCode && orgCode != undefined && orgCode != null && orgCode != '') {
      this.masterService.checkOrganizationCode(orgCode, orgId).subscribe(data => {
        if (data && data.data) {
          this.organizationForm.controls.orgCode.setErrors(null);
          this.organizationForm.controls.orgCode.setValidators([Validators.required, Validators.maxLength(50), CustomValidator.userNameValidation]);
          this.organizationForm.controls.orgCode.updateValueAndValidity();
        } else {
          this.organizationForm.controls.orgCode.setErrors({ "orgCodeAlreadyExists": true });
          // this.employeeForm.controls.emailId.updateValueAndValidity();
          let messageObj = this.messageService.getMessage("ORG_CODE_ALREADY_EXISTS");
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        }
      }, error => {
        console.log('Error in checking Organization Code : ', error);
      })
    }
  }

  save() {
    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched();
    } else {
      this.masterService.saveOrganization(this.organizationForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          let messageObj = this.messageService.getMessage("SAVE");
          if (messageObj) {
            this.toaster.success(messageObj.description, messageObj.type);
          }
          this.router.navigate(['secure/masterSetup/organisation/edit/'+ data.data.id]);
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving Organization record : ', error);
        }     
      })
    }
  }

  update() {
    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched();
    } else {
      this.masterService.updateOrganization(this.organizationForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          let messageObj = this.messageService.getMessage("UPDATE");
          if (messageObj) {
            this.toaster.success(messageObj.description, messageObj.type);
          }
          this.router.navigate(['secure/masterSetup/organisation/edit/'+ this.organizationForm.controls.id.value]);
          this.getOrganizationDetailsById();
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in updating Organization record : ', error);
        }        
      })
    }
  }

  goBack() {
    this.router.navigate(['secure/masterSetup/organisation']);
  }

}
