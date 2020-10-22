import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  public projectForm: FormGroup;
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


  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService
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
  }


  createForm(){
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]], //start date of project
      platformTypeId: ['', [Validators.required]], // linkedIn/upwork
      timeType: ['HOURLY', [Validators.required]], // fixed/hourly
      amount: ['', [Validators.required]], // fixed/hourly
      status: ['PENDING', [Validators.required]], //yet to start, in process, completed, on hold, delievered
      employeeId: [[], [Validators.required]], //list of resources working on this project
      organizationId: ['1']
    })
  }
  checkProjectName() {
    this.projectForm.controls.name.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
    ).subscribe(resp => {
      if(resp == '' ){return}
      this.projectNameStatus = ProjectNameStatus.CHECKING;
      this.masterService.verifyProjectName(resp).subscribe(result => {
        if(result.data.data == true){
          this.projectNameStatus = ProjectNameStatus.VERIFIED;
        } else {
          this.projectForm.controls['name'].setErrors({'unavailable': true});
          this.projectNameStatus = ProjectNameStatus.UNAVAILABLE;
        }
      })
    })
  }

  submitForm(event) {
    if(this.projectForm.invalid){ return}
    this.loading=true
    let data = this.projectForm.value;
    console.log(data)
    this.masterService.addNewProject(data).subscribe(resp => {
      console.log({ resp })
      setTimeout(() => {
        this.loading = false
      },2000)
    })
  }

}
