import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsave-changes-confirmation-popup',
  templateUrl: './unsave-changes-confirmation-popup.component.html',
  styleUrls: ['./unsave-changes-confirmation-popup.component.scss']
})
export class UnsaveChangesConfirmationPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UnsaveChangesConfirmationPopupComponent>) { }

  ngOnInit(): void {
  }

  unsaveChangesConfirmed() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
