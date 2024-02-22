import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  users: User[] | undefined;
  message: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    if (this.users !== undefined) {
      console.log(this.users);
    }
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:3000/posts').subscribe(
      (res) => {
        if (res) {
          console.log(res);

          this.users = res;
          this.message = '';
        }
      },
      (error) => {
        if (error.status === 403) {
          this.message = 'You are not authorized to view this page';
        }
        console.log(error);
      },
      () => console.log('http request is done')
    );
  }
}
