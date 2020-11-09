import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedRoutingModule } from './shared-routing.module';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatePickerAdapter, PICK_FORMATS } from './mat-date-picker-date-formats/mat-date-picker-format';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaginationPipe } from './pipes/pagination.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ContentDivComponent } from './components/content-div/content-div.component';
import { AppwrkLoadingButtonComponent } from './components/appwrk-loading-button/appwrk-loading-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppwrkLoaderComponent } from './components/appwrk-loader/appwrk-loader.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskModule } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { UnsavedChangesConfirmationPopupComponent } from './components/unsaved-changes-confirmation-pop-up/unsaved-changes-confirmation-popup.component';
import { AuthGuard } from './guards/auth.guard';
import { UnsavedChangesGuard } from './guards/unsaved-changes-guard';
import { TimePipe } from './pipes/time.pipe';
import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { CustomDateTimeAdaptor, PICK_FORMATS_FOR_DATE_TIME } from './mat-date-picker-date-formats/custom-date-time-adapter';
// import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'dd MMM, yyyy hh:mm a',
    monthYearLabel: {
      year: 'numeric',
      month: 'short'
    },
    dateA11yLabel: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    monthYearA11yLabel: {
      year: 'numeric',
      month: 'long'
    }
  }
};
@NgModule({
  declarations: [HeaderComponent, SidebarComponent, ConfirmationComponent, PaginationPipe, ContentDivComponent,
    AppwrkLoadingButtonComponent, AppwrkLoaderComponent, UnsavedChangesConfirmationPopupComponent, TimePipe],
  imports: [
    CommonModule, MatStepperModule, MatDialogModule, NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, NgxMatNativeDateModule,
    SharedRoutingModule, NgSelectModule, FormsModule, MatToolbarModule, MatMenuModule, MatProgressSpinnerModule,
    ReactiveFormsModule, HttpClientModule, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatRadioModule, MatListModule, MatSidenavModule, MatSelectModule, MatSliderModule, MatSortModule, MatSlideToggleModule, MatTooltipModule, MatIconModule, MatTableModule,
    MatPaginatorModule, MatBadgeModule, NgxMaskModule, FullCalendarModule],
  exports: [HeaderComponent, SidebarComponent, ReactiveFormsModule, NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, NgxMatNativeDateModule, MatSortModule, HttpClientModule, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatRadioModule, PaginationPipe, MatSelectModule, MatBadgeModule, MatSliderModule, MatSlideToggleModule, MatTooltipModule, MatIconModule,
    MatTableModule, MatPaginatorModule, NgSelectModule, MatStepperModule, MatProgressSpinnerModule, FormsModule, MatListModule, ConfirmationComponent, MatSidenavModule,
    MatToolbarModule, AppwrkLoaderComponent, MatMenuModule, ContentDivComponent, AppwrkLoadingButtonComponent, NgxMaskModule, MatDialogModule,
    FullCalendarModule, TimePipe],
  providers: [
    {
      provide: DateAdapter,
      useClass: MatDatePickerAdapter
    }, 
    {
      provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    },
    // {
    //   provide: NGX_MAT_DATE_FORMATS,
    //   useValue: PICK_FORMATS_FOR_DATE_TIME
    // },
    AuthGuard, UnsavedChangesGuard
  ],
  entryComponents: [UnsavedChangesConfirmationPopupComponent]
})
export class SharedModule { }
