import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AppIssues } from '../shared/models/app-issues.model';
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
  issues: AppIssues[] = [];
  isLoadingResults: boolean = false;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {

  }

  postIssueToDb() {
    let issue = new AppIssues;

    issue.Title = this.newIssueTitle;
    issue.Description = this.newIssueDescription;

    this.contactService.postNewIssueToDb(issue)
      .subscribe(
        async (res: any) => {
          //console.log(res);
          if ((res != null) || (res != undefined)) {
            //const responseData = new Array<AppIssues>(...res);
          }
        },
        (err: any) => {
          //console.log(err);
        }
      );
  }

  async refreshResults() {

  }

}
