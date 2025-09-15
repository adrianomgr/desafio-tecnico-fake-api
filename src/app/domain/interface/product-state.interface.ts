import { EntityState } from '@ngrx/entity';
import { Product, ProductError } from '../model/product';

export interface ProductState extends EntityState<Product> {
  selectedProduct: Product | null;
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  sortOrder: 'asc' | 'desc' | null;
  loading: boolean;
  error: ProductError | null;
}
