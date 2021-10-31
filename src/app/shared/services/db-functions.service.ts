import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostItDetails } from '../models/post-it-details.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class DbFunctionService {
    //postItDetails: PostItDetails;

    constructor(private http: HttpClient) { }

    getPostsFromDb() {
        // let options: any = {
        //     //params: {BoardId: boardId, SerialNumber: serialNumber}, 
        //     observe: 'response'
        // }
        return this.http.get<PostItDetails>(environment.postItRepoURL);
    }

    postNewPostToDb(postItDetails: PostItDetails) {
        let options: any = {
            //params: {BoardId: boardId, SerialNumber: serialNumber, EventTypeId: eventTypeId, MONumber: moNumber}, 
            observe: 'response'
        }
        return this.http.post(environment.postItRepoURL, postItDetails, options);
    }

}
