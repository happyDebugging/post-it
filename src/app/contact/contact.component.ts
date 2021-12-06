import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { ContactDetails } from '../shared/models/contact-details.model';
import { ContactService } from '../shared/services/contactService.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  newIssueTitle: string = '';
  newIssueDescription: string = '';
  contactTypes: string[] = ['Αναφορά προβλήματος', 'Προσωπικά δεδομένα'];
  chosenContactType: string = '';
  userEmail: string = '';
  //contactMessage: ContactDetails[] = [];
  isLoadingResults: boolean = false;

  constructor(private contactService: ContactService, private successfulPostCreationNotification: MatSnackBar) { }

  ngOnInit(): void {

  }

  openNeededFieldsWarningSnackBar() {
    let message = 'Τα υποχρεωτικά πεδία δεν μπορούν να είναι κενά.';
    let action = 'OK';
    this.successfulPostCreationNotification.open(message, action, {
      duration: 5000
    });
  }

  postMessageToDb() {
    if (this.chosenContactType == '' || this.userEmail == '' || this.newIssueTitle == '' || this.newIssueDescription == '') {
      this.openNeededFieldsWarningSnackBar();
    }
    else {
      let contactMessage = new ContactDetails;

      contactMessage.Type = this.chosenContactType;
      contactMessage.Title = this.newIssueTitle;
      contactMessage.Description = this.newIssueDescription;
      contactMessage.Email = this.userEmail;

      this.contactService.postNewIssueToDb(contactMessage)
        .subscribe(
          async (res: any) => {
            //console.log(res);
            if ((res != null) || (res != undefined)) {
              //const responseData = new Array<AppIssues>(...res);
              const success = true;
              this.openSuccessPostSnackBar(success);
            }
          },
          (err: any) => {
            //console.log(err);
          }
        );
    }
  }

  openSuccessPostSnackBar(success: boolean) {
    let message = '';
    let action = '';
    if (success) {
      message = 'Επιτυχής αποστολή μηνύματος!';
      action = 'OK';
    }
    else {
      message = 'Πρόβλημα αποστολής μηνύματος. Προσπαθήστε ξανά.';
      action = 'OK';
    }

    this.successfulPostCreationNotification.open(message, action, {
      duration: 5000
    });
  }

  async refreshResults() {

  }

}
