import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { FormArray } from '@angular/forms';

const enum ProjectNameStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  UNAVAILABLE = 'UNAVAILABLE',
  CHECKING = 'CHECKING'
}

const enum ProjectStatusType {
  PENDING = "PENDING",
  IN_PROCESS = "IN-PROCESS",
  ON_HOLD = "ON-HOLD",
  COMPLETED ="COMPLETED"
}
@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss']
})
export class AddEditProjectComponent implements OnInit {

  public projectInfoForm: FormGroup;
  public clientInfoForm: FormGroup;
  public currentDate = new Date();
  projectStatusType = [
    { title: ProjectStatusType.PENDING },
    { title: ProjectStatusType.IN_PROCESS },
    { title: ProjectStatusType.ON_HOLD },
    { title: ProjectStatusType.COMPLETED }
  ];

  projectTimeType = [{ title: 'Fixed', value: 'FIXED' }, { title: 'Hourly', value: 'HOURLY' }]
  employeeList = [];
  platformList = [];
  projectNameStatus = ProjectNameStatus.PENDING;
  loading;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;

  clientMetaArray = [
    {key:'linkedIn',selected:false},
    {key:'slack',selected:false},
    {key:'youtube',selected:false},
    {key:'phone',selected:false},
    {key:'address',selected:false},
  ]


  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm()
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
  }


  createForm(){
    this.projectInfoForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]], //start date of project
      endDate: ['', [Validators.required]], //start date of project
      platformTypeId: ['', [Validators.required]], // linkedIn/upwork
      timeType: ['HOURLY', [Validators.required]], // fixed/hourly
      amount: ['', [Validators.required]], // fixed/hourly
      status: ['PENDING', [Validators.required]], //yet to start, in process, completed, on hold, delievered
      // employeeId: [[], [Validators.required]], //list of resources working on this project
      organizationId: ['1'],
      desc:['', Validators.required]
    });
    this.clientInfoForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: [''],
      email: ['', Validators.email],
      showAltEmail:[false],
      altEmail: [''],
      skype: [''],
      info: [''],
      meta: this.formBuilder.array([]),
    })
  }

  get meta() {
    return this.clientInfoForm.get('meta') as FormArray;
  }

  addmeta() {
    this.meta.push(this.formBuilder.group({
      key: '',
      value: ''
    }));
    console.log(this.clientInfoForm.controls.meta)
  }

  checkProjectName() {
    this.projectInfoForm.controls.name.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
    ).subscribe(resp => {
      if(resp == '' ){return}
      this.projectNameStatus = ProjectNameStatus.CHECKING;
      this.masterService.verifyProjectName(resp).subscribe(result => {
        if(result.data.data == true){
          this.projectNameStatus = ProjectNameStatus.VERIFIED;
        } else {
          this.projectInfoForm.controls['name'].setErrors({'unavailable': true});
          this.projectNameStatus = ProjectNameStatus.UNAVAILABLE;
        }
      })
    })
  }

  showAlternativeEmail(value){
    this.clientInfoForm.patchValue({showAltEmail:value});
    if(!value){
      this.clientInfoForm.patchValue({altEmail:''})
    }
  }

  submitStep1() {
    if(this.projectInfoForm.invalid){ return}
    let element: HTMLElement = document.getElementById('step1next') as HTMLElement;
    console.log(element)
    element.click();
    // this.loading=true;
    // let data = this.projectInfoForm.value;
    // this.masterService.addNewProject(data).subscribe(resp => {
    //   if(resp.isSuccess){
    //     this.toaster.success("Project created successfully.","Saved");
    //     this.router.navigate(["/secure/masterSetup/projects"]);
    //   } else {
    //     this.loading = false;
    //   }
    // }, err => {
    //   this.loading =false;
    // })
  }

  submitStep2() {
    if(this.clientInfoForm.invalid){ return}
    let element: HTMLElement = document.getElementById('step2next') as HTMLElement;
    console.log(element)
    element.click();
  }

}
