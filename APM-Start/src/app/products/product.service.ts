import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service'
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  private selectedCategory = new BehaviorSubject(0);
  selectedCatAction$ = this.selectedCategory.asObservable();
  products$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products,categories]) =>
      products.map( product => ({
        ...product,
      price: product.price * 1.5,
      category: categories.find(c => product.categoryId === c.id).name,
      searchKey:[product.productName]
    }) as Product )));

    // this.productsWithCategory$.pipe(
    //   tap(product => console.log('selected product',product))
    // )
    selectedProduct$ = combineLatest([this.productsWithCategory$,this.selectedCatAction$]).pipe(
      map(([products,selectedProductsId]) => products.find(product=> product.id===selectedProductsId)),
      tap(product => console.log('selectedProduct', product))
    );
    selectedProductChanged(productId:number): void {
      this.selectedCategory.next(productId);
    }



  constructor(private http: HttpClient,
              private supplierService: SupplierService,private productCategoryService:ProductCategoryService) { }


  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
