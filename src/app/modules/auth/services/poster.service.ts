import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { MovieDBMovieListResultData } from '../../general/interfaces/MovieDBMovieListResultData';

const enum StorageTokens {

}

/**
 * this service manages the user session.
 */
@Injectable({
  providedIn: 'root'
})
export class PosterService {

  constructor(private httpClient: HttpClient, private apollo: Apollo) {

  }


  /**
   * takes the user name and loads movie ids from database
   * @param username the username
   */
  GetMovieList(username: string): Observable<void> {
    return new Observable<void>(obs => {
      this.apollo
      .watchQuery({
        query: gql`
          {
            moviedbmovielists {
              username,
              movieid,
              posterurl
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe((result: MovieDBMovieListResultData) => {
        for (const movies of result.data.moviedbmovielist) {
          result.data.moviedbmovielist.values();
        }
        obs.complete();
      });
    });
  }

}
