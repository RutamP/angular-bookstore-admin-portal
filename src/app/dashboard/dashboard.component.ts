import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { ChartData, ChartOptions } from 'chart.js';
import { User, UserService } from '../users/user.service';
import { Subscription } from 'rxjs';
import { Author } from '../authors/author.model';
import { Book, BookService } from '../books/book.service';
import { DialogService } from 'src/app/services/dialog.service';
import { AuthorService } from '../authors/author.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName = '';
  userRole = '';

  bookCount = 0;
  authorCount = 0;
  userCount = 0;

  private userSubscription: Subscription | undefined;

  isSalesUser = false;

  public barChartData: ChartData<'bar'> = {
    labels: ['Books', 'Authors', 'Users'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Counts',
      },
    ],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#2e7d32',
          font: { weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ': ' + context.parsed.y;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#2e7d32', font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(46, 125, 50, 0.1)' },
        ticks: { color: '#2e7d32', font: { weight: 'bold' } },
      },
    },
    datasets: {
      bar: {
        backgroundColor: '#a8daac',
        borderColor: 'black',
        borderWidth: 2,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    },
  };

  public barChartType: 'bar' = 'bar';
  public barChartLegend = true;

  public pieChartData: ChartData<'pie'> = {
    labels: ['Super Admin', 'Admin', 'Sales Person'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#66bb6a', '#81c784', '#a5d6a7'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#2e7d32',
          font: { weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  public pieChartType: 'pie' = 'pie';
  public pieChartLegend = true;

  constructor(
    private authService: AuthService,
    public roleService: RoleService,
    private dialogService: DialogService,
    private authorService: AuthorService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUserObservable()
      .subscribe((user) => {
        this.userName = user?.username || 'Guest';
        this.userRole = user?.role || 'Unknown';
        this.isSalesUser = user?.role?.toLowerCase() === 'sales';
      });

    this.loadCounts();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadCounts(): void {
    Promise.all([
      fetch('http://localhost:3000/books').then((res) => res.json()),
      fetch('http://localhost:3000/authors').then((res) => res.json()),
      fetch('http://localhost:3000/users').then((res) => res.json()),
    ])
      .then(([books, authors, users]) => {
        this.bookCount = books.length;
        this.authorCount = authors.length;
        this.userCount = users.length;

        this.barChartData = {
          labels: ['Books', 'Authors', 'Users'],
          datasets: [
            {
              data: [this.bookCount, this.authorCount, this.userCount],
              label: 'Counts',
            },
          ],
        };

        const roleCounts = {
          superadmin: 0,
          admin: 0,
          sales: 0,
        };

        users.forEach((user: User) => {
          const roleKey = user.role.toLowerCase() as keyof typeof roleCounts;
          if (roleCounts.hasOwnProperty(roleKey)) {
            roleCounts[roleKey]++;
          }
        });

        this.pieChartData = {
          labels: ['Super Admin', 'Admin', 'Sales Person'],
          datasets: [
            {
              data: [roleCounts.superadmin, roleCounts.admin, roleCounts.sales],
              backgroundColor: ['#66bb6a', '#81c784', '#a5d6a7'],
              borderColor: '#ffffff',
              borderWidth: 2,
            },
          ],
        };
      })
      .catch((err) => {
        console.error('Failed to load counts', err);
      });
  }

  openAddBookDialog(): void {
    this.dialogService.openBookDialog(null, (result: Book, isEdit: boolean) => {
      if (!isEdit) {
        this.bookService.createBook(result).subscribe({
          next: () => {
            this.loadCounts();
            this.showSnackBar('Book added successfully', 'snackbar-success');
          },
          error: () => {
            this.showSnackBar('Failed to add book', 'snackbar-error');
          },
        });
      }
    });
  }

  openAddAuthorDialog(): void {
    this.dialogService.openAuthorDialog(
      null,
      (result: Author, isEdit: boolean) => {
        if (!isEdit) {
          this.authorService.addAuthor(result).subscribe({
            next: () => {
              this.loadCounts();
              this.showSnackBar(
                'Author added successfully',
                'snackbar-success'
              );
            },
            error: () => {
              this.showSnackBar('Failed to add author', 'snackbar-error');
            },
          });
        }
      }
    );
  }

  openAddUserDialog(): void {
    this.dialogService.openUserDialog(null, (result: User, isEdit: boolean) => {
      if (!isEdit) {
        this.userService.addUser(result).subscribe({
          next: () => {
            this.loadCounts();
            this.showSnackBar('User added successfully', 'snackbar-success');
          },
          error: () => {
            this.showSnackBar('Failed to add user', 'snackbar-error');
          },
        });
      }
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
