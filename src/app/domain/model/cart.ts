export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface CartCreate {
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartUpdate extends Partial<CartCreate> {
  id: number;
}

// Modelos estendidos para o admin com dados populados
export interface CartWithDetails extends Cart {
  user?: {
    id: number;
    username: string;
    email: string;
    name: {
      firstname: string;
      lastname: string;
    };
  };
  productsWithDetails?: CartProductWithDetails[];
  totalValue?: number;
  totalItems?: number;
}

export interface CartProductWithDetails extends CartProduct {
  product?: {
    id: number;
    title: string;
    price: number;
    category: string;
    image: string;
    description: string;
  };
  subtotal?: number;
}
