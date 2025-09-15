import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as PublicCartSelectors from '../infrastructure/store/public-cart/public-cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class PublicLayoutFacadeService {
  readonly localCartItemCount$: Observable<number>;

  constructor(private readonly store: Store) {
    this.localCartItemCount$ = this.store.select(PublicCartSelectors.selectCartItemCount);
  }
}
