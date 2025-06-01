import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/']).then((success) => {
          console.log('Navigation result:', success);
        });
      },
      error: (err) => {
        this.showSnackBar(err, 'snackbar-error');
      },
    });
  }

  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: { message, panelClass, snackBarRef: this.snackBar },
      panelClass: ['no-default-style'],
    });
  }
}
