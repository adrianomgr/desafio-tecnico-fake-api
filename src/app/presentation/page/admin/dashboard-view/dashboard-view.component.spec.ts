import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { DashboardStats } from '@app/domain/model/dashboard';
import { of } from 'rxjs';
import { DashboardViewComponent } from './dashboard-view.component';

describe('DashboardViewComponent', () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;
  let dashboardFacadeSpy: jasmine.SpyObj<DashboardFacadeService>;

  const mockDashboardStats: DashboardStats[] = [
    {
      title: 'Total Usuários',
      value: 10,
      icon: 'pi pi-users',
      description: 'Usuários registrados',
      iconColor: 'danger',
    },
    {
      title: 'Total Produtos',
      value: 25,
      icon: 'pi pi-box',
      description: 'Produtos cadastrados',
      iconColor: 'success',
    },
  ];

  beforeEach(async () => {
    dashboardFacadeSpy = jasmine.createSpyObj('DashboardFacadeService', ['refreshDashboardStats'], {
      dashboardStats$: of(mockDashboardStats),
      loading$: of(false),
      countdown$: of(60),
    });

    await TestBed.configureTestingModule({
      imports: [DashboardViewComponent],
      providers: [{ provide: DashboardFacadeService, useValue: dashboardFacadeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter observables definidos', () => {
    expect(component.dashboardStats$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.countdown$).toBeDefined();
  });

  it('deve inicializar observables no construtor', () => {
    expect(component.dashboardStats$).toBe(dashboardFacadeSpy.dashboardStats$);
    expect(component.loading$).toBe(dashboardFacadeSpy.loading$);
    expect(component.countdown$).toBe(dashboardFacadeSpy.countdown$);
  });

  it('deve chamar refreshDashboardStats', () => {
    component.refreshStats();

    expect(dashboardFacadeSpy.refreshDashboardStats).toHaveBeenCalled();
  });

  it('deve formatar countdown corretamente - 1 minuto', () => {
    const formatted = component.formatCountdown(60);

    expect(formatted).toBe('01:00');
  });

  it('deve formatar countdown corretamente - 30 segundos', () => {
    const formatted = component.formatCountdown(30);

    expect(formatted).toBe('00:30');
  });

  it('deve formatar countdown corretamente - 2 minutos e 15 segundos', () => {
    const formatted = component.formatCountdown(135);

    expect(formatted).toBe('02:15');
  });

  it('deve formatar countdown corretamente - 0 segundos', () => {
    const formatted = component.formatCountdown(0);

    expect(formatted).toBe('00:00');
  });

  it('deve formatar countdown corretamente - 10 minutos e 5 segundos', () => {
    const formatted = component.formatCountdown(605);

    expect(formatted).toBe('10:05');
  });

  it('deve executar ngOnDestroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('deve receber dados dos observables', (done) => {
    component.dashboardStats$.subscribe((stats) => {
      expect(stats).toEqual(mockDashboardStats);
      done();
    });
  });

  it('deve receber estado de loading', (done) => {
    component.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('deve receber countdown', (done) => {
    component.countdown$.subscribe((countdown) => {
      expect(countdown).toBe(60);
      done();
    });
  });
});
