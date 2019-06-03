import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MovieDBMoviesResultData } from '../../../general/interfaces/MovieDBMoviesResultData';
import { MovieDBMovie } from '../../../general/interfaces/MovieDBMovie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  public searchQuery: string = '';
  public loading: boolean = false;
  public error: string = '';

  public movies: [MovieDBMovie];

  constructor(private movieService: MovieService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    this.movieService.getMovies(this.searchQuery, 1)
    .subscribe((data: MovieDBMoviesResultData) => {
      this.movies = data.results;
      console.log(this.movies);
    }, error => {
      this.error = error;
    }, () => {
      this.loading = false;
    });
  }
}
