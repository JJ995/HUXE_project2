import { Component, OnInit, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Md5 } from 'ts-md5';
import { MovieDBUserResultData } from '../../../general/interfaces/MovieDBUserResultData';
import { AuthService } from '../../services/auth.service';

@Injectable()
class SubmitUserService {
  mutation = gql`
    mutation createMovieDBUserMutation($username: String!, $email: String!, $pw: String!) {
      createMoviedbuser(
        data: {
         status: PUBLISHED,
         username: $username,
         email: $email,
         pw: $pw
        }
      ) {
        id
      }
    }`;

  constructor(private apollo: Apollo) {}

  submitUser(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: this.mutation,
      variables: {
        username: username,
        email: email,
        pw: password
      }
    });
  }
}


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [SubmitUserService]
})
export class RegistrationComponent implements OnInit {
  public username: string = '';
  public email: string = '';
  public password: string = '';
  public passwordRepeat: string = '';
  public passwordError = false;
  public usernameError = false;
  public dbError = false;
  public loginError = false;
  public loading = false;

  constructor(private apollo: Apollo, private submitUserService: SubmitUserService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Check if username is already taken
   */
  checkUsername() {
    this.loading = true;
    this.apollo
    .watchQuery({
      query: gql`
          {
            moviedbusers {
              username
            }
          }
        `,
    })
    .valueChanges.subscribe((result: MovieDBUserResultData) => {
      for (const user of result.data.moviedbusers) {
        this.usernameError = user.username === this.username;
      }
      this.loading = false;
    });
  }

  onSubmit() {
    this.dbError = false;
    this.loginError = false;
    this.loading = true;
    const hashedPassword = Md5.hashStr(this.password).toString();
    this.submitUserService.submitUser(this.username, this.email, hashedPassword).subscribe(() => {
      this.loading = false;
      this.authService.login(this.username, this.password).subscribe(() => {
        this.router.navigate(['app/dashboard']);
      }, () => {
        this.loginError = true;
      }, () => {
        this.loading = false;
      });
    }, (error) => {
      this.dbError = true;
      console.log(error);
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Compare password and password repeat content for equality
   */
  validatePasswords() {
    if (this.password !== '' && this.passwordRepeat !== '') {
      this.passwordError = this.password !== this.passwordRepeat;
    } else {
      this.passwordError = false;
    }
  }
}
