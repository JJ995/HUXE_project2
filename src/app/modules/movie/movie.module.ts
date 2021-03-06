import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieRoutingModule } from './movie-routing.module';
import { GeneralModule } from '../general/general.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    GeneralModule,
    MovieRoutingModule,
    FormsModule
  ]
})
export class MovieModule { }
