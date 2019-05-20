import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public error: Error = null;
  public loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.username && this.password) {
      this.loading = true;
      this.error = null;
      this.authService.login(this.username, this.password).subscribe(() => {
        this.router.navigate(['app/dashboard']);
      }, error => {
        this.error = error;
      }, () => {
        this.loading = false;
      });
    }
  }

}
