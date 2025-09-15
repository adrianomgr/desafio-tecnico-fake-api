import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanComponentDeactivate, canDeactivateGuard } from './can-deactivate.guard';

describe('canDeactivateGuard', () => {
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({});
  });

  it('deve permitir desativação quando componente retorna true', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true),
    };

    const result = TestBed.runInInjectionContext(() =>
      canDeactivateGuard(component, route, state, state)
    );

    expect(result).toBe(true);
    expect(component.canDeactivate).toHaveBeenCalled();
  });

  it('deve bloquear desativação quando componente retorna false', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(false),
    };

    const result = TestBed.runInInjectionContext(() =>
      canDeactivateGuard(component, route, state, state)
    );

    expect(result).toBe(false);
    expect(component.canDeactivate).toHaveBeenCalled();
  });

  it('deve permitir desativação quando componente não tem método canDeactivate', () => {
    const component = {} as CanComponentDeactivate;

    const result = TestBed.runInInjectionContext(() =>
      canDeactivateGuard(component, route, state, state)
    );

    expect(result).toBe(true);
  });

  it('deve lidar com Promise retornada pelo componente', async () => {
    const component: CanComponentDeactivate = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(Promise.resolve(true)),
    };

    const result = TestBed.runInInjectionContext(() =>
      canDeactivateGuard(component, route, state, state)
    );

    expect(result).toBeInstanceOf(Promise);
    const resolvedResult = await (result as Promise<boolean>);
    expect(resolvedResult).toBe(true);
    expect(component.canDeactivate).toHaveBeenCalled();
  });
});
