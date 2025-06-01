import { Component, Output, EventEmitter } from '@angular/core';
import { Router, IsActiveMatchOptions } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() navItemClicked = new EventEmitter<void>();
  opened = true;

  constructor(public roleService: RoleService, private router: Router) {}

  handleNavItemClicked(): void {
    this.navItemClicked.emit();
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }
}
