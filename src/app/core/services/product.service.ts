import {Injectable} from '@angular/core';
import {Product} from '../models/product.model';
import {Pagination} from '../models/pagination.model';
import {ProductsFilter} from '../models/products-filter.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {createParamsFromObject} from '../utils/create-params-from-object';

export const products: Product[] = [
  {
    id: 1,
    description: '',
    name: 'Kos Zotis',
    price: 25,
    barcode: '12345',
    lowStock: 5,
    optimalStock: 20,
    stock: 13,
    stock_type: 'cope'
  },
  {
    id: 2,
    description: '',
    name: 'Birra',
    price: 130,
    barcode: '12322245',
    lowStock: 10,
    optimalStock: 35,
    stock: 26,
    stock_type: 'cope'
  },
  {
    id: 3,
    description: '',
    name: 'Djathe',
    price: 500,
    barcode: '123',
    lowStock: 10,
    optimalStock: 23,
    stock: 14,
    stock_type: 'kile'
  }
];

export interface ProductsState {
  data: Product[];
  pagination: Pagination;
  filters: ProductsFilter | null;
  error: string | null;
  loading: boolean;
  loaded: boolean;
}

const initialState: ProductsState = {
  data: [],
  pagination: {pageSize: 10, pageIndex: 0, totalCount: 0},
  filters: null,
  error: null,
  loading: false,
  loaded: false
};


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private readonly state = new BehaviorSubject<ProductsState>(initialState);
  readonly state$ = this.state.asObservable().pipe(distinctUntilChanged());

  get currentState(): ProductsState {
    return this.state.getValue();
  }

  constructor() {
  }

  getProducts(filters: Partial<ProductsFilter> = {},
              pagination: Pagination): Observable<{ data: Product[], pagination: Pagination }> {

    // const params = createParamsFromObject(filters)
    //   .append('_page', pagination.pageIndex + '')
    //   .append('_limit', pagination.pageSize + '');

    return of({data: products, pagination});
  }

  loadProducts(filters?: ProductsFilter, pagination?: Partial<Pagination>): Observable<Product[]> {
    const currentPagination = this.currentState.pagination;
    const newPagination = pagination ? {...currentPagination, ...pagination} : currentPagination;
    const newFilters = filters ?? this.currentState.filters;

    this.state.next({
      ...this.currentState,
      filters: newFilters,
      pagination: newPagination,
      loading: true, error: null, loaded: false
    });


    return of(products);

    // const { pageSize, pageIndex } = this.currentState.pagination;
    // return this.getEmployees(this.currentState.filters ?? {}, { pageSize, pageIndex }).pipe(
    //   tap((res) => this.setData(res.data, res.pagination)),
    //   catchError(error => {
    //     // this.setError(error);
    //     this.setError('An error has occurred. Please try again later!');
    //     return of(error);
    //   })
    // );
  }
}