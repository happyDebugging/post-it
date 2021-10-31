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

              postItDetails.push(resObj);
              this.posts.push(resObj);
            }

            //console.log(this.posts);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  onClearLog(postItDetails: PostItDetails) {
    this.posts = [];
  }

  ngOnDestroy() {
    if (this.getPosts && !this.getPosts.closed) {
      this.getPosts.unsubscribe();
    }
  }

}
