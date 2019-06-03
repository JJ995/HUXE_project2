import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { MovieDBMovieListResultData } from '../../general/interfaces/MovieDBMovieListResultData';
import { MovieDBListMovie } from '../../general/interfaces/MovieDBListMovie';

/**
 * this service retrieves the user movie list
 */
@Injectable({
  providedIn: 'root'
})
export class ListService {

  private movieList: MovieDBListMovie[] = [];

  constructor(private httpClient: HttpClient, private apollo: Apollo) {
  }

  getMovieList(): MovieDBListMovie[] {
    return this.movieList;
  }

  /**
   * takes the user name and loads movie ids from database
   * @param username the username
   */
  createMovieList(username: string): Observable<void> {
    this.movieList = [];
    return new Observable<void>(obs => {
      this.apollo
      .watchQuery({
        query: gql`
          {
            moviedbmovielists {
              username,
              posterurl,
              movieyear,
              moviename
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe((result: MovieDBMovieListResultData) => {
        for (const movie of result.data.moviedbmovielists) {
          if (movie.username === username) {
            this.movieList.push(movie);
          }
        }
        obs.next();
      });
    });
  }
}
