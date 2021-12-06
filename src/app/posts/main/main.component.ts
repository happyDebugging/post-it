import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostItDetails } from '../../shared/models/post-it-details.model';
import { DbFunctionService } from '../../shared/services/db-functions.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Jobs } from '../../shared/models/jobs.model';
import { WorkingPlaces } from '../../shared/models/working-places.model';
import { MatDialog } from '@angular/material/dialog';
import { VisitorsService } from 'src/app/shared/services/visitors.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('occurredAt') occurredAt: any;
  screenWidth?: any;

  userName: string = '';
  userPhone: string = '';
  userEmail: string = '';
  userPost: string = '';
  jobName: string = '';
  jobSearchType: string = '';
  placeName: string = '';

  newPost: Subscription = new Subscription;
  ipAddress: string = '';

  posts: PostItDetails[] = [];

  jobSearchTypes: string[] = ['Αναζητώ Εργασία', 'Αναζητώ Εργαζόμενο'];
  jobNamesList: Jobs[] = [];
  workingPlacesList: WorkingPlaces[] = [];

  jobType: string = '';
  job: string = '';
  place: string = '';

  flagJobType: boolean = false;
  flagJob: boolean = false;
  flagPlace: boolean = false;

  getPosts: Subscription = new Subscription;

  filteredJobTypes?: any;
  filteredWorkingPlaces?: any;

  isLoadingResults: boolean = false;
  panelOpenState: boolean = true;
  isFilterSectionActive: boolean = true;

  dialogRef?: any;

  constructor(private dbFunctionService: DbFunctionService, public dialog: MatDialog, private visitorsService: VisitorsService,
    private successfulPostCreationNotification: MatSnackBar) { }

  ngOnInit(): void {
    this.onGetPosts();
    this.OnFetchJobNamesFromDb();
    this.OnFetchWorkingPlacesFromDb();

    this.filteredJobTypes = this.jobNamesList;
    this.filteredWorkingPlaces = this.workingPlacesList;

    if (this.isFilterSectionActive != null) {
      const filterSectionState = localStorage.getItem('isFilterSectionActive');
      if (filterSectionState === 'true') {
        this.isFilterSectionActive = true;
        this.panelOpenState = true;
      }
      if (filterSectionState === 'false') {
        this.isFilterSectionActive = false;
        this.panelOpenState = false;
      }
      //console.log(this.isFilterSectionActive, this.panelOpenState)
    }
  }

  /////////
  openDialog() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 600) {
      this.dialogRef = this.dialog.open(this.occurredAt, {
        width: '50rem', height: '85%'
      });
    }
    else {
      this.dialogRef = this.dialog.open(this.occurredAt, {
        width: '50rem', height: '95%', maxHeight: '100%', minHeight: '50%', position: { top: `30px` }
      });
    }

    this.dialogRef.afterClosed().subscribe((result: any) => {
      //console.log('');
    });
  }

  prepareDetailsToPost() {
    if (this.jobSearchType == '' || this.jobName == '' || this.placeName == '' || this.userEmail == '' || this.userPost == '') {
      this.openNeededFieldsWarningSnackBar();
    }
    else {
      this.dialogRef.close(); //mat-dialog-close 
      this.getipAddress();
      this.OnPostNewPostToDb();
    }
  }

  OnPostNewPostToDb() {
    let postItDetails = new PostItDetails;

    postItDetails.UserName = this.userName;
    postItDetails.Phone = this.userPhone;
    postItDetails.Email = this.userEmail;
    postItDetails.Notes = this.userPost;
    postItDetails.JobName = this.jobName;
    postItDetails.JobSearchType = this.jobSearchType;
    postItDetails.Place = this.placeName;
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

            this.onClearNewPostModalData(postItDetails);

            //this.reloadCurrentPage();
            this.refreshResults();
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

  openNeededFieldsWarningSnackBar() {
    let message = 'Τα υποχρεωτικά πεδία δεν μπορούν να είναι κενά.';
    let action = 'OK';
    this.successfulPostCreationNotification.open(message, action, {
      duration: 5000
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

    this.successfulPostCreationNotification.open(message, action, {
      duration: 5000
    });
  }

  onClearNewPostModalData(postItDetails: PostItDetails) {
    this.userName = '',
      this.userPhone = '',
      this.userEmail = '',
      this.userPost = '',
      this.jobName = '',
      this.jobSearchType = '',
      this.placeName = ''
  }

  ///////

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

  OnFetchJobNamesFromDb() {
    this.getPosts = this.dbFunctionService.getJobsListFromAdminDb()
      .pipe(map((response: any) => {
        const jobsArray: Jobs[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            jobsArray.push({ ...response[key], id: key })
          }
        }
        return jobsArray.reverse();
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
    this.getPosts = this.dbFunctionService.getWorkingPlacesListFromAdminDb()
      .pipe(map((response: any) => {
        const placesArray: WorkingPlaces[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            placesArray.push({ ...response[key], id: key })
          }
        }
        return placesArray.reverse();
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

  onGetPosts() {
    this.isLoadingResults = true;

    let postItDetails = new Array<PostItDetails>();

    this.getPosts = this.dbFunctionService.getPostsFromDb()
      .pipe(map((response: any) => {
        const postsArray: PostItDetails[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            postsArray.push({ ...response[key], id: key })
          }
        }
        return postsArray;
      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            //console.log(res)
            const responseData = new Array<PostItDetails>(...res);

            for (const data of responseData) {
              const resObj = new PostItDetails();

              resObj.UserName = data.UserName;
              resObj.Phone = data.Phone;
              resObj.Email = data.Email;
              resObj.Notes = data.Notes;
              resObj.JobName = data.JobName;
              resObj.JobSearchType = data.JobSearchType;
              resObj.Place = data.Place;
              if (resObj.JobSearchType == 'Αναζητώ Εργασία')
                resObj.Color = 'lime lighten-4';
              else
                resObj.Color = 'light-green lighten-4';


              //console.log(this.jobType, this.job, this.place)

              if (resObj.JobSearchType == this.jobType)
                this.flagJobType = true;
              else
                this.flagJobType = false;

              if (resObj.JobName == this.job)
                this.flagJob = true;
              else
                this.flagJob = false;

              if (resObj.Place == this.place)
                this.flagPlace = true;
              else
                this.flagPlace = false;

              if (this.jobType == '' && this.job == '' && this.place == '') {
                if (!this.flagJobType && !this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              else if (this.jobType == '' && this.job == '') {
                if (!this.flagJobType && !this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              if (this.jobType == '' && this.place == '') {
                if (!this.flagJobType && this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              if (this.job == '' && this.place == '') {
                if (this.flagJobType && !this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              else if (this.jobType == '') {
                if (!this.flagJobType && this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  // this.flagJob = false;
                  // this.flagPlace = false;
                }
              }
              else if (this.job == '') {
                if (this.flagJobType && !this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              else if (this.place == '') {
                if (this.flagJobType && this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }
              else {
                if (this.flagJobType && this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  //this.flagJobType = false;
                  //this.flagJob = false;
                  //this.flagPlace = false;
                }
              }

            }
            //console.log(this.posts);
          }
          this.posts.reverse();
          this.isLoadingResults = false;
        },
        err => {
          //console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  async refreshResults() {
    await this.onClearLog();
    await this.onGetPosts();
    await this.OnFetchJobNamesFromDb();
    await this.OnFetchWorkingPlacesFromDb();
  }

  onClearFilters() {
    this.jobType = '';
    this.job = '';
    this.place = '';

    this.refreshResults();
  }

  async refreshResultsAfterNewPost() {
    this.posts = [];
    await this.onGetPosts();
  }

  onClearLog() {
    this.posts = [];
    this.jobNamesList = [];
    this.workingPlacesList = [];
  }

  ngOnDestroy() {
    if (this.newPost && !this.newPost.closed) {
      this.newPost.unsubscribe();
    }

    if (this.getPosts && !this.getPosts.closed) {
      this.getPosts.unsubscribe();
    }
  }

  jobCategory: string = '';
  jobbbbb: string = '';
  placeeee: string = '';

  OnPostJobsToDb() {
    let jobs = new Jobs;

    jobs.Id = this.jobNamesList.length + 1;
    jobs.Category = this.jobCategory;
    jobs.JobName = this.jobbbbb;

    //console.log(postItDetails);

    this.dbFunctionService.postJobsToDb(jobs)
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
            const responseData = new Array<Jobs>(...res);
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  OnPostPlacesToDb() {
    let placee = new WorkingPlaces;

    placee.Id = this.workingPlacesList.length + 1;
    placee.Place = this.placeeee;

    //console.log(postItDetails);

    this.dbFunctionService.postPlacesToDb(placee)
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
            const responseData = new Array<WorkingPlaces>(...res);
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  saveFilterAccordionState() {
    this.isFilterSectionActive = !this.isFilterSectionActive;
    this.panelOpenState = !this.panelOpenState;
    sessionStorage.setItem('isFilterSectionActive', JSON.stringify(this.isFilterSectionActive));
    //console.log(this.isFilterSectionActive, this.panelOpenState)
  }

  scrollToTopOfPage(el: HTMLElement): void {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

}
