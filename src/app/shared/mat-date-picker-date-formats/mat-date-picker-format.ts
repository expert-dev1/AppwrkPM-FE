import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

export const PICK_FORMATS = {
    parse: { 
        dateInput: { 
            month: 'short', 
            year: 'numeric', 
            day: 'numeric' 
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
export class MatDatePickerAdapter extends NativeDateAdapter { 
    
    format(date: Date, displayFormat: Object): string { 
        if (displayFormat === 'input') { 
            return formatDate(date, 'dd MMM, yyyy', this.locale); 
        } else { 
            return date.toDateString(); 
        } 
    } 
}