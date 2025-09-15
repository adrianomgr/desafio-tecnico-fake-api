import { EntityState } from '@ngrx/entity';
import { Product } from '../model/product';

export interface ProductState extends EntityState<Product> {
  selectedProduct: Product | null;
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  sortOrder: 'asc' | 'desc' | null;
  loading: boolean;
  error: any;
}
