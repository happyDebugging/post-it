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
      private visitorsService:VisitorsService
   ){

   }

   ngOnInit(){

      // this.visitorsService.getIpAddress().subscribe((res:any )=> {

      //   this.ipaddress = res['ip'];
      //   //console.log(res);

      // });
   }

}
