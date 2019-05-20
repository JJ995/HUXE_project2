import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieRoutingModule } from './movie-routing.module';
import { GeneralModule } from '../general/general.module';

@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    GeneralModule,
    MovieRoutingModule
  ]
})
export class MovieModule { }
