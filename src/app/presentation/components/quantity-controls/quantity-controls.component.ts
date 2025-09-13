import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PageFromEnum } from '../../../domain/enum/page-from.enum';

@Component({
  selector: 'app-quantity-controls',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './quantity-controls.component.html',
  styleUrls: ['./quantity-controls.component.scss'],
})
export class QuantityControlsComponent {
  @Input() quantity = 1;
  @Input() isInCart = false;
  @Input() showAddToCart = true;
  @Input() pageFrom: PageFromEnum = PageFromEnum.PUBLIC_PRODUCTS;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();

  readonly PageFromEnum = PageFromEnum;

  get addToCartButtonLabel(): string {
    return this.pageFrom === PageFromEnum.HOME ? 'Adicionar' : 'Adicionar ao Carrinho';
  }

  increaseQuantity(event: Event): void {
    event.stopPropagation();
    if (this.quantity) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }

  decreaseQuantity(event: Event): void {
    event.stopPropagation();
    if (this.quantity <= 1) {
      this.removeItem.emit();
    } else if (this.quantity) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit();
  }
}
