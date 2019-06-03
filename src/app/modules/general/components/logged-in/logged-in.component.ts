import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { PosterService } from '../../../auth/services/poster.service'

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  public loggedInUsername: string;

  constructor(private authService: AuthService, private posterService: PosterService) { }

  ngOnInit() {
    this.loggedInUsername = this.authService.getLoggedInUserName();
    this.posterService.GetMovieList(this.loggedInUsername).subscribe();
  }
}
