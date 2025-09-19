import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div *ngFor="let product of products" class="border rounded-lg p-4">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.price | currency }}</p>
          <p class="text-sm text-gray-500">In Stock: {{ product.stock }}</p>
          <button
            (click)="addToCart(product)"
            [disabled]="product.stock === 0"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (error) => console.error('Error loading products:', error),
    });
  }

  addToCart(product: Product): void {
    try {
      this.cartService.addToCart(product);
      // You can add a notification library here for better UX
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  }
}
