import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {path: 'posts', component: PostsComponent, pathMatch: 'full'},
  {path: 'posts',  component: PostsComponent}, 
  {path: 'contact',  component: ContactComponent}, 
  {path: '', pathMatch: 'full', redirectTo: 'posts'},
  {path: '**', redirectTo: 'posts', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
