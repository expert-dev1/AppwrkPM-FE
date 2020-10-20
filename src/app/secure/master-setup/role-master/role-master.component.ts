import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorErrorMessages } from '../../../core';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {

  public orgId: any;
  public roleMasterId: any;
  public action: any;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public roleMasterForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(250)]],
    organizationId: ['']
  })

  constructor(public dialogRef: MatDialogRef<RoleMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private masterService: MasterService, private toaster: ToastrService) {
    this.roleMasterId = data.roleMasterId;
    this.orgId = data.orgId;
    this.action = data.action;
    this.openFormBasedOnActions();
  }

  ngOnInit(): void {
  }

  openFormBasedOnActions() {
    this.roleMasterForm.patchValue({
      id: this.roleMasterId,
    })
    if (this.action == 'add') {
      this.roleMasterForm.patchValue({
        organizationId: this.orgId,
      })
    } else if (this.action == 'edit') {
      this.getRoleMasterDeatilsById();
    } else {

    }
  }

  getRoleMasterDeatilsById() {
    this.masterService.getRoleMasterDeatilsById(this.roleMasterForm.controls.id.value).subscribe(data => {
      if (data && data.data && data.data.roleMaster) {
        this.patchRoleMasterForm(data && data.data && data.data.roleMaster);
      }
    }, error => {
      console.log('Error in getting Role Master Details : ', error.error.message);
    })
  }

  patchRoleMasterForm(roleMaster) {
    this.roleMasterForm.patchValue({
      id: roleMaster.id,
      name: roleMaster.name,
      description: roleMaster.description,
      organizationId: roleMaster.organizationId,
    });
  }

  markFormAsTouched() {
    this.roleMasterForm.markAllAsTouched();
  }

  save() {
    if (this.roleMasterForm.invalid) {
      this.markFormAsTouched();
    } else {
      console.log('role master form : ', this.roleMasterForm.value);
      this.masterService.saveRoleMaster(this.roleMasterForm.value).subscribe(data => {
        console.log('data inside save : ', data);
        if (data && data.data && data.data.roleMaster) {
          this.dialogRef.close({success: true, action: this.action} );
        }
      }, error => {
        if (error.error.message == 'RECORD_ALREADY_EXISTS') {
          this.toaster.error("Record already exsits.","ERROR");
        } else {
          console.log('Error in saving role master records : ', error.error.message);
        }
      })
    }
  }

  update() {
    if (this.roleMasterForm.invalid) {
      this.markFormAsTouched();
    } else {
      console.log('role master form : ', this.roleMasterForm.value);
      this.masterService.updateRoleMaster(this.roleMasterForm.value).subscribe(data => {
        console.log('data inside save : ', data);
        if (data && data.data && data.data.roleMaster) {
          this.dialogRef.close({success: true, action: this.action} );
        }
      }, error => {
        if (error == 'RECORD_ALREADY_EXISTS') {
          this.toaster.error("Record already exsits.","ERROR");
        } else {
          console.log('Error in saving role master records : ', error.error.message);
        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

}
