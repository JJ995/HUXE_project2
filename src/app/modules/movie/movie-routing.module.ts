import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { LoggedInComponent } from '../general/components/logged-in/logged-in.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
  component: LoggedInComponent,
  children: [{
    path: '',
    component: MoviesComponent,
  }]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MovieRoutingModule { }
