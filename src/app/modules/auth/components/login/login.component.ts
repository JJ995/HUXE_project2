import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../general/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public error: Error = null;
  public loading: boolean = false;
  public authError: boolean = false;
  public loginHover: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
  }

  onSubmit() {
    if (this.username && this.password) {
      this.loading = true;
      this.error = null;
      this.authService.login(this.username, this.password).subscribe(() => {
        this.router.navigate(['app/movies']);
      }, error => {
        this.notificationService.showError('Something went wrong during login.', 'Error');
        console.error(error);
        this.authError = false;
      }, () => {
        this.loading = false;
        this.authError = true;
      });
    }
  }

  clearErrorMessages() {
   this.error = null;
   this.authError = false;
  }
}
