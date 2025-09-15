import { formatCurrency } from '../../infrastructure/utils';

export class DashboardStats {
  title!: string;
  value!: string | number;
  description!: string;
  icon!: string;
  iconColor!: string;

  static createProductsStat(count: number): DashboardStats {
    return {
      title: 'Total de Produtos',
      value: count,
      description: 'Produtos disponíveis na loja',
      icon: 'pi pi-box',
      iconColor: 'var(--p-blue-500)',
    };
  }

  static createUsersStat(count: number): DashboardStats {
    return {
      title: 'Total de Usuários',
      value: count,
      description: 'Usuários cadastrados',
      icon: 'pi pi-users',
      iconColor: 'var(--p-green-500)',
    };
  }

  static createCartsStat(count: number): DashboardStats {
    return {
      title: 'Carrinhos Ativos',
      value: count,
      description: 'Carrinhos com produtos',
      icon: 'pi pi-shopping-cart',
      iconColor: 'var(--p-orange-500)',
    };
  }

  static createRevenueStat(revenue: number): DashboardStats {
    return {
      title: 'Receita Estimada',
      value: formatCurrency(revenue),
      description: 'Baseada no valor dos produtos',
      icon: 'pi pi-dollar',
      iconColor: 'var(--p-purple-500)',
    };
  }

  static createAveragePriceStat(averagePrice: number): DashboardStats {
    return {
      title: 'Preço Médio',
      value: formatCurrency(averagePrice),
      description: 'Preço médio dos produtos',
      icon: 'pi pi-tag',
      iconColor: 'var(--p-teal-500)',
    };
  }

  static createCategoriesStat(count: number): DashboardStats {
    return {
      title: 'Categorias',
      value: count,
      description: 'Categorias de produtos',
      icon: 'pi pi-list',
      iconColor: 'var(--p-indigo-500)',
    };
  }
}
