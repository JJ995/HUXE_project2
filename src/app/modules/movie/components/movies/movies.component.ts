import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MovieDBMoviesResultData } from '../../../general/interfaces/MovieDBMoviesResultData';
import { MovieDBMovie } from '../../../general/interfaces/MovieDBMovie';
import { ListService } from '../../services/list.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MovieDBListMovie } from '../../../general/interfaces/MovieDBListMovie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  public searchQuery: string = '';
  public loading: boolean = false;
  public loadingList: boolean = false;
  public error: string = '';
  public listError: boolean;
  public searchActive: boolean;

  public movies: MovieDBMovie[];
  public movieList: MovieDBListMovie[];

  constructor(private movieService: MovieService, private listService: ListService, private authService: AuthService) { }

  ngOnInit() {
    this.listError = false;
    this.loadingList = true;
    this.listService.createMovieList(this.authService.getLoggedInUserName()).subscribe(() => {
      this.movieList = this.listService.getMovieList();
      this.loadingList = false;
    }, () => {
      this.listError = true;
    }, () => {
      this.loadingList = false;
    });
  }

  onSubmit() {
    if (this.searchQuery.trim().length) {
      this.searchActive = true;
      this.loading = true;
      this.movieService.getMovies(this.searchQuery, 1)
      .subscribe((data: MovieDBMoviesResultData) => {
        this.movies = data.results;
      }, error => {
        this.error = error;
      }, () => {
        this.loading = false;
      });
    }
  }

  backToList() {
    this.searchQuery = '';
    this.searchActive = false;
  }
}
