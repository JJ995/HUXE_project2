import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public username: string = '';
  public email: string = '';
  public password: string = '';
  public passwordRepeat: string = '';
  public error: Error = null;
  public loading = false;

  constructor() { }

  ngOnInit() {
  }

  clearErrorMessages() {

  }
}
