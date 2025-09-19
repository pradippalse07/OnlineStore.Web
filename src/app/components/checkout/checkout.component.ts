import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Checkout</h2>

      <div class="max-w-lg mx-auto">
        <form (ngSubmit)="onSubmit()" #checkoutForm="ngForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              [(ngModel)]="orderData.name"
              name="name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              [(ngModel)]="orderData.email"
              name="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              [(ngModel)]="orderData.address"
              name="address"
              required
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              [disabled]="!checkoutForm.form.valid || processing"
              class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {{ processing ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </form>
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
export class CheckoutComponent implements OnInit {
  orderData = {
    name: '',
    email: '',
    address: '',
  };
  processing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if cart is empty, redirect to cart if it is
    this.cartService.getCart().subscribe((items) => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  onSubmit(): void {
    if (this.processing) return;

    this.processing = true;
    // For demo purposes, using a hardcoded user ID
    const userId = '1';

    this.cartService.getCart().subscribe((items) => {
      this.orderService.createOrder(userId, items).subscribe({
        next: (order) => {
          this.cartService.clearCart();
          this.router.navigate(['/order-confirmation'], { state: { order } });
        },
        error: (error) => {
          console.error('Error creating order:', error);
          alert('There was an error processing your order. Please try again.');
          this.processing = false;
        },
      });
    });
  }
}
