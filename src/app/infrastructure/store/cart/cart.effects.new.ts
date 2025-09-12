import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CartApiService } from '../../api/cart.api.service';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

@Injectable()
export class CartEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly cartApiService: CartApiService,
    private readonly store: Store
  ) {}

  loadCarts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.loadCarts),
      switchMap(() =>
        this.cartApiService.getAllCarts().pipe(
          map((carts) => CartActions.loadCartsSuccess({ carts })),
          catchError((error) => of(CartActions.loadCartsFailure({ error })))
        )
      )
    );
  });

  loadUserCarts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.loadUserCarts),
      switchMap(({ userId }) =>
        this.cartApiService.getCartsByUserId(userId).pipe(
          map((carts) => CartActions.loadUserCartsSuccess({ carts })),
          catchError((error) => of(CartActions.loadUserCartsFailure({ error })))
        )
      )
    );
  });

  loadCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(({ id }) =>
        this.cartApiService.getCartById(id).pipe(
          map((cart) => CartActions.loadCartSuccess({ cart })),
          catchError((error) => of(CartActions.loadCartFailure({ error })))
        )
      )
    );
  });

  createCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.createCart),
      mergeMap(({ cart }) =>
        this.cartApiService.createCart(cart).pipe(
          map((createdCart) => CartActions.createCartSuccess({ cart: createdCart })),
          catchError((error) => of(CartActions.createCartFailure({ error })))
        )
      )
    );
  });

  updateCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.updateCart),
      mergeMap(({ cart }) =>
        this.cartApiService.updateCart(cart).pipe(
          map((updatedCart) => CartActions.updateCartSuccess({ cart: updatedCart })),
          catchError((error) => of(CartActions.updateCartFailure({ error })))
        )
      )
    );
  });

  deleteCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.deleteCart),
      mergeMap(({ id }) =>
        this.cartApiService.deleteCart(id).pipe(
          map(() => CartActions.deleteCartSuccess({ id })),
          catchError((error) => of(CartActions.deleteCartFailure({ error })))
        )
      )
    );
  });

  saveLocalCartToServer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.saveLocalCartToServer),
      withLatestFrom(this.store.select(CartSelectors.selectLocalCartItems)),
      mergeMap(([{ userId }, localCartItems]) => {
        if (localCartItems.length === 0) {
          return of({ type: 'NO_OP' }); // No items to save
        }

        const cartToCreate = {
          userId,
          date: new Date().toISOString(),
          products: localCartItems,
        };

        return this.cartApiService.createCart(cartToCreate).pipe(
          map((cart) => CartActions.createCartSuccess({ cart })),
          catchError((error) => of(CartActions.createCartFailure({ error })))
        );
      })
    );
  });
}
