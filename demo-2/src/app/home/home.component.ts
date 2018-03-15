import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TransferState, makeStateKey} from '@angular/platform-browser';

const USER_KEY = makeStateKey('user');

@Component({
  selector: 'app-home',
  template: `
    <div
      class="user-missing"
      *ngIf="!user"
    >
      <strong>User not loaded yet!</strong>
    </div>

    <div
      class="user"
      *ngIf="user"
    >
      <div class="user-image">
        <img src="{{user.avatar}}" />
      </div>
      <div class="user-name">
        <strong>{{user.first_name}} {{user.last_name}}</strong>
      </div>
    </div>
  `,
  styles: [`
    .user {
      margin: 0 auto;
      width: 200px;
    }

    .user-image {
      text-align: center;
      margin-bottom: 10px;
      width: auto;
    }

    .user-name {
      text-align: center;
    }

    .user-missing {
      color: red;
    }
  `]
})
export class HomeComponent implements OnInit {
  public user?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
  };

  constructor(
    private http: HttpClient,
    private state: TransferState
  ) {}

  ngOnInit() {
    this.user = this.state.get(USER_KEY, null as any);

    // 12 users in API
    if (!this.user) {
      const randomUser = Math.floor(Math.random() * 12) + 1;
      this.http
        .get(`https://reqres.in/api/users/${randomUser}`)
        .subscribe(({ data }: {
          data: {
            id: number,
            first_name: string,
            last_name: string,
            avatar: string
          }
        }) => {
          this.user = data;
          this.state.set(USER_KEY, data as any);
        });
    }
  }
}
