import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorErrorMessages } from 'src/app/core';
import { MessageService } from 'src/app/core/services/message/message.service';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-skill-master',
  templateUrl: './skill-master.component.html',
  styleUrls: ['./skill-master.component.scss']
})
export class SkillMasterComponent implements OnInit {

  public skillMasterId: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public skillMasterForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    organizationId: ['']
  })

  constructor(public dialogRef: MatDialogRef<SkillMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
  private formBuilder: FormBuilder, private masterService: MasterService, private toaster: ToastrService, 
  private messageService: MessageService) {
    this.skillMasterId = data.skillMasterId;
    this.action = data.action;
    this.openFormBasedOnActions();
  }

  ngOnInit(): void {
  }

  openFormBasedOnActions() {
    this.skillMasterForm.patchValue({
      id: this.skillMasterId,
    });
    if (this.action == 'edit') {
      this.getSkillMasterDeatilsById();
    }
  }

  getSkillMasterDeatilsById() {
    this.masterService.getSkillMasterDeatilsById(this.skillMasterForm.controls.id.value).subscribe(data => {
      if (data && data.data) {
        this.patchSkillMasterForm(data.data);
      }
    }, error => {
      console.log('Error in getting skillMaster Details : ', error.error.message);
    })
  }

  patchSkillMasterForm(skillMasterDetails) {
    this.skillMasterForm.patchValue({
      id: skillMasterDetails.id,
      name: skillMasterDetails.name,
      description: skillMasterDetails.description,
      organizationId: skillMasterDetails.organizationId,
    });
  }

  markFormAsTouched() {
    this.skillMasterForm.markAllAsTouched();
  }

  save() {
    if (this.skillMasterForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.saveSkillMaster(this.skillMasterForm.value).subscribe(data => {
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
          console.log('Error in saving skillMaster records : ', error.message);
        }
      })
    }
  }

  update() {
    if (this.skillMasterForm.invalid) {
      this.markFormAsTouched();
    } else {
      this.masterService.updateSkillMaster(this.skillMasterForm.getRawValue()).subscribe(data => {
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
          console.log('Error in saving skillMaster records : ', error.message);
        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

}
