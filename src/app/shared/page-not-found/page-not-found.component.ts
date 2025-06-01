import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  goHome() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
