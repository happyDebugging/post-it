import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostItDetails } from '../shared/models/post-it-details.model';
import { DbFunctionService } from '../shared/services/db-functions.service';
// import { DialogueComponent } from './dialogue/dialogue.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('occurredAt') occurredAt: any;

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

  userName: string = '';
  userPhone: string = '';
  userEmail: string = '';
  userPost: string = '';
  jobName: string = '';
  jobSearchType: string = '';
  place: string = '';

  newPost: Subscription = new Subscription;

  constructor(public dialog: MatDialog, private dbFunctionService: DbFunctionService) { }

  ngOnInit(): void {

  }

  openDialog() {
    const dialogRef = this.dialog.open(this.occurredAt, {
      width: '50rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('');
    });
  }

  // onSubmit(form: NgForm, event: any) {

  // }

  OnPostNewPostToDb() {
    let postItDetails = new PostItDetails;

    postItDetails.UserName = this.userName;
    postItDetails.Phone = this.userPhone;
    postItDetails.Email = this.userEmail;
    postItDetails.Notes = this.userPost;
    postItDetails.JobName = this.jobName;
    postItDetails.JobSearchType = this.jobSearchType;
    postItDetails.Place = this.place;

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
          console.log(res);
          if ((res != null) || (res != undefined)) {
            const responseData = new Array<PostItDetails>(...res);

            this.onClearLog(postItDetails);

            this.reloadCurrentPage();
          }
        },
        err => {
          console.log(err);
        }
      );

  }

  reloadCurrentPage() {
    window.location.reload();
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
