import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Subject, map } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PublicHomeFacadeService } from '../../../../abstraction/public-home.facade.service';
import { PageFromEnum } from '../../../../domain/enum/page-from.enum';
import { Product } from '../../../../domain/model/product';
import { formatCurrency } from '../../../../infrastructure/utils';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CategoryLabelPipe } from '../../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../../pipe/category-severity.pipe';

interface CategoryData {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CarouselModule,
    ProgressSpinnerModule,
    TagModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
    ProductCardComponent,
  ],
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss'],
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: Carousel;
  private readonly destroy$ = new Subject<void>();

  loading = false;
  categoriesWithProducts: CategoryData[] = [];
  carouselAutoplayInterval = 5000; // Intervalo padrão
  isCarouselPaused = false; // Controla se o carousel está pausado
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  readonly PageFromEnum = PageFromEnum;

  constructor(
    private readonly productFacade: PublicHomeFacadeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategoriesWithProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoplay();
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    if (!this.isCarouselPaused && this.categoriesWithProducts.length > 1) {
      this.autoplayTimer = setInterval(() => {
        if (this.carousel && !this.isCarouselPaused) {
          const event = new MouseEvent('click');
          this.carousel.navForward(event);
        }
      }, 5000);
    }
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private loadCategoriesWithProducts(): void {
    this.loading = true;

    this.productFacade.loadProducts();

    this.productFacade.products$
      .pipe(
        map((products: Product[]) => this.groupProductsByCategory(products)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (categoriesData: CategoryData[]) => {
          this.categoriesWithProducts = categoriesData;
          this.loading = false;
          // Inicia o autoplay após carregar os dados
          setTimeout(() => this.startAutoplay(), 100);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private groupProductsByCategory(products: Product[]): CategoryData[] {
    const categoryMap = new Map<string, Product[]>();

    products.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, []);
      }
      categoryMap.get(product.category)!.push(product);
    });

    return Array.from(categoryMap.entries()).map(([category, products]) => ({
      category,
      products: products.slice(0, 4), // Máximo 4 produtos por categoria no carousel
    }));
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  onCarouselMouseEnter(): void {
    this.isCarouselPaused = true;
    this.stopAutoplay();
  }

  onCarouselMouseLeave(): void {
    this.isCarouselPaused = false;
    this.startAutoplay();
  }

  goToProducts(category?: string): void {
    if (category) {
      this.router.navigate(['/products'], {
        queryParams: { category },
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
