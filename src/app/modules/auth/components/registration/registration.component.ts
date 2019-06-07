import { Component, OnInit, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Md5 } from 'ts-md5';
import { MovieDBUserResultData } from '../../../general/interfaces/MovieDBUserResultData';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../general/services/notification.service';

@Injectable()
export class SubmitUserService {
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
  public loading = false;

  constructor(private apollo: Apollo,
              private submitUserService: SubmitUserService,
              private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService) { }

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
        if (this.usernameError) {
          break;
        }
      }
      this.loading = false;
    });
  }

  onSubmit() {
    this.loading = true;
    const hashedPassword = Md5.hashStr(this.password).toString();
    this.submitUserService.submitUser(this.username, this.email, hashedPassword).subscribe(() => {
      this.loading = false;
      this.authService.login(this.username, this.password).subscribe(() => {
        this.router.navigate(['app/movies']);
      }, (error) => {
        this.notificationService.showError('Something went wrong during login.', 'Error');
        console.error(error);
      }, () => {
        this.loading = false;
      });
    }, (error) => {
      this.notificationService.showError('Something went wrong when creating your user.', 'Error');
      console.error(error);
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
