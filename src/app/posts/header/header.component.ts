import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Jobs } from '../../shared/models/jobs.model';
import { PostItDetails } from '../../shared/models/post-it-details.model';
import { WorkingPlaces } from '../../shared/models/working-places.model';
import { DbFunctionService } from '../../shared/services/db-functions.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { VisitorsService } from '../../shared/services/visitors.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { DialogueComponent } from './dialogue/dialogue.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('occurredAt') occurredAt: any;

  jobSearchTypes: string[] = ['Αναζητώ Εργασία', 'Αναζητώ Εργαζόμενο'];
  jobNamesList: Jobs[] = [];
  workingPlacesList: WorkingPlaces[] = [];

  userName: string = '';
  userPhone: string = '';
  userEmail: string = '';
  userPost: string = '';
  jobName: string = '';
  jobSearchType: string = '';
  place: string = '';

  jobType: string = "";
  job: string = "";

  newPost: Subscription = new Subscription;
  ipAddress: string = '';

  filteredJobTypes?: any;
  filteredWorkingPlaces?: any;

  isLoadingResults: boolean = false;

  constructor(public dialog: MatDialog, private dbFunctionService: DbFunctionService, private visitorsService: VisitorsService,
    private successfulPostCreationNotification: MatSnackBar) { }

  ngOnInit(): void {
    this.OnFetchJobNamesFromDb();
    this.OnFetchWorkingPlacesFromDb();

    this.filteredJobTypes = this.jobNamesList;
    this.filteredWorkingPlaces = this.workingPlacesList;
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.occurredAt, {
      width: '50rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('');
    });
  }

  // onSubmit(form: NgForm, event: any) {

  // }

  applyJobFilter(evt: string) {
    evt = evt + '';
    if (!evt) this.filteredJobTypes = this.jobNamesList;
    else {
      /** uses both id and text fields for extensive filtering (case insensitive) . can be tailored for custom needs */
      this.filteredJobTypes = this.jobNamesList.filter(
        (item) =>
          item.Id + '' === evt ||
          item.JobName.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0
      );
    }
  }

  applyPlacesFilter(evt: string) {
    evt = evt + '';
    if (!evt) this.filteredWorkingPlaces = this.workingPlacesList;
    else {
      /** uses both id and text fields for extensive filtering (case insensitive) . can be tailored for custom needs */
      this.filteredWorkingPlaces = this.workingPlacesList.filter(
        (itemm) =>
          itemm.Id + '' === evt ||
          itemm.Place.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0
      );
    }
  }

  // public valueMapper = (key: any) => {
  //   let selection = this.jobNamesList.find((e) => {
  //     return e.id == key;
  //   });
  //   if (selection) {
  //     return selection.text;
  //   }
  //   return;
  // };

  OnFetchJobNamesFromDb() {
    this.dbFunctionService.getJobsListFromAdminDb()
      .pipe(map((response: any) => {
        const jobsArray: Jobs[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            jobsArray.push({ ...response[key], id: key })
          }
        }
        return jobsArray;
      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            //console.log(res)
            const responseData = new Array<Jobs>(...res);

            for (const data of responseData) {
              const resObj = new Jobs();

              resObj.Id = data.Id;
              resObj.Category = data.Category;
              resObj.JobName = data.JobName;

              this.jobNamesList.push(resObj);

            }
            //console.log(this.posts);
          }
          this.isLoadingResults = false;
        },
        err => {
          //console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  OnFetchWorkingPlacesFromDb() {
    this.dbFunctionService.getWorkingPlacesListFromAdminDb()
      .pipe(map((response: any) => {
        const placesArray: WorkingPlaces[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            placesArray.push({ ...response[key], id: key })
          }
        }
        return placesArray;
      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            //console.log(res)
            const responseData = new Array<WorkingPlaces>(...res);

            for (const data of responseData) {
              const resObj = new WorkingPlaces();

              resObj.Id = data.Id;
              resObj.Place = data.Place;

              this.workingPlacesList.push(resObj);

            }
            //console.log(this.posts);
          }
          this.isLoadingResults = false;
        },
        err => {
          //console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  onClearFilters() {
    this.jobType = '';
    this.job = '';
    this.place = '';
  }

  prepareDetailsToPost() {
    this.getipAddress();
    this.OnPostNewPostToDb();
  }

  OnPostNewPostToDb() {
    let postItDetails = new PostItDetails;

    postItDetails.UserName = this.userName;
    postItDetails.Phone = this.userPhone;
    postItDetails.Email = this.userEmail;
    postItDetails.Notes = this.userPost;
    postItDetails.JobName = this.jobName;
    postItDetails.JobSearchType = this.jobSearchType;
    postItDetails.Place = this.place;
    postItDetails.Ip = this.ipAddress;

    //console.log(postItDetails);

    this.newPost = this.dbFunctionService.postNewPostToDb(postItDetails)
      // .pipe(
      //   catchError((error) => {
      //     this.isLoading = false;
      //     return of('Συνέβη κάποιο σφάλμα. Προσπαθήστε ξανά.');
      //   })
      //)
      .subscribe(
        (res: any) => {
          //console.log(res);
          if ((res != null) || (res != undefined)) {
            //const responseData = new Array<PostItDetails>(...res);
            const success = true;
            this.openSuccessPostSnackBar(success);

            this.onClearLog(postItDetails);
            this.reloadCurrentPage();
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  getipAddress() {
    this.visitorsService.getIpAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      // this.OnPostNewPostToDb();
    });
  }

  openSuccessPostSnackBar(success: boolean) {
    let message = '';
    let action = '';
    if (success) {
      message = 'Επιτυχής ανάρτηση αγγελίας!';
      action = 'OK';
    }
    else {
      message = 'Πρόβλημα ανάρτησης. Προσπαθήστε ξανά.';
      action = 'OK';
    }

    this.successfulPostCreationNotification.open(message, action);
  }

  onClearLog(postItDetails: PostItDetails) {
    this.userName = '',
      this.userPhone = '',
      this.userEmail = '',
      this.userPost = '',
      this.jobName = '',
      this.jobSearchType = '',
      this.place = ''
  }

  ngOnDestroy() {
    if (this.newPost && !this.newPost.closed) {
      this.newPost.unsubscribe();
    }
  }


}
