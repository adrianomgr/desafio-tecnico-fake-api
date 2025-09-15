import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductApiService } from '../../api/product.api.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly productApiService = inject(ProductApiService);

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productApiService.getAllProducts().pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error })))
        )
      )
    );
  });

  loadProductsByCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadProductsByCategory),
      switchMap(({ category }) =>
        this.productApiService.getProductsByCategory(category).pipe(
          map((products) => ProductActions.loadProductsByCategorySuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsByCategoryFailure({ error })))
        )
      )
    );
  });

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadCategories),
      switchMap(() =>
        this.productApiService.getAllCategories().pipe(
          map((categories) => ProductActions.loadCategoriesSuccess({ categories })),
          catchError((error) => of(ProductActions.loadCategoriesFailure({ error })))
        )
      )
    );
  });

  loadProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ id }) =>
        this.productApiService.getProductById(id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductFailure({ error })))
        )
      )
    );
  });
}
