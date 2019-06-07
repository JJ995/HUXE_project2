import { Component, Injectable, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MovieDBMoviesResultData } from '../../../general/interfaces/MovieDBMoviesResultData';
import { MovieDBMovie } from '../../../general/interfaces/MovieDBMovie';
import { ListService } from '../../services/list.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MovieDBListMovie } from '../../../general/interfaces/MovieDBListMovie';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { NotificationService } from '../../../general/services/notification.service';
import { pluck } from 'rxjs/operators';
import { MovieDBMovieListResultData } from '../../../general/interfaces/MovieDBMovieListResultData';

@Injectable()
export class MutateMovieListService {
  constructor(private apollo: Apollo) {}

  /**
   * Add movie to movie list database
   * @param username
   * @param movieId
   * @param title
   * @param releaseDate
   * @param posterPath
   */
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

  /**
   * Remove movie from movie list database
   * @param id
   */
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
  public searchActive: boolean;

  public movies: MovieDBMovie[];
  public movieList: MovieDBListMovie[];

  constructor(private movieService: MovieService,
              private mutateMovieListService: MutateMovieListService,
              private listService: ListService,
              private authService: AuthService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.fetchMovieList();
  }

  /**
   * Get movie list from database and filter movies for current user
   */
  fetchMovieList() {
    this.loadingList = true;
    this.movieList = [];

    // Get movie list from database
    const source$ = this.listService.getMovieList();
    const username = this.authService.getLoggedInUserName();

    source$.pipe(pluck('data')).subscribe((result: MovieDBMovieListResultData) => {
      for (const movie of result.moviedbmovielists) {
        if (movie.username === username) {
          this.movieList.push(movie);
        }
      }
    });
    source$.pipe(pluck('loading')).subscribe(() => {
      this.loadingList = false;
    });
    source$.pipe(pluck('errors')).subscribe((error) => {
      if (error) {
        this.notificationService.showError('Something went wrong while fetching your movie list.', 'Error');
        console.error(error);
      }
    });
  }

  /**
   * Get movies for given query
   */
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

  /**
   * Return to favorites list
   */
  backToList() {
    this.searchQuery = '';
    this.searchActive = false;
    this.fetchMovieList();
  }

  /**
   * Add given movie to list of favorites
   * @param movieId
   * @param title
   * @param releaseDate
   * @param posterPath
   */
  addToMyList(movieId: number, title: string, releaseDate: string, posterPath: string) {
    // Check if movie is already in list
    if (this.movieList.filter(movie => movie.movieId === movieId).length === 0) {
      this.mutateMovieListService.addMovie(this.authService.getLoggedInUserName(), movieId, title, releaseDate, posterPath)
      .subscribe(() => {
        this.notificationService.showSuccess(title + ' was added to your list.', 'Movie added');
      }, (error) => {
        this.notificationService.showError('Something went wrong while adding your movie.', 'Error');
        console.error(error);
      }, () => {
        this.loading = false;
      });
    } else {
      this.notificationService.showError('This movie is already in your list.', 'Already added');
    }
  }

  /**
   * Remove given movie from list of favorites
   * @param id
   * @param title
   */
  removeFromMyList(id: string, title: string) {
    this.mutateMovieListService.removeMovie(id).subscribe(() => {
      this.notificationService.showSuccess(title + ' was removed from your list.', 'Movie removed');
      this.fetchMovieList();
    }, (error) => {
      this.notificationService.showError('Something went wrong while removing your movie.', 'Error');
      console.error(error);
    }, () => {
      this.loading = false;
    });
  }
}
