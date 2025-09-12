import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartFacadeService } from '../../../abstraction/cart.facade.service';
import { ProductFacadeService } from '../../../abstraction/product.facade.service';
import { Product } from '../../../domain/model/product';
import { CategoryLabelPipe } from '../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../pipe/category-severity.pipe';

@Component({
  selector: 'app-marketplace-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    InputTextModule,
    ProgressSpinnerModule,
    TagModule,
    RatingModule,
    ImageModule,
    DividerModule,
    ToastModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
  ],
  templateUrl: './marketplace-view.component.html',
  styleUrls: ['./marketplace-view.component.scss'],
})
export class MarketplaceViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  filteredProducts: Product[] = [];
  categories: string[] = [];
  loading = false;
  error: any = null;

  searchTerm = '';
  selectedCategory: string | null = null;
  sortOrder: 'asc' | 'desc' | null = null;

  categoryOptions: any[] = [];
  sortOptions = [
    { label: 'Menor preço', value: 'asc' },
    { label: 'Maior preço', value: 'desc' },
  ];

  private readonly categoryLabelPipe = new CategoryLabelPipe();

  constructor(
    private readonly productFacade: ProductFacadeService,
    private readonly cartFacade: CartFacadeService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.subscribeToStoreData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.productFacade.loadProducts();
    this.productFacade.loadCategories();
  }

  private subscribeToStoreData(): void {
    this.productFacade.filteredProducts$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.filteredProducts = products;
    });

    this.productFacade.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
      this.categoryOptions = categories.map((category) => ({
        label: this.categoryLabelPipe.transform(category),
        value: category,
      }));
    });

    this.productFacade.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.productFacade.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      this.error = error;
    });

    this.productFacade.selectedCategory$.pipe(takeUntil(this.destroy$)).subscribe((category) => {
      this.selectedCategory = category;
    });

    this.productFacade.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((term) => {
      this.searchTerm = term;
    });

    this.productFacade.sortOrder$.pipe(takeUntil(this.destroy$)).subscribe((order) => {
      this.sortOrder = order;
    });
  }

  onSearchChange(term: string): void {
    this.productFacade.setSearchTerm(term);
  }

  onCategoryChange(event: any): void {
    this.productFacade.setSelectedCategory(event.value);
  }

  onSortChange(event: any): void {
    this.productFacade.setSortOrder(event.value);
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/marketplace/product', productId]);
  }

  addToCart(product: Product): void {
    // Add product to local cart
    this.cartFacade.addToLocalCart(product.id, 1);

    // Show success message when product is added to cart
    this.messageService.add({
      severity: 'success',
      summary: 'Produto Adicionado',
      detail: `${product.title} foi adicionado ao carrinho`,
      life: 3000,
    });
  }
}
