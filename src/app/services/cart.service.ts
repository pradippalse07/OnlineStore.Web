import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    console.log('Adding to cart:', { product, quantity });

    if (!product || !product.id) {
      console.error('Invalid product:', product);
      throw new Error('Invalid product');
    }

    const existingItem = this.cartItems.find((item) => item.productId === product.id);
    console.log('Existing item:', existingItem);

    if (existingItem) {
      existingItem.quantity += quantity;
      console.log('Updated quantity:', existingItem.quantity);
    } else {
      this.cartItems.push({ productId: product.id, quantity });
      console.log('Added new item to cart');
    }

    this.updateCart();
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    console.log('Updating cart:', this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
    console.log('Cart updated, current state:', this.cartSubject.value);
  }
}
