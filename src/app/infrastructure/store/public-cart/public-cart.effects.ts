import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CartApiService } from '../../api/cart.api.service';
import * as PublicCartActions from './public-cart.actions';

@Injectable()
export class PublicCartEffects {
  private readonly actions$ = inject(Actions);
  private readonly cartApiService = inject(CartApiService);

  // Effect para salvar no localStorage quando o carrinho for modificado
  saveToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          PublicCartActions.addToCart,
          PublicCartActions.removeFromCart,
          PublicCartActions.updateCartQuantity,
          PublicCartActions.clearCart
        ),
        tap(() => {
          // Implementar lógica de salvamento no localStorage, se tiver tempo futuramente eu implemento
        })
      ),
    { dispatch: false }
  );

  // Effect para salvar carrinho pela api
  saveCartToServer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PublicCartActions.saveCartToServer),
      switchMap((action) =>
        this.cartApiService
          .createCart({
            userId: action.userId || 1,
            date: new Date().toISOString().split('T')[0],
            products: [],
          })
          .pipe(
            map((response) => PublicCartActions.saveCartToServerSuccess({ cartId: response.id })),
            catchError((error) =>
              of(PublicCartActions.saveCartToServerFailure({ error: error.message }))
            )
          )
      )
    )
  );
}
