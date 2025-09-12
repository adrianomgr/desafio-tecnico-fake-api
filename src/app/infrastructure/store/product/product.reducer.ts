import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../domain/model/product';
import * as ProductActions from './product.actions';

export interface ProductState extends EntityState<Product> {
  selectedProduct: Product | null;
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  sortOrder: 'asc' | 'desc' | null;
  loading: boolean;
  error: any;
}

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

  // Load Products
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

  // Load Products By Category
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

  // Load Categories
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

  // Load Single Product
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

  // Create Product
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.createProductSuccess, (state, { product }) =>
    adapter.addOne(product, {
      ...state,
      loading: false,
    })
  ),
  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) =>
    adapter.updateOne(
      { id: product.id, changes: product },
      {
        ...state,
        loading: false,
      }
    )
  ),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
    })
  ),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Filter Actions
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

  // Clear State
  on(ProductActions.clearProductState, () => initialState)
);
