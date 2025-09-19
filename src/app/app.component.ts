import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { map } from 'rxjs/operators';
import { CartItem } from './models/cart-item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="container mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a routerLink="/" class="text-xl font-bold text-gray-800">Online Store</a>
            </div>
            <div class="flex items-center">
              <a
                routerLink="/cart"
                class="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <span>Cart</span>
                <span
                  *ngIf="cartItemCount$ | async as count"
                  class="bg-blue-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  {{ count }}
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  cartItemCount$;

  constructor(private cartService: CartService) {
    this.cartItemCount$ = this.cartService.getCart().pipe(map((items: CartItem[]) => items.length));
  }
}
