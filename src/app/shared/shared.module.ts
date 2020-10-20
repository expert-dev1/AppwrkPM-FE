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
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatePickerAdapter, PICK_FORMATS } from './mat-date-picker-date-formats/mat-date-picker-format';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaginationPipe } from './pipes/pagination.pipe';

@NgModule({
  declarations: [HeaderComponent, SidebarComponent, ConfirmationComponent, PaginationPipe],
  imports: [
    CommonModule,
    SharedRoutingModule, NgSelectModule, FormsModule,
    ReactiveFormsModule, HttpClientModule, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatRadioModule, MatSelectModule, MatSliderModule, MatSortModule, MatSlideToggleModule, MatTooltipModule, MatIconModule, MatTableModule, MatPaginatorModule, MatBadgeModule],
  exports: [HeaderComponent, SidebarComponent, ReactiveFormsModule, MatSortModule, HttpClientModule, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatRadioModule, PaginationPipe, MatSelectModule, MatBadgeModule, MatSliderModule, MatSlideToggleModule, MatTooltipModule, MatIconModule, MatTableModule, MatPaginatorModule,
    NgSelectModule, FormsModule, ConfirmationComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MatDatePickerAdapter
    }, {
      provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    },
  ],
})
export class SharedModule { }
