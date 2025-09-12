import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-admin-sidebar',
  imports: [PanelMenuModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/admin/dashboard'],
    },
    {
      label: 'Produtos',
      icon: 'pi pi-box',
      routerLink: ['/admin/products'],
    },
    {
      label: 'Usuários',
      icon: 'pi pi-users',
      routerLink: ['/admin/users'],
    },
    {
      label: 'Meu Perfil',
      icon: 'pi pi-user',
      routerLink: ['/admin/profile'],
    },
    {
      label: 'Marketplace',
      icon: 'pi pi-external-link',
      routerLink: ['/marketplace'],
    },
  ];
}
