import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ValidatorErrorMessages } from '../../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public isLoginInvalid: boolean = false;
  public getErrorMessage = ValidatorErrorMessages.getErrorMessage;
  public hide = true;

  public loginForm = this.formBuilder.group({
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(50)]],
  });


  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private storageService: StorageService, private router: Router, private toaster: ToastrService) { }

  ngOnInit() {
  }

  markLoginFormAsTouched() {
    this.loginForm.controls.userName.markAsTouched();
    this.loginForm.controls.password.markAsTouched();
  }

  hideInvalidCredentailsMessageOnKeyUp() {
    this.isLoginInvalid = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markLoginFormAsTouched();
    } else {
      // this.authService.login(this.loginForm.value).subscribe(data => {
      //     if (data && data.data && data.data.loginDetails) {
      //       this.isLoginInvalid = false;
      //       this.storageService.saveToken(data.data.loginDetails.userJwt);
      //       this.storageService.saveUser(data.data.loginDetails);
            this.afterLoginRouteToRespectiveRoutes();
      //     }
      //   }, error => {
      //     console.log('Error : ', error.error.message);
      //     this.isLoginInvalid = true;
      //     this.toaster.error("Invalid login Credential.", "ERROR");
      //   }
      // );
    }
  }

  afterLoginRouteToRespectiveRoutes() {
    this.router.navigate(["secure/masterSetup/roles"]);
  }

}
