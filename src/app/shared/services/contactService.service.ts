import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppIssues } from '../models/app-issues.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ContactService {
    //postItDetails: PostItDetails;

    constructor(private http: HttpClient) { }

    postNewIssueToDb(issue: AppIssues) {
        let options: any = {
            //params: {}, 
            observe: 'response'
        }
        return this.http.post(environment.postItAdminRepoURL + environment.issuesTable, issue, options);
    }

}
