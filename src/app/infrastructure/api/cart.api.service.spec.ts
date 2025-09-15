import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cart, CartCreate, CartProduct, CartUpdate } from '../../domain/model/cart';
import { CartApiService } from './cart.api.service';

describe('CartApiService', () => {
  let service: CartApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://fakestoreapi.com/carts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllCarts', () => {
    it('deve buscar todos os carrinhos da API', () => {
      const mockCartProducts: CartProduct[] = [
        { productId: 1, quantity: 2 },
        { productId: 5, quantity: 1 },
      ];

      const mockCarts: Cart[] = [
        {
          id: 1,
          userId: 1,
          date: '2025-09-14',
          products: mockCartProducts,
        },
        {
          id: 2,
          userId: 2,
          date: '2025-09-15',
          products: [{ productId: 3, quantity: 1 }],
        },
      ];

      service.getAllCarts().subscribe((carts) => {
        expect(carts).toEqual(mockCarts);
        expect(carts.length).toBe(2);
        expect(carts[0].products.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCarts);
    });
  });

  describe('createCart', () => {
    it('deve criar um novo carrinho enviando dados via POST', () => {
      const newCartProducts: CartProduct[] = [
        { productId: 10, quantity: 3 },
        { productId: 15, quantity: 1 },
      ];

      const newCart: CartCreate = {
        userId: 5,
        date: '2025-09-14',
        products: newCartProducts,
      };

      const createdCart: Cart = {
        id: 11,
        userId: newCart.userId,
        date: newCart.date,
        products: newCart.products,
      };

      service.createCart(newCart).subscribe((cart) => {
        expect(cart).toEqual(createdCart);
        expect(cart.userId).toBe(newCart.userId);
        expect(cart.products.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCart);
      req.flush(createdCart);
    });
  });

  describe('updateCart', () => {
    it('deve atualizar um carrinho existente enviando dados via PUT', () => {
      const updatedCartProducts: CartProduct[] = [
        { productId: 1, quantity: 5 },
        { productId: 8, quantity: 2 },
      ];

      const cartUpdate: CartUpdate = {
        id: 3,
        userId: 2,
        date: '2025-09-14',
        products: updatedCartProducts,
      };

      const updatedCart: Cart = {
        id: cartUpdate.id,
        userId: cartUpdate.userId!,
        date: cartUpdate.date!,
        products: cartUpdate.products!,
      };

      service.updateCart(cartUpdate).subscribe((cart) => {
        expect(cart).toEqual(updatedCart);
        expect(cart.id).toBe(cartUpdate.id);
        expect(cart.products[0].quantity).toBe(5);
      });

      const req = httpMock.expectOne(`${baseUrl}/${cartUpdate.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(cartUpdate);
      req.flush(updatedCart);
    });
  });

  describe('deleteCart', () => {
    it('deve excluir um carrinho específico enviando requisição DELETE', () => {
      const cartId = 7;
      const deletedCartProducts: CartProduct[] = [{ productId: 12, quantity: 1 }];

      const deletedCart: Cart = {
        id: cartId,
        userId: 3,
        date: '2025-09-14',
        products: deletedCartProducts,
      };

      service.deleteCart(cartId).subscribe((cart) => {
        expect(cart).toEqual(deletedCart);
        expect(cart.id).toBe(cartId);
        expect(cart.products.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/${cartId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(deletedCart);
    });
  });
});
