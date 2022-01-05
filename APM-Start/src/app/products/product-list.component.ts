import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  products$: Observable<Product[]> 

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$.pipe(
      catchError(err => {
        this.errorMessage=err;
        return EMPTY;
      })
    )
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
