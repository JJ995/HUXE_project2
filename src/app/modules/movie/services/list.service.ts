import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { shareReplay } from 'rxjs/operators';

export const GET_MOVIE_LIST_QUERY = gql`
          {
            moviedbmovielists {
              id,
              username,
              movieId,
              title,
              posterPath,
              releaseDate
            }
          }
        `;

/**
 * this service retrieves the user movie list
 */
@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private httpClient: HttpClient, private apollo: Apollo) {
  }

  /**
   * Loads all movies from the movie list database
   */
  getMovieList() {
    return this.apollo
      .watchQuery({
        query: GET_MOVIE_LIST_QUERY,
        fetchPolicy: 'no-cache'
      })
      .valueChanges
      .pipe(shareReplay(1));
  }
}
