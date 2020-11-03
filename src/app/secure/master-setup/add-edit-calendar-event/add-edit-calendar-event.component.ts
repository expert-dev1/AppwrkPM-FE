import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorErrorMessages } from 'src/app/core';
// import { CustomValidator } from 'src/app/core';
import { EVENT_FOR_LIST, EVENT_FOR_MAP } from 'src/app/core/modals/constant';
import { MessageService } from 'src/app/core/services/message/message.service';
import { MasterService } from '../service/master.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-calendar-event',
  templateUrl: './add-edit-calendar-event.component.html',
  styleUrls: ['./add-edit-calendar-event.component.scss']
})
export class AddEditCalendarEventComponent implements OnInit {

  public eventForList = EVENT_FOR_LIST;
  public eventForMap = EVENT_FOR_MAP;
  public currentDate: Date = new Date();
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;

  public organizationEventForm = this.formBuilder.group({
    eventFor: ['', [Validators.required]],
    celebrationFor: ['', [Validators.required, Validators.maxLength(200)]],
    dateOfEvent: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    eventDuration: ['', [Validators.required]],
    employeeStrengthInEvent: ['', Validators.required],
    venueOfEvent: ['', [Validators.required, Validators.maxLength(200)]]
  });

  constructor(public dialogRef: MatDialogRef<AddEditCalendarEventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private masterService: MasterService, private toastr: ToastrService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  selectedTime() {
    let startTimeDirect = this.organizationEventForm.controls.startTime.value;
    let endTimeDirect = this.organizationEventForm.controls.endTime.value;
    if (startTimeDirect && startTimeDirect != undefined && startTimeDirect != null
      && endTimeDirect && endTimeDirect != undefined && endTimeDirect != null) {
        if (startTimeDirect < endTimeDirect) {
          let startTime = moment(startTimeDirect, "HH:mm A");
          let endTime = moment(endTimeDirect, "HH:mm A");
          let duration = moment.duration(endTime.diff(startTime));
          // duration in minutes
          // let minutes = duration.asMinutes();
          // console.log('duration : ', duration.asHours());
          this.organizationEventForm.controls.eventDuration.setValue(duration.asMinutes());
        } else {
          this.toastr.error("End time should be greater than end time", "ERROR");
          this.organizationEventForm.controls.endTime.reset();
        }      
    } else {

    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.organizationEventForm.invalid) {
      this.organizationEventForm.markAllAsTouched();
    } else {
      this.masterService.saveOrganizationEvent(this.organizationEventForm.getRawValue()).subscribe(data => {

      }, error => {
        console.log('Error in saving events : ', error);
      });
    }
  }

}
