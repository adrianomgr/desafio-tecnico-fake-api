# 🛒 E-Commerce Angular - Desafio Técnico

## 🎯 Sobre o Projeto

Este é um projeto desenvolvido em Angular 20, que utiliza as melhores práticas e tecnologias modernas do ecossistema Angular.

## 🚀 Tecnologias e Bibliotecas

- **Angular 20** - Framework principal
- **TypeScript** - Linguagem de programação
- **NgRx** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa
- **PrimeNG** - Biblioteca de componentes UI
- **Tailwind CSS** - Framework CSS utilitário
- **JWT** - Autenticação e autorização
- **Fake Store API** - API externa para dados

## 🏗️ Arquitetura e Padrões Implementados

### 📁 Estrutura de Arquivos Organizada

O projeto segue uma arquitetura limpa e bem organizada:

```
src/app/
├── abstraction/          # Facades para abstração de complexidade
├── domain/              # Modelos, interfaces e enums
│   ├── enum/           # Enumerações (CategoryEnum, PageFromEnum)
│   ├── interface/      # Interfaces de estado e contratos
│   └── model/          # Modelos de dados
├── infrastructure/     # Camada de infraestrutura
│   ├── api/           # Serviços de API
│   ├── guard/         # Guards de rota
│   ├── interceptor/   # Interceptors HTTP
│   ├── store/         # Store NgRx (actions, effects, reducers, selectors)
│   └── utils/         # Utilitários e helpers
└── presentation/      # Camada de apresentação
    ├── components/    # Componentes reutilizáveis
    ├── page/         # Páginas/views da aplicação
    ├── pipe/         # Pipes customizados
    └── validators/   # Validadores customizados
```

### 🎨 Padrão Facade

Implementação do padrão Facade para abstrair a complexidade:

- **Separação de responsabilidades**: Cada página possui seu próprio facade
- **Abstração de Store e API**: Facades gerenciam chamadas para NgRx Store e serviços de API

### 🔄 Gerenciamento de Estado com NgRx

#### Store Structures

- **Product Store**: Gerenciamento de produtos, filtros e categorias
- **Public Cart Store**: Controle de estado do carrinho público

#### Effects para Side Effects

- **Product Effects**: Carregamento de produtos e categorias
- **Public Cart Effects**: Persistência e sincronização do carrinho

#### Selectors Avançados

- **Filtros complexos**: Seletores que combinam categoria, busca e ordenação
- **Memoização**: Performance otimizada com selectors memoizados

## 🚀 Funcionalidades Avançadas Implementadas

### 🔒 Sistema de Autenticação e Autorização

#### Guards de Rota

- **AuthGuard**: Proteção de rotas autenticadas
- **CanDeactivateGuard**: Controle de saída de páginas com dados não salvos

#### Interceptors

- **AuthInterceptor**: Interceptação automática para adicionar tokens JWT

### 📝 Validações de Formulário Avançadas

#### Validadores Customizados

- **PasswordMatchValidator**: Validação de confirmação de senha
- **Validações reativas**: Integração com Angular Reactive Forms
- **Mensagens de erro personalizadas**: UX otimizada

### ♾️ Scroll Infinito

Implementação otimizada de scroll infinito:

- **@HostListener**: Detecção de scroll do usuário
- **Paginação virtual**: Carregamento progressivo de produtos
- **Performance**: Controle de threshold e loading states
- **UX**: Indicadores visuais de carregamento

```typescript
@HostListener('window:scroll')
onScroll(): void {
  if (this.isNearBottom() && !this.loadingMore && this.hasMoreItems) {
    this.loadMoreItems();
  }
}
```

### 🎠 Carousel Interativo

#### Controle Avançado de Carousel

- **Autoplay inteligente**: Pausa automática ao hover do mouse
- **Eventos de mouse**: `onCarouselMouseEnter()` e `onCarouselMouseLeave()`
- **Timer personalizado**: Controle preciso de intervalos

```typescript
onCarouselMouseEnter(): void {
  this.isCarouselPaused = true;
  this.stopAutoplay();
}

onCarouselMouseLeave(): void {
  this.isCarouselPaused = false;
  this.startAutoplay();
}
```

### 🔧 Sistema de Constantes

#### Configuração Centralizada - Constants

- **Constants class**: Valores padronizados para fácil ajuste
- **Category labels**: Mapeamento dos labels das categorias
- **Severity mapping**: Cores e estilos por categoria

```typescript
export class Constants {
  public static readonly categoryLabels = {
    [CategoryEnum.ELECTRONICS]: 'Eletrônicos',
    [CategoryEnum.JEWELERY]: 'Joias',
    [CategoryEnum.MENS_CLOTHING]: 'Roupas Masculinas',
    [CategoryEnum.WOMENS_CLOTHING]: 'Roupas Femininas',
  };
}
```

### 🎨 Sistema de Template Variables

Utilização de variáveis de template para padronização:

- **Enums no template**: Acesso direto a enumerações
- **Constants no template**: Reutilização de valores padronizados
- **Type safety**: TypeScript no template

### 🧩 Componentes Reutilizáveis

Implementação de componentes modulares e reutilizáveis para máxima eficiência:

#### Product Card Component

Componente altamente configurável usado em múltiplas páginas:

```typescript
@Component({
  selector: 'app-product-card',
  // ... imports
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() type: ProductCardType = 'home';
  @Input() showQuantitySelector = true;
  @Input() showAddToCart = true;
  @Input() pageFrom: PageFromEnum = PageFromEnum.PUBLIC_PRODUCTS;
  @Output() productClick = new EventEmitter<Product>();
}
```

**Características:**

- **Múltiplos contextos**: Usado em home, produtos e carrinho
- **Configuração flexível**: Diferentes layouts via `type` property
- **Controle de exibição**: Props para mostrar/ocultar funcionalidades
- **Eventos customizados**: Emissão de eventos para componentes pai
- **Integration com carrinho**: Controle de estado integrado

#### Quantity Controls Component

Componente especializado para controle de quantidade:

```typescript
@Component({
  selector: 'app-quantity-controls',
  // ... imports
})
export class QuantityControlsComponent {
  @Input() quantity = 1;
  @Input() isInCart = false;
  @Input() showAddToCart = true;
  @Input() pageFrom: PageFromEnum = PageFromEnum.PUBLIC_PRODUCTS;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();
}
```

**Funcionalidades:**

- **Controle inteligente**: Lógica para incrementar/decrementar
- **Remoção automática**: Remove item quando quantidade chega a 0
- **Labels dinâmicos**: Textos adaptativos baseados no contexto
- **Event bubbling**: Prevenção de propagação de eventos
- **Acessibilidade**: Tooltips e indicações visuais

#### Reutilização Estratégica

**Locais de uso do Product Card:**

- **Home Page**: Exibição em carousel por categoria
- **Products Page**: Grid de produtos com filtros

**Locais de uso do Quantity Controls:**

- **Product Card**: Controle dentro do card
- **Cart Items**: Alteração de quantidade no carrinho
- **Product Detail**: Seleção de quantidade na página de detalhe

**Benefícios da reutilização:**

- **Consistência UI**: Interface uniforme em toda aplicação
- **Manutenibilidade**: Mudanças centralizadas
- **Testabilidade**: Testes focados em componentes isolados
- **Performance**: Reutilização de código compilado
- **Escalabilidade**: Fácil extensão para novos contextos

## 🔧 Operadores RxJS Implementados

### Operadores de Transformação

- **map**: Transformação de dados
- **switchMap**: Cancelamento de requisições anteriores
- **mergeMap/concatMap**: Controle de concorrência

### Operadores de Combinação

- **forkJoin**: Múltiplas requisições paralelas
- **combineLatest**: Combinação de observables
- **withLatestFrom**: Acesso a último valor

### Operadores de Filtro e Controle

- **filter**: Filtragem de valores
- **distinctUntilChanged**: Prevenção de emissões duplicadas
- **debounceTime**: Debounce para busca
- **takeUntil**: Gestão de unsubscribe

### Operadores de Error Handling

- **catchError**: Tratamento de erros
- **finalize**: Cleanup de operações (geralmente para setar variável de carregamento para false)
- **tap**: Side effects sem modificar stream

## 🛠️ Utilitários e Helpers

### Currency Utilities

```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

### Pipes Customizados evitando funções no html

- **CategoryLabelPipe**: Label de categorias
- **CategorySeverityPipe**: Mapeamento de severidade
- **UserInitialsPipe**: Geração de iniciais de usuário

## 🔄 Implementações Complexas

### 🛒 Carrinho Admin com Múltiplos Endpoints

Integração complexa combinando dados de múltiplas APIs:

```typescript
refreshCartsWithDetails(): void {
  this.cartApiService.getAllCarts().pipe(
    switchMap((carts) => {
      const userIds = [...new Set(carts.map((cart) => cart.userId))];
      const productIds = [...new Set(carts.flatMap((cart) =>
        cart.products.map((p) => p.productId)))];

      const users$ = forkJoin(userIds.map((userId) =>
        this.userApiService.getUserById(userId)));
      const products$ = forkJoin(productIds.map((productId) =>
        this.productApiService.getProductById(productId)));

      return forkJoin([users$, products$]).pipe(
        map(([users, products]) =>
          this.mapCartsWithDetails(carts, users, products))
      );
    })
  ).subscribe();
}
```

### 🔍 Sistema de Filtros Avançado

Controle de estado com NgRx para filtros complexos:

- **Filtro por categoria**: Seleção dinâmica
- **Busca textual**: Busca em título, descrição e categoria
- **Ordenação**: Por preço (crescente/decrescente)
- **Estado persistente**: Manutenção de filtros na navegação

### 🎯 Controle de Rotas Dinâmicas

Proteção contra manipulação de IDs:

- **Route Guards**: Validação de parâmetros de rota
- **Error Handling**: Redirecionamento para páginas de erro
- **Type Safety**: Validação de tipos em parâmetros

## 🧪 Demonstração de Habilidades Técnicas

### 🔄 Programação Reativa Avançada

- **Memory Management**: Padrão destroy$ para prevenção de memory leaks
- **Stream Composition**: Combinação complexa de observables
- **Error Boundaries**: Tratamento de erros em streams

### 🏗️ Arquitetura Escalável

- **Separation of Concerns**: Separação clara de responsabilidades
- **Dependency Injection**: Uso avançado do DI do Angular
- **Modularity**: Componentes e serviços altamente modulares

### ⚡ Performance Optimization

- **OnPush Strategy**: Otimização de change detection
- **TrackBy Functions**: Otimização de listas
- **Lazy Loading**: Carregamento sob demanda
- **Memoization**: Cache de computações caras

### 🎨 UX/UI Avançado

- **Responsive Design**: Layout adaptativo
- **Loading States**: Estados de carregamento elegantes
- **Error States**: Tratamento visual de erros
- **Skeleton Loading**: Placeholders durante carregamento

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 🎯 Destaques Técnicos

### ✅ Boas Práticas Implementadas

- **Clean Code**: Código limpo e legível
- **SOLID Principles**: Princípios SOLID aplicados
- **Type Safety**: TypeScript usado extensivamente
- **Reactive Programming**: Programação reativa com RxJS
- **State Management**: Gerenciamento de estado centralizado
- **Error Handling**: Tratamento de erros robusto
- **Performance**: Otimizações de performance
- **Accessibility**: Considerações de acessibilidade
- **Responsive Design**: Design responsivo
- **Testing Ready**: Estrutura preparada para testes

---

**Desenvolvido por**: Adriano Gomes
**Tecnologias**: Angular 20, TypeScript, NgRx, RxJS, PrimeNG, Tailwind CSS
