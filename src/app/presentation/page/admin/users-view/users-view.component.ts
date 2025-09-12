import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserFacadeService } from '@app/abstraction/user-facade.service';
import { User } from '@app/domain/model/user';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { UserInitialsPipe } from '@app/presentation/pipe';
import { passwordMatchValidator } from '@app/presentation/validators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    FloatLabelModule,
    UserInitialsPipe,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.scss',
})
export class UsersViewComponent implements OnInit {
  users: User[] = [];
  loading = false;
  displayDialog = false;
  userForm!: FormGroup;
  isEditMode = false;
  selectedUser: User | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly userFacade: UserFacadeService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  private initForm() {
    this.userForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }

  private loadUsers() {
    this.loading = true;
    this.userFacade
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar usuários. Tente novamente.',
            life: 5000,
          });
        },
      });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
    });

    // Remover validação obrigatória das senhas para edição
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();

    this.isEditMode = true;
    this.displayDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o usuário "${user.username}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.userFacade.deleteUser(user.id).subscribe({
          next: () => {
            this.loadUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário deletado com sucesso',
            });
          },
          error: (error) => {
            console.error('Erro ao deletar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao deletar usuário. Tente novamente.',
              life: 5000,
            });
          },
        });
      },
    });
  }

  showCreateDialog() {
    this.selectedUser = null;
    this.isEditMode = false;
    this.userForm.reset();

    // Reestabelecer validações para criação
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('confirmPassword')?.updateValueAndValidity();

    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode && this.selectedUser) {
        // Editar usuário existente
        const updateRequest = new UpdateUserRequest({
          id: this.selectedUser.id,
          username: formValue.username,
          email: formValue.email,
        });

        this.userFacade.updateUser(this.selectedUser.id, updateRequest).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário atualizado com sucesso',
            });
          },
          error: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar usuário. Tente novamente.',
              life: 5000,
            });
          },
        });
      } else {
        // Criar novo usuário
        const createRequest = new CreateUserRequest({
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
        });

        this.userFacade.createUser(createRequest).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso',
            });
          },
          error: (error) => {
            console.error('Erro ao criar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar usuário. Tente novamente.',
              life: 5000,
            });
          },
        });
      }
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedUser = null;
    this.isEditMode = false;
    this.userForm.reset();
  }
}
