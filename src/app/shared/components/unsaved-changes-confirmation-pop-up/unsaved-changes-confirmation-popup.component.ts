import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unsave-changes-confirmation-popup',
  template: `
                <div class="modal-content">
                   <div *ngIf="!isRemoveCancelButton" class="modal-header">
                     <h5>{{title || 'Confirm'}}</h5>
                   </div>
                   <div class="modal-body">
                     <label><i style="color:red;" class="fa fa-exclamation-triangle pr-2" aria-hidden="true"></i>{{message || 'Are you sure?'}}</label>
                     <label *ngIf="warningMessage" style="color: red" >{{warningMessage}}</label>
                   </div>
                   <div class="modal-footer">
                     <button class="mat-raised-button mat-primary mr-2"  type="button"  (click)="confirm()" autofocus >{{confirmButtonName || 'OK'}}</button>
                     <button  *ngIf="!isRemoveCancelButton" class="mat-button" type="button"  (click)="cancel()">{{cancelButtonName || 'Cancel'}}</button>
                   </div>
                </div>`
})
export class UnsavedChangesConfirmationPopupComponent {

  title: string;
  message: string;
  confirmButtonName: string;
  cancelButtonName: string;
  isRemoveCancelButton: any;
  warningMessage: any;

  constructor(public dialogRef: MatDialogRef<UnsavedChangesConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogBoxData: any) {
    this.title = this.dialogBoxData.title;
    this.message = this.dialogBoxData.message;
    this.isRemoveCancelButton = this.dialogBoxData.isRemoveCancelButton;
    this.confirmButtonName = this.dialogBoxData.confirmButtonName;
    this.cancelButtonName = this.dialogBoxData.cancelButtonName;
    this.warningMessage = this.dialogBoxData.warningMessage;
  }

  confirm() {
    // on click on confirm button we set dialog result as true,
    // ten we can get dialog result from caller code
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  close() {
    this.dialogRef.close(false);
  }
}
