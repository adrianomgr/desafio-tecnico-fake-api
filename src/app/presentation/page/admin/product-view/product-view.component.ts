import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductFacadeService } from '../../../../abstraction/product.facade.service';
import { CategoryEnum } from '../../../../domain/enum/category.enum';
import { Product, ProductCreate, ProductUpdate } from '../../../../domain/model/product';
import { CategoryLabelPipe } from '../../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../../pipe/category-severity.pipe';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    ImageModule,
    ToolbarModule,
    CardModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
  ],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  products: Product[] = [];
  loading = false;
  productDialog = false;
  savingProduct = false;

  productForm: FormGroup;
  selectedProduct: Product | null = null;

  categoryOptions: { label: string; value: string }[] = [];

  constructor(
    private readonly productFacade: ProductFacadeService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.initializeCategoryOptions();
    this.loadProducts();
    this.subscribeToStoreData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCategoryOptions(): void {
    const categoryLabelPipe = new CategoryLabelPipe();
    this.categoryOptions = Object.values(CategoryEnum).map((category) => ({
      label: categoryLabelPipe.transform(category),
      value: category,
    }));
  }

  private createProductForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  private loadProducts(): void {
    this.productFacade.loadProducts();
  }

  private subscribeToStoreData(): void {
    this.productFacade.products$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.products = products;
    });

    this.productFacade.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.productFacade.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      if (error) {
        console.error('Erro ao carregar produtos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar produtos. Tente novamente.',
          life: 5000,
        });
      }
    });
  }

  onGlobalFilter(
    table: { filterGlobal: (value: string, matchMode: string) => void },
    event: Event
  ): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.selectedProduct = null;
    this.productForm.reset();
    this.productDialog = true;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    this.productDialog = true;
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${product.title}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        try {
          this.productFacade.deleteProduct(product.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto excluído com sucesso',
            life: 3000,
          });
        } catch (error) {
          console.error('Erro ao excluir produto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir produto. Tente novamente.',
            life: 5000,
          });
        }
      },
    });
  }

  hideDialog(): void {
    this.productDialog = false;
    this.productForm.reset();
    this.selectedProduct = null;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Inválido',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    this.savingProduct = true;
    const formValue = this.productForm.value;

    try {
      if (this.selectedProduct) {
        const productUpdate: ProductUpdate = {
          id: this.selectedProduct.id,
          ...formValue,
        };
        this.productFacade.updateProduct(productUpdate);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto atualizado com sucesso',
          life: 3000,
        });
      } else {
        const productCreate: ProductCreate = formValue;
        this.productFacade.createProduct(productCreate);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto criado com sucesso',
          life: 3000,
        });
      }

      this.hideDialog();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao salvar produto. Tente novamente.',
        life: 5000,
      });
    } finally {
      this.savingProduct = false;
    }
  }
}
