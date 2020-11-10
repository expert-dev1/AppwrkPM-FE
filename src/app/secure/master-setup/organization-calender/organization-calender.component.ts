import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, FullCalendarComponent } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';
import { EVENT_FOR_MAP } from 'src/app/core/modals/constant';
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
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  public calendarVisible = true;
  public eventForMap = EVENT_FOR_MAP;
  public calendarList = [];
  public calendarOptions: CalendarOptions;




  handleDateSelect(selectInfo) {
    console.log('selectInfo inside handle date select : ', selectInfo);
  }

  handleEventClick(selectInfo) {
    console.log('selectInfo inside handle event click : ', selectInfo.event.start);
    console.log('selectInfo inside handle event click : ', selectInfo.event.end);
    let eventDetails = this.calendarList.find(obj => new Date(obj.startDateTime).getTime() == selectInfo.event.start.getTime() && new Date(obj.endDateTime).getTime() == selectInfo.event.end.getTime());
    console.log('Event details : ', eventDetails);
    if (eventDetails && eventDetails != undefined && eventDetails != null) {
      this.openPopUp(eventDetails.id, "edit");
    }
  }

  handleEvents(selectInfo: DateSelectArg) {
    console.log('selectInfo inside handle events : ', selectInfo);
  }

  handleEventChange(selectInfo: DateSelectArg) {
    console.log('selectInfo inside handle event change : ', selectInfo);
  }

  handleEventRemove(selectInfo: DateSelectArg) {
    console.log('selectInfo inside handle event remove : ', selectInfo);
  }

  constructor(private masterService: MasterService, public dialog: MatDialog, private toastr: ToastrService,
    private messageService: MessageService) {
    this.getEventsAndHolidaysListForOrganizationCalendar();
  }

  ngOnInit(): void {

  }

  openPopUp(calenderId, action) {
    const dialogRef = this.dialog.open(AddEditCalendarEventComponent, {
      width: '1000px',
      height: '350px',
      data: { calenderId: calenderId, action: action },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.success) {
          if (result.action == 'add') {
            let messageObj = this.messageService.getMessage("SAVE");
            if (messageObj) {
              this.toastr.success(messageObj.description, messageObj.type);
            }
          } else if (result.action == 'add') {
            let messageObj = this.messageService.getMessage("UPDATE");
            if (messageObj) {
              this.toastr.success(messageObj.description, messageObj.type);
            }
          } else {
            let messageObj = this.messageService.getMessage("DELETE");
            if (messageObj) {
              this.toastr.success(messageObj.description, messageObj.type);
            }
          }
          this.getEventsAndHolidaysListForOrganizationCalendar();
        }
      }
    });
  }

  getEventsAndHolidaysListForOrganizationCalendar() {
    this.masterService.getEventsAndHolidaysListForOrganizationCalendar().subscribe(data => {
      console.log('Data inside getEventsAndHolidaysListForOrganizationCalendar : ', data.data);
      if (data && data.data) {
        this.calendarList = data.data;
        this.addListToCalendar();
      }
    }, error => {
      console.log('Error in getEventsAndHolidaysListForOrganizationCalendar : ', error);
    })
  }

  addListToCalendar() {
    let listOfEvents = [];
    let i = 1;
    this.calendarList.forEach(element => {
      listOfEvents.push(
        {
          id: i,
          title: this.eventForMap[element.eventFor] + " " + element.celebrationFor,
          start: element.startDateTime,
          end: element.endDateTime
        }
      );
      i++;
    });
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek'
      },
      dayMaxEvents: true,
      events: listOfEvents,
      eventClick: this.handleEventClick.bind(this),
    }
  }

}
