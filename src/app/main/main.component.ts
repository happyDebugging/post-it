import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostItDetails } from '../shared/models/post-it-details.model';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  posts: PostItDetails[] = [];

  jobSearchTypes: string[] = ['Αναζητώ Εργασία', 'Αναζητώ Εργαζόμενο'];
  jobTypesList: string[] = ['Νοσηλευτής', 'Καθαρισμός χώρου', 'Ιατρός', 'Υδραυλικός', 'Φύλαξη ηλικιωμένων', 'Εστίαση', 'Πληροφορική'];
  workingPlaces: string[] = ['Αθήνα',
    'Θεσσαλονίκη',
    'Πάτρα',
    'Ηράκλειο',
    'Λάρισα',
    'Βόλος',
    'Ιωάννινα',
    'Τρίκαλα',
    'Χαλκίδα',
    'Σέρρες',
    'Αλεξανδρούπολη',
    'Ξάνθη',
    'Κατερίνη',
    'Αγρίνιο',
    'Καλαμάτα',
    'Καβάλα',
    'Χανιά',
    'Λαμία',
    'Κομοτηνή',
    'Ρόδος',
    'Δράμα',
    'Βέροια',
    'Κοζάνη',
    'Καρδίτσα',
    'Ρέθυμνο',
    'Πτολεμαΐδα',
    'Τρίπολη',
    'Κόρινθος',
    'Γέρακας',
    'Γιαννιτσά',
    'Μυτιλήνη',
    'Χίος',
    'Σαλαμίνα',
    'Ελευσίνα',
    'Κέρκυρα',
    'Πύργος',
    'Μέγαρα',
    'Κιλκίς',
    'Θήβα',
    'Άργος',
    'Άρτα',
    'Άρτεμη (Λούτσα)',
    'Λιβαδειά',
    'Ωραιόκαστρο',
    'Αίγιο',
    'Κως',
    'Κορωπί',
    'Πρέβεζα',
    'Σπάρτη',
    'Νάουσα',
    'Ορεστιάδα',
    'Περαία',
    'Έδεσσα',
    'Φλώρινα',
    'Αμαλιάδα',
    'Παλλήνη',
    'Θέρμη',
    'Βάρη',
    'Νέα Μάκρη',
    'Αλεξάνδρεια',
    'Παιανία',
    'Καλύβια Θορικού',
    'Ναύπλιο',
    'Ναύπακτος',
    'Καστοριά',
    'Γρεβενά',
    'Μεσολόγγι',
    'Γάζι',
    'Ιεράπετρα',
    'Κάλυμνος (Πόθια)',
    'Ραφήνα',
    'Λουτράκι',
    'Άγιος Νικόλαος',
    'Ερμούπολη',
    'Ιαλυσός',
    'Μάνδρα',
    'Τύρναβος',
    'Γλυκά Νερά'
  ];

  jobType: string = "";
  job: string = "";
  place: string = "";

  flagJobType: boolean = false;
  flagJob: boolean = false;
  flagPlace: boolean = false;

  getPosts: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit(): void {
    this.onGetPosts();
  }

  onGetPosts() {
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

              console.log(this.jobType, this.job, this.place)

              if (resObj.JobSearchType == this.jobType)
                this.flagJobType = true;

              if (resObj.JobName == this.job)
                this.flagJob = true;

              if (resObj.Place == this.place)
                this.flagPlace = true;


              if (this.jobType == '' && this.job == '' && this.place == '') {
                if (!this.flagJobType && !this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              else if (this.jobType == '' && this.job == '') {
                if (!this.flagJobType && !this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              if (this.jobType == '' && this.place == '') {
                if (!this.flagJobType && this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              if (this.job == '' && this.place == '') {
                if (this.flagJobType && !this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              else if (this.jobType == '') {
                if (!this.flagJobType && this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              else if (this.job == '') {
                if (this.flagJobType && !this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              else if (this.place == '') {
                if (this.flagJobType && this.flagJob && !this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }
              else {
                if (this.flagJobType && this.flagJob && this.flagPlace) {
                  postItDetails.push(resObj);
                  this.posts.push(resObj);

                  this.flagJobType = false;
                  this.flagJob = false;
                  this.flagPlace = false;
                }
              }

              if (resObj.JobSearchType == 'Αναζητώ Εργασία') {
                resObj.Color = 'lime lighten-4';
              }
              else {
                resObj.Color = 'light-green lighten-4';
              }

            }
            //console.log(this.posts);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  async refreshResults() {
    await this.onClearLog();
    await this.onGetPosts();
  }

  onClearLog() {
    this.posts = [];
  }

  ngOnDestroy() {
    if (this.getPosts && !this.getPosts.closed) {
      this.getPosts.unsubscribe();
    }
  }

}
