import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss']
})
export class AddEditProjectComponent implements OnInit {

  public projectForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    start_date: ['', [Validators.required]], //start date of project
    type: ['', [Validators.required]], // linkedIn/upwork
    time_type: ['', [Validators.required]], // fixed/hourly
    amount: ['', [Validators.required]], // fixed/hourly
    hold:  ['', [Validators.required]],
    status: ['', [Validators.required]], //yet to start, in process, completed, on hold, delievered
    resource_working :  [[]], //list of resources working on this project
  })

  public currentDate = new Date();
  projectStatusType = ['Pending','In-process','hold','completed','delievered']


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

}
