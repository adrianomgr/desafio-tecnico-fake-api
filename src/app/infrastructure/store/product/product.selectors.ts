import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../../../domain/interface/product-state.interface';
import { adapter } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();

export const selectAllProducts = createSelector(selectProductState, selectAll);
export const selectProductEntities = createSelector(selectProductState, selectEntities);
export const selectProductIds = createSelector(selectProductState, selectIds);
export const selectProductsTotal = createSelector(selectProductState, selectTotal);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => state.selectedProduct
);

export const selectCategories = createSelector(selectProductState, (state) => state.categories);

export const selectSelectedCategory = createSelector(
  selectProductState,
  (state) => state.selectedCategory
);

export const selectSearchTerm = createSelector(selectProductState, (state) => state.searchTerm);

export const selectSortOrder = createSelector(selectProductState, (state) => state.sortOrder);

export const selectProductsLoading = createSelector(selectProductState, (state) => state.loading);

export const selectProductsError = createSelector(selectProductState, (state) => state.error);

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectSelectedCategory,
  selectSearchTerm,
  selectSortOrder,
  (products, selectedCategory, searchTerm, sortOrder) => {
    let filteredProducts = [...products];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    if (sortOrder) {
      filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    return filteredProducts;
  }
);

export const selectProductById = (id: number) =>
  createSelector(selectProductEntities, (entities) => entities[id] || null);
