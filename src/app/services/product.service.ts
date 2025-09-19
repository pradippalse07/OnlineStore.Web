import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log('Fetching products from:', this.apiUrl);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => console.log('Products received:', products)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    console.log(`Fetching product with id ${id} from:`, `${this.apiUrl}/${id}`);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => console.log('Product received:', product)),
      catchError((error) => {
        console.error('Error fetching product:', error);
        throw error;
      })
    );
  }
}
