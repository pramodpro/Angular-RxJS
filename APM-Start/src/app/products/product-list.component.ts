import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProductCategoryService} from '../product-categories/product-category.service'
import { BehaviorSubject, combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, tap,map, startWith } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessageSubject =  new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private categorySelectedSubject =  new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  categories$ = this.productCategory.productCategories$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  products$ = combineLatest([this.productService.productsWithCategory$,this.categorySelectedAction$]).pipe(
    map(([products,selectedCategoryId]) => products.filter(
      product => selectedCategoryId?
      product.categoryId=== selectedCategoryId: true
    )),
    catchError(err => {
      this.errorMessage=err;
      return EMPTY;
    })
  );

  // products$ = combineLatest([this.productService.products$,this.action$])
  // productsSimpleFilter$ = this.productService.productsWithCategory$.pipe(
  //   map(products => products.filter(
  //     product => this.selectedCategoriesId?
  //     product.categoryId=== this.selectedCategoriesId: true
  //   ))
  // )

  constructor(private productService: ProductService,private productCategory: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
   this.categorySelectedSubject.next(+categoryId);
  }
}
