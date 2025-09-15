import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderFacadeService } from '@app/abstraction/header.facade.service';
import { User } from '@app/domain/model/user';
import { UserInitialsPipe } from '@app/presentation/pipe/user-initials.pipe';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    TooltipModule,
    ConfirmDialogModule,
    UserInitialsPipe,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly headerFacade = inject(HeaderFacadeService);
  private readonly confirmationService = inject(ConfirmationService);

  currentUser: User | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const profileResource = this.headerFacade.getProfile;

      if (profileResource.hasValue()) {
        const user = profileResource.value();
        if (user) {
          this.currentUser = user;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get currentUserName(): string {
    return this.currentUser?.username || 'Usuário';
  }

  get currentUserEmail(): string {
    return this.currentUser?.email || '';
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja fazer logout?',
      header: 'Confirmação de Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, fazer logout',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.headerFacade.logout();
        this.router.navigate(['/login']);
      },
      reject: () => {
        return;
      },
    });
  }
}
