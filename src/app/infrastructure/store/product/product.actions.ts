import { createAction, props } from '@ngrx/store';
import { Product, ProductCreate, ProductUpdate } from '../../../domain/model/product';

export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: any }>()
);

export const loadProductsByCategory = createAction(
  '[Product] Load Products By Category',
  props<{ category: string }>()
);
export const loadProductsByCategorySuccess = createAction(
  '[Product] Load Products By Category Success',
  props<{ products: Product[] }>()
);
export const loadProductsByCategoryFailure = createAction(
  '[Product] Load Products By Category Failure',
  props<{ error: any }>()
);

export const loadCategories = createAction('[Product] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Product] Load Categories Success',
  props<{ categories: string[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Product] Load Categories Failure',
  props<{ error: any }>()
);

export const loadProduct = createAction('[Product] Load Product', props<{ id: number }>());
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: any }>()
);

export const createProduct = createAction(
  '[Product] Create Product',
  props<{ product: ProductCreate }>()
);
export const createProductSuccess = createAction(
  '[Product] Create Product Success',
  props<{ product: Product }>()
);
export const createProductFailure = createAction(
  '[Product] Create Product Failure',
  props<{ error: any }>()
);

export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ product: ProductUpdate }>()
);
export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: any }>()
);

export const deleteProduct = createAction('[Product] Delete Product', props<{ id: number }>());
export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ id: number }>()
);
export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: any }>()
);

export const setSelectedCategory = createAction(
  '[Product] Set Selected Category',
  props<{ category: string | null }>()
);

export const setSearchTerm = createAction(
  '[Product] Set Search Term',
  props<{ searchTerm: string }>()
);

export const setSortOrder = createAction(
  '[Product] Set Sort Order',
  props<{ sortOrder: 'asc' | 'desc' | null }>()
);

export const clearProductState = createAction('[Product] Clear State');
