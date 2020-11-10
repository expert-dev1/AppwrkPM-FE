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
  public eventDetails: any;
  public calenderId: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;

  public organizationCalendarForm = this.formBuilder.group({
    id: [0],
    eventFor: ['', [Validators.required]],
    celebrationFor: ['', [Validators.required, Validators.maxLength(200)]],
    startDateTime: ['', [Validators.required]],
    endDateTime: ['', [Validators.required]],
    eventDuration: ['', [Validators.required]],
    employeeStrengthInEvent: ['', Validators.required],
    venueOfEvent: ['', [Validators.required, Validators.maxLength(200)]],
    canEdit: [false],
    canDelete: [false],
  });

  constructor(public dialogRef: MatDialogRef<AddEditCalendarEventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private masterService: MasterService, private toastr: ToastrService, private messageService: MessageService) {
    this.calenderId = this.data.calenderId;
    this.organizationCalendarForm.patchValue({ id: this.calenderId });
    this.action = this.data.action;
    this.openPopUpAccordingToAction();
  }

  ngOnInit(): void {
  }

  openPopUpAccordingToAction() {
    if (this.action == 'add') {
      this.organizationCalendarForm.controls.canEdit.setValue(true);
    } else if (this.action == 'edit') {
      this.organizationCalendarForm.disable();
      this.getOrganizationEventDeatils();
    }
  }



  getOrganizationEventDeatils() {
    this.masterService.getOrganizationEventDeatils(this.organizationCalendarForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.eventDetails = data.data;
        this.patchData();
      }
    }, error => {
      console.log('Error inside getOrganizationEventDeatils : ', error);
    });
  }

  patchData() {
    this.organizationCalendarForm.patchValue({
      id: this.eventDetails.id,
      eventFor: this.eventDetails.eventFor,
      celebrationFor: this.eventDetails.celebrationFor,
      startDateTime: new Date(this.eventDetails.startDateTime),
      endDateTime: new Date(this.eventDetails.endDateTime),
      eventDuration: this.eventDetails.eventDuration,
      employeeStrengthInEvent: this.eventDetails.employeeStrengthInEvent,
      venueOfEvent: this.eventDetails.venueOfEvent,
    })
  }

  selectedDateTime() {
    let startDateTimeDirect = this.organizationCalendarForm.controls.startDateTime.value;
    let endDateTimeDirect = this.organizationCalendarForm.controls.endDateTime.value;
    if (startDateTimeDirect && startDateTimeDirect != undefined && startDateTimeDirect != null
      && endDateTimeDirect && endDateTimeDirect != undefined && endDateTimeDirect != null) {
      if (startDateTimeDirect > endDateTimeDirect) {
        let messageObj = this.messageService.getMessage("END_DATE_TIME_NOT_LESS_THAN_START_DATE_TIME");
        if (messageObj) {
          this.toastr.error(messageObj.description, messageObj.type);
          this.organizationCalendarForm.controls.endDateTime.setValue('');
        }
      } else {
        let diffMs = (endDateTimeDirect - startDateTimeDirect); // milliseconds
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        let eventDuration = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes";
        this.organizationCalendarForm.controls.eventDuration.setValue(eventDuration);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.organizationCalendarForm.invalid) {
      this.organizationCalendarForm.markAllAsTouched();
    } else {
      this.masterService.saveOrganizationEvent(this.organizationCalendarForm.getRawValue()).subscribe(data => {
        console.log('data after an event is created : ', data.data);
        if (data && data.data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toastr.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving events : ', error);
        }
      });
    }
  }

  update() {
    console.log('this.organizationCalendarForm : ', this.organizationCalendarForm);
    if (this.organizationCalendarForm.invalid) {
      this.organizationCalendarForm.markAllAsTouched();
    } else {
      this.masterService.updateOrganizationEvent(this.organizationCalendarForm.getRawValue()).subscribe(data => {
        console.log('data after an event is created : ', data.data);
        if (data && data.data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toastr.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving events : ', error);
        }
      });
    }
  }

  editOrDelete(editOrDelete) {
    if (editOrDelete == 'edit') {
      let canEdit = this.organizationCalendarForm.controls.canEdit.value;
      console.log('canEdit : ', canEdit);
      if (canEdit) {        
        this.organizationCalendarForm.patchValue({canEdit: false});
        this.patchData();
        this.organizationCalendarForm.disable();
      } else {
        this.organizationCalendarForm.patchValue({canEdit: true});
        this.organizationCalendarForm.enable();
      }
    } else if (editOrDelete == 'delete') {
      this.deleteOrganizationEvent();
    }
  }

  deleteOrganizationEvent() {
    this.masterService.deleteOrganizationEventsById(this.organizationCalendarForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.dialogRef.close({ success: true, action: this.action });
      }
    }, error => {
      console.log('error in deleteing organization events : ', error);
    })
  }

}
