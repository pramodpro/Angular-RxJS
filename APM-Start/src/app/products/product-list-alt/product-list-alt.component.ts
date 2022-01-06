import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent{
  pageTitle = 'Products';
  errorMessageSubject =  new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  products$ = this.productService.productsWithCategory$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )
  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
