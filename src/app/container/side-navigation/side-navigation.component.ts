import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css'],
})

export class SideNavigationComponent implements OnInit {
  isAuthenticated: boolean = false;
  username: string = "";
  public userId: Guid;

  constructor(public authService: AuthService) {
    this.userId = Guid.create()
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(r => {
      if (r)
        this.username = r.username;
      else
        this.username = "";
    });

    this.authService.isAuthenticated$.subscribe(r => {
      this.isAuthenticated = r;
    });
  }

  signIn() {
    this.authService.login()
  }

  signOut() {
    this.authService.logout()
  }
}