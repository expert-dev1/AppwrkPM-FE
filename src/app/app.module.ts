import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { HttpClientInterceptor } from './core/_interceptors/http-client-interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      newestOnTop: true,
      // positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpClientInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
