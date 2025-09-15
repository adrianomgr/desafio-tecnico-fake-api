import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartAdminFacadeService } from '@app/abstraction/cart-admin.facade.service';
import { CartWithDetails } from '@app/domain/model/cart';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { CartAdminViewComponent } from './cart-admin-view.component';

describe('CartAdminViewComponent', () => {
  let component: CartAdminViewComponent;
  let fixture: ComponentFixture<CartAdminViewComponent>;
  let cartFacadeSpy: jasmine.SpyObj<CartAdminFacadeService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockCarts: CartWithDetails[] = [
    {
      id: 1,
      userId: 1,
      date: '2025-09-15',
      totalItems: 3,
      products: [],
      user: {
        id: 1,
        username: 'test1',
        email: 'test1@test.com',
        name: { firstname: 'Test', lastname: 'User' },
      },
    },
  ];

  beforeEach(async () => {
    cartFacadeSpy = jasmine.createSpyObj(
      'CartAdminFacadeService',
      ['loadCartsWithDetails', 'refreshCartsWithDetails'],
      {
        cartsWithDetails$: of(mockCarts),
      }
    );
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [CartAdminViewComponent],
      providers: [
        { provide: CartAdminFacadeService, useValue: cartFacadeSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter propriedades definidas', () => {
    expect(component.carts).toBeDefined();
    expect(component.loading).toBeDefined();
    expect(component.error).toBeDefined();
    expect(component.expandedRows).toBeDefined();
  });

  it('deve carregar carrinhos na inicialização', () => {
    expect(cartFacadeSpy.loadCartsWithDetails).toHaveBeenCalled();
    expect(component.carts).toEqual(mockCarts);
  });

  it('deve executar onGlobalFilter', () => {
    const mockTable = { filterGlobal: jasmine.createSpy('filterGlobal') };
    const mockEvent = { target: { value: 'test' } } as Event & { target: { value: string } };

    component.onGlobalFilter(mockTable, mockEvent);

    expect(mockTable.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('deve executar refreshCarts', () => {
    component.refreshCarts();

    expect(component.loading).toBe(true);
    expect(cartFacadeSpy.refreshCartsWithDetails).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
  it('deve retornar contagem de itens do carrinho', () => {
    const cart = mockCarts[0];
    const count = component.getCartItemCount(cart);

    expect(count).toBe(3);
  });

  it('deve retornar 0 para contagem quando não há totalItems', () => {
    const cart = { ...mockCarts[0], totalItems: undefined };
    const count = component.getCartItemCount(cart);

    expect(count).toBe(0);
  });

  it('deve formatar data', () => {
    const formatted = component.formatDate('2025-09-15');

    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
  it('deve retornar nome do usuário', () => {
    const cart = mockCarts[0];
    const displayName = component.getUserDisplayName(cart);

    expect(displayName).toBe('test1');
  });

  it('deve retornar nome padrão quando não há usuário', () => {
    const cart = { ...mockCarts[0], user: undefined };
    const displayName = component.getUserDisplayName(cart);

    expect(displayName).toBe('Usuário 1');
  });

  it('deve formatar moeda', () => {
    const formatted = component.formatCurrency(299.99);

    expect(formatted).toContain('299');
    expect(formatted).toContain('99');
  });

  it('deve alternar expansão da linha', () => {
    const cart = mockCarts[0];

    component.toggleRow(cart);
    expect(component.expandedRows[cart.id]).toBe(true);

    component.toggleRow(cart);
    expect(component.expandedRows[cart.id]).toBeUndefined();
  });

  it('deve verificar se linha está expandida', () => {
    const cart = mockCarts[0];

    expect(component.isRowExpanded(cart)).toBe(false);

    component.expandedRows[cart.id] = true;
    expect(component.isRowExpanded(cart)).toBe(true);
  });

  it('deve executar ngOnDestroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
