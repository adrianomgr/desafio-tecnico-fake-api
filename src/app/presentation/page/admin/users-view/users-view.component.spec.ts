import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserFacadeService } from '@app/abstraction/user-facade.service';
import { User } from '@app/domain/model/user';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { UsersViewComponent } from './users-view.component';

describe('UsersViewComponent', () => {
  let component: UsersViewComponent;
  let fixture: ComponentFixture<UsersViewComponent>;
  let userFacadeSpy: jasmine.SpyObj<UserFacadeService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationService>;

  const mockUsers: User[] = [
    { id: 1, username: 'test1', email: 'test1@test.com', password: '123' },
  ];

  beforeEach(async () => {
    userFacadeSpy = jasmine.createSpyObj('UserFacadeService', [
      'getAllUsers',
      'createUser',
      'updateUser',
      'deleteUser',
    ]);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    userFacadeSpy.getAllUsers.and.returnValue(of(mockUsers));
    userFacadeSpy.createUser.and.returnValue(of(mockUsers[0]));
    userFacadeSpy.updateUser.and.returnValue(of(mockUsers[0]));
    userFacadeSpy.deleteUser.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [UsersViewComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: UserFacadeService, useValue: userFacadeSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter propriedades definidas', () => {
    expect(component.users).toBeDefined();
    expect(component.loading).toBeDefined();
    expect(component.displayDialog).toBeDefined();
    expect(component.userForm).toBeDefined();
    expect(component.isEditMode).toBeDefined();
    expect(component.selectedUser).toBeDefined();
  });

  it('deve chamar getAllUsers na inicialização', () => {
    expect(userFacadeSpy.getAllUsers).toHaveBeenCalled();
  });

  it('deve executar editUser', () => {
    const user = mockUsers[0];
    component.editUser(user);
    expect(component.selectedUser).toBe(user);
  });

  it('deve executar deleteUser', () => {
    const user = mockUsers[0];
    component.deleteUser(user);
    expect(component).toBeTruthy();
  });

  it('deve executar showCreateDialog', () => {
    component.showCreateDialog();
    expect(component.isEditMode).toBe(false);
  });

  it('deve executar hideDialog', () => {
    component.hideDialog();
    expect(component.displayDialog).toBe(false);
  });

  it('deve executar saveUser', () => {
    component.showCreateDialog();
    component.userForm.patchValue({
      username: 'test',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123',
    });
    component.saveUser();
    expect(userFacadeSpy.createUser).toHaveBeenCalled();
  });
});
