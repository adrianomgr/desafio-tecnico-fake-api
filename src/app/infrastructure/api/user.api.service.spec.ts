import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '../../domain/model/user';
import { CreateUserRequest } from '../contract/request/create-user.request';
import { UpdateUserRequest } from '../contract/request/update-user.request';
import { UserApiService } from './user.api.service';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://fakestoreapi.com/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllUsers', () => {
    it('deve retornar uma lista de usuários mapeados', () => {
      // Arrange
      const mockUsers = [
        { id: 1, email: 'user1@test.com', username: 'user1', password: 'pass1' },
        { id: 2, email: 'user2@test.com', username: 'user2', password: 'pass2' },
      ];

      service.getAllUsers().subscribe((users) => {
        expect(users.length).toBe(2);
        expect(users[0]).toBeInstanceOf(User);
        expect(users[1]).toBeInstanceOf(User);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário específico mapeado por ID', () => {
      const userId = 1;
      const mockUser = { id: 1, email: 'user@test.com', username: 'testuser', password: 'pass123' };

      service.getUserById(userId).subscribe((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(userId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com dados corretos', () => {
      const createRequest: CreateUserRequest = {
        email: 'newuser@test.com',
        username: 'newuser',
        password: 'newpass123',
      };
      const mockResponse = { id: 10, ...createRequest };

      service.createUser(createRequest).subscribe((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe(createRequest.email);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: createRequest.email,
        username: createRequest.username,
        password: createRequest.password,
      });
      req.flush(mockResponse);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário existente com novos dados', () => {
      const userId = 3;
      const updateRequest: UpdateUserRequest = {
        id: userId,
        email: 'updated@test.com',
        username: 'updateduser',
        password: 'updatedpass',
      };
      const mockResponse = {
        id: userId,
        email: 'updated@test.com',
        username: 'updateduser',
        password: 'updatedpass',
      };

      service.updateUser(userId, updateRequest).subscribe((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe('updated@test.com');
      });

      const req = httpMock.expectOne(`${baseUrl}/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        email: updateRequest.email,
        username: updateRequest.username,
        password: updateRequest.password,
      });
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário pelo ID', () => {
      const userId = 4;

      service.deleteUser(userId).subscribe((response) => {
        expect(response).toBeFalsy();
      });

      const req = httpMock.expectOne(`${baseUrl}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
