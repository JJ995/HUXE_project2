import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './modules/general/components/not-found/not-found.component';

/**
 * the basic app routes.
 * the Movies feature module will be lazily loaded.
 * if the users enters the root of the page the app redirects to /login
 */
const routes: Routes = [{
  path: 'app/movies',
  loadChildren: './modules/movie/movie.module#MovieModule',
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: '/login',
}, {
  path: '**',
  component: NotFoundComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
