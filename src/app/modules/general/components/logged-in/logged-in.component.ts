import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  public loggedInUsername: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loggedInUsername = this.authService.getLoggedInUserName();
  }
}
