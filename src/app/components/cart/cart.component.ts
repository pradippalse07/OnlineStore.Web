import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>

      <div *ngIf="cartItems.length === 0" class="text-center py-8">
        <p>Your cart is empty</p>
        <a routerLink="/" class="text-blue-500 hover:underline">Continue Shopping</a>
      </div>

      <div *ngIf="cartItems.length > 0">
        <div class="space-y-4">
          <div
            *ngFor="let item of cartItems"
            class="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 class="font-semibold">{{ item.product?.name }}</h3>
              <p class="text-gray-600">
                {{ item.product?.price | currency }} x {{ item.quantity }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <input
                type="number"
                [min]="1"
                [max]="item.product?.stock || 0"
                [(ngModel)]="item.quantity"
                (change)="updateQuantity(item)"
                class="w-20 px-2 py-1 border rounded"
              />
              <button
                (click)="removeItem(item.productId)"
                class="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between items-center">
          <div class="text-xl font-bold">Total: {{ total | currency }}</div>
          <div class="space-x-4">
            <button (click)="clearCart()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Clear Cart
            </button>
            <button
              routerLink="/checkout"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithProduct[] = [];
  total = 0;

  constructor(private cartService: CartService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe((items) => {
      // Load product details for each cart item
      this.cartItems = items.map((item) => ({ ...item }));
      this.loadProductDetails();
    });
  }

  private loadProductDetails(): void {
    this.cartItems.forEach((item) => {
      this.productService.getProduct(item.productId).subscribe({
        next: (product) => {
          item.product = product;
          this.calculateTotal();
        },
        error: (error) => console.error('Error loading product details:', error),
      });
    });
  }

  private calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }

  updateQuantity(item: CartItemWithProduct): void {
    if (item.product && item.quantity > 0 && item.quantity <= item.product.stock) {
      this.cartService.updateQuantity(item.productId, item.quantity);
      this.calculateTotal();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}
