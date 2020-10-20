import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) { }

  ngOnInit(): void {
  }

  delete() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
