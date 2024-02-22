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
      .post('http://localhost:4000/login', this.loginObj)
      .subscribe((res: any) => {
        if (res) {
          console.log(res);
          alert('Login successful');
          localStorage.setItem('jwt', res.accessToken);
          localStorage.setItem('refreshJWT', res.refreshToken);
          this.router.navigateByUrl('/dashboard');
        } else {
          alert(res.message);
        }
        console.log(res);
      });
  }
}
