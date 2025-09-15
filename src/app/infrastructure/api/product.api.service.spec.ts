import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CategoryEnum } from '../../domain/enum/category.enum';
import { Product, ProductCreate, ProductUpdate } from '../../domain/model/product';
import { ProductApiService } from './product.api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://fakestoreapi.com/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllProducts', () => {
    it('deve buscar todos os produtos da API', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Produto Teste',
          price: 29.99,
          description: 'Descrição do produto teste',
          category: CategoryEnum.ELECTRONICS,
          image: 'https://example.com/image.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      service.getAllProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('deve buscar um produto específico pelo ID', () => {
      const productId = 1;
      const mockProduct: Product = {
        id: productId,
        title: 'Produto Específico',
        price: 59.99,
        description: 'Produto buscado por ID',
        category: CategoryEnum.JEWELERY,
        image: 'https://example.com/product.jpg',
        rating: { rate: 4.2, count: 50 },
      };

      service.getProductById(productId).subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe(productId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('getProductsByCategory', () => {
    it('deve buscar produtos filtrados por categoria', () => {
      const category = CategoryEnum.ELECTRONICS;
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Eletrônico 1',
          price: 199.99,
          description: 'Produto eletrônico',
          category: CategoryEnum.ELECTRONICS,
          image: 'https://example.com/electronic1.jpg',
          rating: { rate: 4.3, count: 75 },
        },
      ];

      service.getProductsByCategory(category).subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products[0].category).toBe(category);
      });

      const req = httpMock.expectOne(`${baseUrl}/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getAllCategories', () => {
    it('deve buscar todas as categorias disponíveis na API', () => {
      const mockCategories: string[] = [
        CategoryEnum.ELECTRONICS,
        CategoryEnum.JEWELERY,
        CategoryEnum.MENS_CLOTHING,
        CategoryEnum.WOMENS_CLOTHING,
      ];

      service.getAllCategories().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(4);
      });

      const req = httpMock.expectOne(`${baseUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('createProduct', () => {
    it('deve criar um novo produto enviando dados via POST', () => {
      const newProduct: ProductCreate = {
        title: 'Novo Produto',
        price: 89.99,
        description: 'Produto criado no teste',
        category: CategoryEnum.MENS_CLOTHING,
        image: 'https://example.com/new-product.jpg',
      };

      const createdProduct: Product = {
        ...newProduct,
        id: 21,
        rating: { rate: 0, count: 0 },
      };

      service.createProduct(newProduct).subscribe((product) => {
        expect(product).toEqual(createdProduct);
        expect(product.title).toBe(newProduct.title);
      });

      const req = httpMock.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto existente enviando dados via PUT', () => {
      const productUpdate: ProductUpdate = {
        id: 1,
        title: 'Produto Atualizado',
        price: 129.99,
        description: 'Descrição atualizada',
        category: CategoryEnum.WOMENS_CLOTHING,
        image: 'https://example.com/updated-product.jpg',
      };

      const updatedProduct: Product = {
        id: productUpdate.id,
        title: productUpdate.title!,
        price: productUpdate.price!,
        description: productUpdate.description!,
        category: productUpdate.category!,
        image: productUpdate.image!,
        rating: { rate: 4.1, count: 25 },
      };

      service.updateProduct(productUpdate).subscribe((product) => {
        expect(product).toEqual(updatedProduct);
        expect(product.id).toBe(productUpdate.id);
      });

      const req = httpMock.expectOne(`${baseUrl}/${productUpdate.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(productUpdate);
      req.flush(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('deve excluir um produto específico enviando requisição DELETE', () => {
      const productId = 1;
      const deletedProduct: Product = {
        id: productId,
        title: 'Produto Excluído',
        price: 39.99,
        description: 'Produto que foi excluído',
        category: CategoryEnum.JEWELERY,
        image: 'https://example.com/deleted-product.jpg',
        rating: { rate: 3.8, count: 15 },
      };

      service.deleteProduct(productId).subscribe((product) => {
        expect(product).toEqual(deletedProduct);
        expect(product.id).toBe(productId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(deletedProduct);
    });
  });
});
