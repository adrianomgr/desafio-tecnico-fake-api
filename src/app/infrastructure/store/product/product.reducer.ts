import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductState } from '../../../domain/interface/product-state.interface';
import { Product } from '../../../domain/model/product';
import * as ProductActions from './product.actions';

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: ProductState = adapter.getInitialState({
  selectedProduct: null,
  categories: [],
  selectedCategory: null,
  searchTerm: '',
  sortOrder: null,
  loading: false,
  error: null,
});

export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, {
      ...state,
      loading: false,
    })
  ),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.loadProductsByCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadProductsByCategorySuccess, (state, { products }) =>
    adapter.setAll(products, {
      ...state,
      loading: false,
    })
  ),
  on(ProductActions.loadProductsByCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),
  on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
  })),
  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.setSelectedCategory, (state, { category }) => ({
    ...state,
    selectedCategory: category,
  })),
  on(ProductActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(ProductActions.setSortOrder, (state, { sortOrder }) => ({
    ...state,
    sortOrder,
  })),

  on(ProductActions.clearProductState, () => initialState)
);
