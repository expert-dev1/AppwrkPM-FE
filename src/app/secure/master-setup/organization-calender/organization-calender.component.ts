import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';
import { createEventId, INITIAL_EVENTS } from 'src/app/core/utils/event-utils';
import { AddEditCalendarEventComponent } from '../add-edit-calendar-event/add-edit-calendar-event.component';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-organization-calender',
  templateUrl: './organization-calender.component.html',
  styleUrls: ['./organization-calender.component.scss']
})
export class OrganizationCalenderComponent implements OnInit {

  public calendarVisible = true;
  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: []
    /* you can update a remote database when these fire:*/
    // eventAdd: this.handleDateSelect.bind(this),
    // eventChange:
    // eventRemove:
  };

  handleDateClick(selectInfo: DateSelectArg) {
    console.log('Inside handle date click : ', selectInfo);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    
  }

  constructor(private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  openPopUp(calenderId, action) {
    const dialogRef = this.dialog.open(AddEditCalendarEventComponent, {
      width: '1000px',
      height: '500px',
      data: { calenderId: calenderId, action: action },
      disableClose: true
    });
  }

}
