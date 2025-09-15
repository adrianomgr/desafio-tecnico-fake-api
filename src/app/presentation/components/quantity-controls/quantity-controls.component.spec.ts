import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageFromEnum } from '../../../domain/enum/page-from.enum';
import { QuantityControlsComponent } from './quantity-controls.component';

describe('QuantityControlsComponent', () => {
  let component: QuantityControlsComponent;
  let fixture: ComponentFixture<QuantityControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  describe('addToCartButtonLabel', () => {
    it('deve retornar "Adicionar" quando pageFrom for HOME', () => {
      component.pageFrom = PageFromEnum.HOME;
      expect(component.addToCartButtonLabel).toBe('Adicionar');
    });

    it('deve retornar "Adicionar ao Carrinho" quando pageFrom for PUBLIC_PRODUCTS', () => {
      component.pageFrom = PageFromEnum.PUBLIC_PRODUCTS;
      expect(component.addToCartButtonLabel).toBe('Adicionar ao Carrinho');
    });
  });

  describe('increaseQuantity', () => {
    it('deve emitir quantidade aumentada quando quantity > 0', () => {
      spyOn(component.quantityChange, 'emit');
      component.quantity = 5;

      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.increaseQuantity(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.quantityChange.emit).toHaveBeenCalledWith(6);
    });

    it('não deve emitir quando quantity for 0', () => {
      spyOn(component.quantityChange, 'emit');
      component.quantity = 0;

      const event = new Event('click');
      component.increaseQuantity(event);

      expect(component.quantityChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('decreaseQuantity', () => {
    it('deve emitir removeItem quando quantity <= 1', () => {
      spyOn(component.removeItem, 'emit');
      component.quantity = 1;

      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.decreaseQuantity(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.removeItem.emit).toHaveBeenCalled();
    });

    it('deve emitir quantidade diminuída quando quantity > 1', () => {
      spyOn(component.quantityChange, 'emit');
      component.quantity = 5;

      const event = new Event('click');
      component.decreaseQuantity(event);

      expect(component.quantityChange.emit).toHaveBeenCalledWith(4);
    });

    it('deve emitir removeItem quando quantity for 0', () => {
      spyOn(component.removeItem, 'emit');
      component.quantity = 0;

      const event = new Event('click');
      component.decreaseQuantity(event);

      expect(component.removeItem.emit).toHaveBeenCalled();
    });
  });

  describe('onAddToCart', () => {
    it('deve emitir addToCart e parar propagação do evento', () => {
      spyOn(component.addToCart, 'emit');

      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.onAddToCart(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.addToCart.emit).toHaveBeenCalled();
    });
  });

  describe('Valores padrão', () => {
    it('deve ter valores padrão corretos', () => {
      expect(component.quantity).toBe(1);
      expect(component.isInCart).toBe(false);
      expect(component.showAddToCart).toBe(true);
      expect(component.pageFrom).toBe(PageFromEnum.PUBLIC_PRODUCTS);
    });
  });
});
