import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MasterService} from '../../service/master.service';
@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss']
})
export class AddEditProjectComponent implements OnInit {

  public projectForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]], //start date of project
    platformTypeId: ['', [Validators.required]], // linkedIn/upwork
    timeType: ['HOURLY', [Validators.required]], // fixed/hourly
    amount: ['', [Validators.required]], // fixed/hourly
    status: ['PENDING', [Validators.required]], //yet to start, in process, completed, on hold, delievered
    employeeId  :  [[],[Validators.required]], //list of resources working on this project
    organizationId :['1']
  })

  public currentDate = new Date();
  projectStatusType = [
    {title:'PENDING'},
    {title:'IN-PROCESS'},
    {title:'ON-HOLD'},
    {title:'COMPLETED'}
  ];
  projectTimeType = [{title:'Fixed', value:'FIXED'},{title:'Hourly',value:'HOURLY'}]
  employeeList=[];
  platformList=[]


  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.masterService.getEmployeeListWithOrgId().subscribe(resp => {
      this.employeeList = resp;
    });
    this.masterService.getProjectPlatformTypes().subscribe(resp => {
      this.platformList = resp;
    });
  }

  submitForm(){
    let data = this.projectForm.value;
    console.log(data)
    this.masterService.addNewProject(data).subscribe(resp => {
      console.log('rthrthrethrthrethreth : ', {resp})
    })
  }

}
