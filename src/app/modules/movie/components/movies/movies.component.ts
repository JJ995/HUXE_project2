import { Component, Injectable, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MovieDBMoviesResultData } from '../../../general/interfaces/MovieDBMoviesResultData';
import { MovieDBMovie } from '../../../general/interfaces/MovieDBMovie';
import { ListService } from '../../services/list.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MovieDBListMovie } from '../../../general/interfaces/MovieDBListMovie';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Injectable()
class MutateMovieListService {
  constructor(private apollo: Apollo) {}

  addMovie(username: string, movieId: number, title: string, releaseDate: string, posterPath: string) {
    // tslint:disable-next-line:max-line-length
    const mutation = gql`mutation createMovieDBMovielistMutation($username: String!, $movieId: Int!, $title: String!, $releaseDate: String!, $posterPath: String!) {
      createMoviedbmovielist(
        data: {
         status: PUBLISHED,
         username: $username,
         movieId: $movieId,
         title: $title,
         releaseDate: $releaseDate,
         posterPath: $posterPath,
        }
      ) {
        id
      }
    }`;

    return this.apollo.mutate({
      mutation: mutation,
      variables: {
        username: username,
        movieId: movieId,
        title: title,
        releaseDate: releaseDate,
        posterPath: posterPath
      }
    });
  }

  removeMovie(id: string) {
    const mutation = gql`mutation deleteMovieDBMovielistMutation($id: ID!) {
      deleteMoviedbmovielist(
        where: {
         id: $id
        }
      ) {
        id
      }
    }`;

    return this.apollo.mutate({
      mutation: mutation,
      variables: {
        id: id
      }
    });
  }
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  providers: [MutateMovieListService]
})
export class MoviesComponent implements OnInit {

  public searchQuery: string = '';
  public loading: boolean = false;
  public loadingList: boolean = false;
  public error: string = '';
  public listError: boolean;
  public searchActive: boolean;
  public addMovieDBSuccess: boolean;
  public addMovieDBError: boolean;
  public removeMovieDBError: boolean;

  public movies: MovieDBMovie[];
  public movieList: MovieDBListMovie[];

  constructor(private movieService: MovieService,
              private mutateMovieListService: MutateMovieListService,
              private listService: ListService,
              private authService: AuthService) { }

  ngOnInit() {
    this.fetchMovieList();
  }

  fetchMovieList() {
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
    this.fetchMovieList();
  }

  addToMyList(movieId: number, title: string, releaseDate: string, posterPath: string) {
    // Check if movie is already in list
    if (this.movieList.filter(movie => movie.movieId === movieId).length === 0) {
      this.addMovieDBError = false;
      this.addMovieDBSuccess = false;
      this.mutateMovieListService.addMovie(this.authService.getLoggedInUserName(), movieId, title, releaseDate, posterPath)
      .subscribe(() => {
        this.addMovieDBSuccess = true;
      }, (error) => {
        console.error(error);
        // TODO: output
        this.addMovieDBError = true;
      }, () => {
        this.loading = false;
      });
    } else {
      // Movie already added
    }
  }

  removeFromMyList(id: string) {
    this.removeMovieDBError = false;
    this.mutateMovieListService.removeMovie(id).subscribe(() => {
      this.addMovieDBSuccess = true;
      this.fetchMovieList();
    }, (error) => {
      console.error(error);
      // TODO: output
      this.addMovieDBError = true;
    }, () => {
      this.loading = false;
    });
  }
}
