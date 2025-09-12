export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface ProductCreate {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface ProductUpdate extends Partial<ProductCreate> {
  id: number;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}
