import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { PostsComponent } from './posts/posts.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthResolver } from './shared/guards/auth.resolver';

const routes: Routes = [
  {path: 'posts', resolve: { AuthResolver }, component: PostsComponent, pathMatch: 'full'},
  {path: 'posts',  component: PostsComponent}, 
  {path: 'contact',  component: ContactComponent}, 
  {path: '', pathMatch: 'full', redirectTo: 'posts'},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
