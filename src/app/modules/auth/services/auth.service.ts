import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Md5} from 'ts-md5/dist/md5';
import { MovieDBUserResultData } from '../../general/interfaces/MovieDBUserResultData';

const enum StorageTokens {
  isLoggedIn = 'auth-service.is-logged-in',
  loggedInUsername = 'auth-service.logged-in-username'
}

/**
 * this service manages the user session.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * the variable that keeps the login state
   */
  private loggedIn = false;

  /**
   * used to create a observable for external listeners.
   * It emits the current log in state.
   */
  private authStateChangeSubject$ = new Subject<boolean>();

  public authStateChange = this.authStateChangeSubject$.asObservable();

  constructor(private httpClient: HttpClient, private apollo: Apollo) {
    /**
     * used to update the stored login state of the user within the local storage.
     */
    this.authStateChange.subscribe(isLoggedIn => {
      localStorage.setItem(StorageTokens.isLoggedIn, JSON.stringify(isLoggedIn));
    });
  }

  /**
   * returns the name of the currently logged in user
   */
  getLoggedInUserName(): string {
    return localStorage.getItem(StorageTokens.loggedInUsername);
  }

  /**
   * this method is called on the angular startup.
   * It loads the last session state from the local storage.
   */
  initializeAuthState() {
    return new Promise((resolve, reject) => {
      this.loggedIn = localStorage.getItem(StorageTokens.isLoggedIn) === 'true';
      resolve();
    });
  }

  /**
   * returns if the user is logged in as an observable.
   * true means the user is logged in.
   * false means the user is logged out.
   */
  isLoggedIn(): Observable<boolean> {
    return of(this.loggedIn);
  }

  /**
   * takes the user credentials and compares them with the stored credentials in the database
   * @param username the username
   * @param password the password
   */
  login(username: string, password: string): Observable<void> {
    return new Observable<void>(obs => {
      this.apollo
      .watchQuery({
        query: gql`
          {
            moviedbusers {
              username,
              pw
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe((result: MovieDBUserResultData) => {
        for (const user of result.data.moviedbusers) {
          // Compare username and password
          if (user.username === username && user.pw === Md5.hashStr(password)) {
            this.loggedIn = true;
            localStorage.setItem(StorageTokens.loggedInUsername, username);
            this.authStateChangeSubject$.next(this.loggedIn);
            obs.next();
          }
        }
        obs.complete();
      });
    });
  }

  /**
   * logs out the current user.
   */
  logout(): Observable<void> {
    return of(null)
      .pipe(
        tap(() => this.loggedIn = false),
        tap(() => localStorage.setItem(StorageTokens.loggedInUsername, '')),
        tap(() => this.authStateChangeSubject$.next(this.loggedIn))
      );
  }
}
