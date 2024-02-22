import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginObj = {
    username: '',
    password: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http
      .post('https://dummyjson.com/auth/login', this.loginObj)
      .subscribe((res: any) => {
        if (res) {
          alert('Login successful');
          localStorage.setItem('jwt', res.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          alert(res.message);
        }
        console.log(res);
      });
  }
}
