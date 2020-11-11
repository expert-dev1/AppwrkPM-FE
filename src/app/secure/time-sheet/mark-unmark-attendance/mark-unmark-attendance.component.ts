import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidatorErrorMessages } from 'src/app/core';
import { MessageService } from 'src/app/core/services/message/message.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { TimeSheetService } from '../service/time-sheet.service';

@Component({
  selector: 'app-mark-unmark-attendance',
  templateUrl: './mark-unmark-attendance.component.html',
  styleUrls: ['./mark-unmark-attendance.component.scss']
})
export class MarkUnmarkAttendanceComponent implements OnInit {

  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;

  public employeeAttendanceForm = this.formBuilder.group({
    id: [0],
    checkInDate: [''],
    status: ['', [Validators.required]],
    checkOutDate: [''],
    breakTimeInMin: [''],
  });
  constructor(private formBuilder: FormBuilder, private timeSheetService: TimeSheetService,
    private messageService: MessageService, private toastr: ToastrService, private router: Router) {
    this.checkIfUserCheckedInOrNot();
  }

  ngOnInit(): void {

  }

  checkIfUserCheckedInOrNot() {
    this.timeSheetService.checkIfUserCheckedInOrNot().subscribe(data => {
      console.log('data inside checkIfUserCheckedInOrNot : ', data);
      if (data && data.data) {
        this.patchform(data.data);
      }
    }, error => {
      console.log('Error inside check if user checked in or not : ', error);
    })
  }

  patchform(employeeAttendanceDetails) {
    this.employeeAttendanceForm.patchValue({
      id: employeeAttendanceDetails.id,
      checkInDate: employeeAttendanceDetails.checkInDate,
      status: employeeAttendanceDetails.status,
    });
  }

  onSelectionOfRadioButton() {
    let statusMarked = this.employeeAttendanceForm.controls.status.value;
    if (statusMarked) {
      if (statusMarked == 'CHECK_IN') {
        this.employeeAttendanceForm.controls.checkInDate.setValue(new Date());
        this.markAttendanceOfLoggedInEmployee();
      } else if (statusMarked == 'CHECK_OUT') {
        this.employeeAttendanceForm.controls.checkOutDate.setValue(new Date());
        this.employeeAttendanceForm.controls.breakTimeInMin.setValidators([Validators.required]);
      }
    }
  }

  markAttendanceOfLoggedInEmployee() {
    if (this.employeeAttendanceForm.invalid) {
      this.employeeAttendanceForm.markAllAsTouched();
      let messageObj = this.messageService.getMessage("PLEASE_FILL_ALL_REQUIRED_FIELDS");
      if (messageObj) {
        this.toastr.error(messageObj.description, messageObj.type);
      }
    } else {
      this.timeSheetService.markAttendanceOfLoggedInEmployee(this.employeeAttendanceForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          if (data.data.status == 'CHECK_IN') {
            let messageObj = this.messageService.getMessage("SUCCESSFULLY_CHECKED_IN");
            if (messageObj) {
              this.toastr.success(messageObj.description, messageObj.type);
            }
            this.patchform(data.data);
          } else {
            let messageObj = this.messageService.getMessage("SUCCESSFULLY_CHECKED_OUT")
            if (messageObj) {
              this.toastr.success(messageObj.description, messageObj.type);
            }
            this.router.navigate(['secure/dashboard/employeeDashboard']);
          }
        }
      }, error => {
        console.log('Error inside markAttendanceOfLoggedInEmployee : ', error);
      })
    }
  }

}
