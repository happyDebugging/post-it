import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Visitors } from './shared/models/visitor-details.model';
import { VisitorsService } from './shared/services/visitors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'post-it';

  dateFormat?: any;
  currentDateTime?: any;
  sessionPeriod?: any;
  visitorDetails: Visitors = {};
  firstLoad=false;

  constructor(private visitorsService: VisitorsService) { }

  ngOnInit() {
    // this.dateFormat = require('dateformat');
    // this.currentDateTime = new Date();
    // this.dateFormat(this.currentDateTime, "dd/mm/yy, hh:MM:ss");

    this.firstLoad=true;
    this.getVisitorDetails();
  }

  getVisitorDetails() {
    this.visitorsService.getIpAddress().subscribe((res: any) => {
      this.visitorDetails.ip = res.ip;

      this.visitorsService.getGEOLocation(this.visitorDetails.ip).subscribe((res: any) => {
        this.visitorDetails.City = res.city;

        if (this.firstLoad) {
          this.OnSaveVisitorDetails();
          this.firstLoad=false;
        }
      })
    });
  }

  OnSaveVisitorDetails() {
    this.visitorsService.saveVisitorDetails(this.visitorDetails)
      .subscribe(
        (res: any) => {
          //console.log(res);
          if ((res != null) || (res != undefined)) {

          }
        },
        (err: any) => {
          //console.log(err);
        }
      );
  }

  // ngOnDestroy() {
  //   let endOfSession = new Date();
  //   this.sessionPeriod = this.dateFormat.diff(this.dateFormat(endOfSession, "dd/mm/yy, hh:MM:ss")).format("HH:mm:ss");
  //   console.log(this.sessionPeriod)
  // }

}
