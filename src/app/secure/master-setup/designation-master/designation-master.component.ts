import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ValidatorErrorMessages } from '../../../core';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent implements OnInit {

  public orgId: any;
  public designationId: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public designationForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(250)]],
    organizationId: ['']
  })

  constructor(public dialogRef: MatDialogRef<DesignationMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private masterService: MasterService, private toaster: ToastrService, private messageService: MessageService) {
    this.designationId = data.designationId;
    this.orgId = data.orgId;
    this.action = data.action;
    this.openFormBasedOnActions();
  }

  ngOnInit(): void {
  }

  openFormBasedOnActions() {
    this.designationForm.patchValue({
      id: this.designationId,
    })
    if (this.action == 'add') {
      this.designationForm.patchValue({
        organizationId: this.orgId,
      })
    } else if (this.action == 'edit') {
      this.getDesignationDeatilsById();
    } else {

    }
  }

  getDesignationDeatilsById() {
    this.masterService.getDesignationDeatilsById(this.designationForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.patchDesignationForm(data.data);
      }
    }, error => {
      console.log('Error in getting Designation Details : ', error.error.message);
    })
  }

  patchDesignationForm(designationDetails) {
    this.designationForm.patchValue({
      id: designationDetails.id,
      name: designationDetails.name,
      description: designationDetails.description,
      organizationId: designationDetails.organizationId,
    });
  }

  markFormAsTouched() {
    this.designationForm.markAllAsTouched();
  }

  save() {
    if (this.designationForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.saveDesignation(this.designationForm.value).subscribe(data => {
        if (data && data.data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving designation records : ', error.message);
        }
      })
    }
  }

  update() {
    if (this.designationForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.updateDesignation(this.designationForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          this.dialogRef.close({ success: true, action: this.action });
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toaster.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in saving designation records : ', error.message);
        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

}
