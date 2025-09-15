import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as PublicCartSelectors from '../infrastructure/store/public-cart/public-cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class PublicLayoutFacadeService {
  private readonly store = inject(Store);
  readonly localCartItemCount$: Observable<number>;

  constructor() {
    this.localCartItemCount$ = this.store.select(PublicCartSelectors.selectCartItemCount);
  }
}
