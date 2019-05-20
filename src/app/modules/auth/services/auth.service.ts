import { Injectable } from '@angular/core';
import { Observable, of, Subject, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mapTo, tap } from 'rxjs/operators';

const enum StorageTokens {
  isLoggedIn = 'auth-service.is-logged-in',
}

/**
 * this service manages the user session.
 * It is just a mock service that can be extended.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * the variable that keeps the mocked login state
   */
  private loggedIn = false;

  /**
   * used to create a observable for external listeners.
   * It emits the current log in state.
   */
  private authStateChangeSubject$ = new Subject<boolean>();

  public authStateChange = this.authStateChangeSubject$.asObservable();

  constructor(private httpClient: HttpClient) {
    /**
     * used to update the stored login state of the user within the local storage.
     */
    this.authStateChange.subscribe(isLoggedIn => {
      localStorage.setItem(StorageTokens.isLoggedIn, JSON.stringify(isLoggedIn));
    });
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
   * takes the user credentials and logs in the user.
   * throws an error when the login fails.
   *
   * currently this function only mocks a login.
   *
   * @param username the username
   * @param password the password
   */
  login(username: string, password: string): Observable<void> {
    return timer(500 + Math.random() * 1000)
      .pipe(
        mapTo(null),
        tap(() => this.loggedIn = true),
        tap(() => this.authStateChangeSubject$.next(this.loggedIn))
      );
  }

  /**
   * logs out the current user.
   *
   * currently this function only uses the mocked loggedIn flag.
   */
  logout(): Observable<void> {
    return of(null)
      .pipe(
        tap(() => this.loggedIn = false),
        tap(() => this.authStateChangeSubject$.next(this.loggedIn))
      );
  }
}
