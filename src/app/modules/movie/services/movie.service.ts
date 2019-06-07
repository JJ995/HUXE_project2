import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  serviceUrl = 'https://api.themoviedb.org/3/search/movie';
  apiKey = '0d3e43709b42454584ddfeb258695cfc';

  getMovies(query: string, page: number): Observable<object> {
    query = query.trim();

    const options = query ? { params: new HttpParams()
      .set('query', query)
      .set('api_key', this.apiKey)
      .set('page', page.toString())
    } : {};

    return this.http.get(this.serviceUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError(
      'Something went wrong - please try again later'
    );
  }
}
