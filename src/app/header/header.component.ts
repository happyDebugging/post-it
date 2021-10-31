import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DialogueComponent } from './dialogue/dialogue.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('occurredAt') occurredAt:any;

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(){
    const dialogRef = this.dialog.open(this.occurredAt, {
      width: '50rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
