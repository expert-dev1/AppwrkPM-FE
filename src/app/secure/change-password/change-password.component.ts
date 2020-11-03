import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator, ValidatorErrorMessages } from 'src/app/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MessageService } from 'src/app/core/services/message/message.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public randomGeneratedString: string;
  public isCurrentPasswordHide: boolean = false;
  public isNewPasswordHide: boolean = false;
  public isConfirmPasswordHide: boolean = false;

  public changePasswordForm = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.maxLength(10), CustomValidator.passwordCharactersValidation]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private authService: AuthService, private toastr: ToastrService, private messageService: MessageService) {

  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  checkPasswordMatchesOrNot() {
    let newPassword = this.changePasswordForm.controls.newPassword.value;
    let confirmPassword = this.changePasswordForm.controls.confirmPassword.value;
    if (newPassword && newPassword != undefined && newPassword != null && newPassword != ''
      && confirmPassword && confirmPassword != undefined && confirmPassword != null && confirmPassword != '') {
      if (newPassword != confirmPassword) {
        this.changePasswordForm.controls.confirmPassword.setErrors({});
      }
    }
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
    } else {
      this.authService.changePassword(this.changePasswordForm.getRawValue()).subscribe(data => {
        if (data && data.data) {
          this.dialogRef.close({ success: true });
        }
      }, error => {
        if (error.error.message == 'CURRENT_PASSWORD_INVALID') {
          let messageObj = this.messageService.getMessage(error.error.message);
          if (messageObj) {
            this.toastr.error(messageObj.description, messageObj.type);
          }
        } else {
          console.log('Error in change password : ', error);
        }
      });
    }
  }
}
