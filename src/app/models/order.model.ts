import { Product } from './product.model';

export interface OrderItem {
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  orderItems: OrderItem[];
}
