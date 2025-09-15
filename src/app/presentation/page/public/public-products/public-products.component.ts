import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PublicProductsFacadeService } from '../../../../abstraction/public-products.facade.service';
import { PageFromEnum } from '../../../../domain/enum/page-from.enum';
import { Product } from '../../../../domain/model/product';
import { formatCurrency } from '../../../../infrastructure/utils';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CategoryLabelPipe } from '../../../pipe/category-label.pipe';

@Component({
  selector: 'app-public-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    ProgressSpinnerModule,
    ProductCardComponent,
    MessageModule,
  ],
  templateUrl: './public-products.component.html',
  styleUrls: ['./public-products.component.scss'],
})
export class PublicProductsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly categoryLabelPipe = new CategoryLabelPipe();

  allFilteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  // Configuração do scroll infinito
  private readonly itemsPerPage = 6;
  private currentPage = 0;

  // Estados
  categories: string[] = [];
  loading = false;
  loadingMore = false;
  hasMoreItems = true;
  selectedCategory = '';
  searchTerm = '';

  categoryOptions = [{ label: 'Todas as categorias', value: '' }];

  readonly PageFromEnum = PageFromEnum;

  private readonly productFacade = inject(PublicProductsFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Garante que a página inicia no topo
    window.scrollTo({ top: 0, behavior: 'auto' });

    this.loadProducts();
    this.loadCategories();
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // HostListener para detectar scroll
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isNearBottom() && !this.loadingMore && this.hasMoreItems) {
      this.loadMoreItems();
    }
  }

  private isNearBottom(): boolean {
    const threshold = 200;
    const position = window.pageYOffset + window.innerHeight;
    const height = document.documentElement.scrollHeight;
    return position > height - threshold;
  }

  private resetPagination(): void {
    this.currentPage = 0;
    this.displayedProducts = [];
    this.hasMoreItems = true;
  }

  private loadMoreItems(): void {
    if (this.loadingMore || !this.hasMoreItems) return;

    this.loadingMore = true;

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newItems = this.allFilteredProducts.slice(startIndex, endIndex);

    if (newItems.length > 0) {
      this.displayedProducts = [...this.displayedProducts, ...newItems];
      this.currentPage++;

      // Verifica se há mais itens
      this.hasMoreItems = endIndex < this.allFilteredProducts.length;
    } else {
      this.hasMoreItems = false;
    }

    this.loadingMore = false;
  }

  private loadProducts(): void {
    this.productFacade.loadProducts();
  }

  private loadCategories(): void {
    this.productFacade.loadCategories();
  }

  private subscribeToData(): void {
    this.productFacade.filteredProducts$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.allFilteredProducts = products;
        this.resetPagination();
        this.loadMoreItems();
      },
      error: (error: Error) => {
        console.error('Erro ao carregar produtos:', error);
      },
    });

    this.productFacade.categories$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (categories: string[]) => {
        this.categories = categories;
        this.categoryOptions = [
          { label: 'Todas as categorias', value: '' },
          ...categories.map((cat: string) => ({
            label: this.categoryLabelPipe.transform(cat),
            value: cat,
          })),
        ];

        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          if (params['category'] && categories.includes(params['category'])) {
            this.selectedCategory = params['category'];
            this.productFacade.setSelectedCategory(this.selectedCategory);
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      },
    });

    this.productFacade.selectedCategory$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (selectedCategory: string | null) => {
        if (selectedCategory !== this.selectedCategory) {
          this.selectedCategory = selectedCategory || '';
        }
      },
    });

    this.productFacade.loading$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (loading: boolean) => {
        this.loading = loading;
      },
    });
  }

  onCategoryChange(): void {
    this.productFacade.setSelectedCategory(this.selectedCategory || null);
  }

  onSearchChange(): void {
    this.productFacade.setSearchTerm(this.searchTerm);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
