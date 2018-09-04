import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  btnDisabled = false;

  constructor(
    private router: Router,
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
  }

  validate() {
    if(this.email) {
      if(this.password) {
        return true
      } else {
        this.data.error("password empty");
      }
    } else {
      this.data.error("email empty");
    }
  }

  async login() {
    this.btnDisabled = true;

    try {
      if(this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/login',
          {
            email: this.email,
            password: this.password
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.router.navigate(['/'])
          await this.data.getProfile();
        } else {
          this.data.error(data['message'])
        }
      }
    }
    catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
