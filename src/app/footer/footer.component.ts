import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @ViewChild('terms') terms: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openTermsDialog() {
    const dialogRef = this.dialog.open(this.terms, {
      width: '40rem', height: '90%'
    });
  }

}
