import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VisitorsService } from './shared/services/visitors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'post-it';

  ipaddress:string = '';
   constructor(
      private visitorsService:VisitorsService, private http: HttpClient
   ){

   }

   ngOnInit(){

     this.getIpAddress();
   }

getIpAddress() {
  // this.visitorsService.getIpAddress().subscribe((res:any )=> {

  //   this.ipaddress = res['ip'];
  //   console.log(res);

  // });
  this.http.get('http://api.ipify.org/?format=json;').subscribe((res:any) => {

  });
}
   


}
