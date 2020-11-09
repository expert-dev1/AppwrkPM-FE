import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { NgxMatDateFormats } from '@angular-material-components/datetime-picker';

// export const PICK_FORMATS_FOR_DATE_TIME: NgxMatDateFormats = {
//     parse: {
//       dateInput: "l, LTS"
//     },
//     display: {
//       dateInput: "l, LTS",
//       monthYearLabel: "MMM YYYY",
//       dateA11yLabel: "LL",
//       monthYearA11yLabel: "MMMM YYYY"
//     }
//   };

export const PICK_FORMATS_FOR_DATE_TIME = {
    parse: { 
        dateInput: { 
            month: 'short', 
            year: 'numeric', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        } 
    }, display: { 
        dateInput: 'input', 
        monthYearLabel: { 
            year: 'numeric', 
            month: 'short' 
        }, dateA11yLabel: { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }, monthYearA11yLabel: { 
            year: 'numeric', 
            month: 'long' 
        }
    } 
};

export class CustomDateTimeAdaptor extends NativeDateAdapter { 
    
    format(date: Date, displayFormat: Object): string { 
        if (displayFormat === 'input') { 
            return formatDate(date, 'dd MMM, yyyy hh:mm a', this.locale); 
        } else { 
            return date.toDateString(); 
        } 
    } 
}