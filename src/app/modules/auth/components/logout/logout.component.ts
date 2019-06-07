import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../general/services/notification.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    }, (error) => {
      this.notificationService.showError('Something went wrong during logout.', 'Error');
      console.error(error);
    });
  }

}
