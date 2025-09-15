import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardStats } from '@app/domain/model/dashboard';
import { DashboardStatCardComponent } from './dashboard-stat-card.component';

describe('DashboardStatCardComponent', () => {
  let component: DashboardStatCardComponent;
  let fixture: ComponentFixture<DashboardStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStatCardComponent);
    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve aceitar valores de entrada', () => {
    const mockStat: DashboardStats = {
      title: 'Teste',
      value: 100,
      description: 'Descrição teste',
      icon: 'pi-chart',
      iconColor: 'blue',
    };

    component.stat = mockStat;
    component.icon = 'pi-chart';
    component.iconColor = 'blue';

    expect(component.stat).toBe(mockStat);
    expect(component.icon).toBe('pi-chart');
    expect(component.iconColor).toBe('blue');
  });

  it('deve ter propriedades obrigatórias', () => {
    expect('stat' in component).toBeTruthy();
    expect('icon' in component).toBeTruthy();
    expect('iconColor' in component).toBeTruthy();
  });
});
