import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/core/services/message/message.service';
import { UnsavedChangesConfirmationPopupComponent } from '../components/unsaved-changes-confirmation-pop-up/unsaved-changes-confirmation-popup.component';
// import { Observer } from 'rxjs/Observer';
// import { MatDialog } from '@angular/material';
// import { MessageService } from '../core/message/message.service';
// import { ConfirmComponent } from '../common-modules/promptmessage/confirm.component';

export interface CanComponentDeactivate {
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

    constructor(private dialog: MatDialog, private messageService: MessageService,) { }

    canDeactivate(component: CanComponentDeactivate) {
        console.log('Inside can deactivate method');
        // Allow navigation if the component says that it is OK or it doesn't have a canDeactivate function
        if (!component.canDeactivate || component.canDeactivate()) {
            return true;
        }
        return Observable.create((observer: Observer<boolean>) => {
            // UnsavedChangesDialog defined somewhere else and imported above
            let messageObj = this.messageService.getMessage("POP_UP_CONFIRMATION_MESSAGE");
            const dialogRef = this.dialog.open(UnsavedChangesConfirmationPopupComponent, {
                width: '400px',
                disableClose: true,
                data: { title: 'Confirm', message: messageObj['description'], confirmButtonName: 'Yes', cancelButtonName: 'No' }
            }); 
            dialogRef.afterClosed().subscribe(confirm => {
                observer.next(confirm);
                observer.complete();
            }, (error) => {
                console.log('Error in UnsavedChangesGuard : ', error);
                observer.next(false);
                observer.complete();
            });
        });
    }
}