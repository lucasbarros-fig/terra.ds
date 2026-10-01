import { ActivatedRoute, Router } from '@angular/router';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import type { BreadcrumbItem } from './breadcrumbs.component';

interface TestableBreadcrumbs {
  displayItems: Array<BreadcrumbItem & { isEllipsis?: boolean; isCurrent?: boolean }>;
  navigateRoute(route: string | undefined): void;
  trackByItem(index: number, item: BreadcrumbItem & { isEllipsis?: boolean; isCurrent?: boolean }): string;
}

function makeItems(count: number): BreadcrumbItem[] {
  return Array.from({ length: count }, (_, i) => ({
    label: `Step ${i + 1}`,
    link: `/step-${i + 1}`,
  }));
}

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let cmp: TestableBreadcrumbs;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  const mockRouter = { navigate: vi.fn(), url: '/products/123' };
  const mockActivatedRoute = {
    snapshot: { queryParams: { tab: 'details' } },
  };

  beforeEach(() => {
    mockRouter.navigate = vi.fn();
    mockRouter.url = '/products/123';

    TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    cmp = component as unknown as TestableBreadcrumbs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayItems', () => {
    it('should return an empty array when breadcrumbItems is empty', () => {
      fixture.componentRef.setInput('breadcrumbItems', []);
      fixture.detectChanges();
      expect(cmp.displayItems).toEqual([]);
    });

    it('should return an empty array when breadcrumbItems is undefined', () => {
      fixture.componentRef.setInput('breadcrumbItems', undefined as unknown as BreadcrumbItem[]);
      fixture.detectChanges();
      expect(cmp.displayItems).toEqual([]);
    });

    describe('desktop (mobile = false)', () => {
      it('should mark the last item as current when there are 3 items (below threshold)', () => {
        const items = makeItems(3);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(3);
        expect(result[0].isCurrent).toBeUndefined();
        expect(result[1].isCurrent).toBeUndefined();
        expect(result[2].isCurrent).toBe(true);
        expect(result[2].label).toBe('Step 3');
      });

      it('should mark the last item as current when there are exactly 4 items (at threshold)', () => {
        const items = makeItems(4);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(4);
        expect(result[3].isCurrent).toBe(true);
        expect(result.some((i) => i.isEllipsis)).toBe(false);
      });

      it('should truncate with ellipsis when there are more than 4 items', () => {
        const items = makeItems(6);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(6);
        expect(result[0].label).toBe('Step 1');
        expect(result[1].label).toBe('Step 2');
        expect(result[2].label).toBe('Step 3');
        expect(result[3].label).toBe('Step 4');
        expect(result[4].isEllipsis).toBe(true);
        expect(result[4].label).toBe('...');
        expect(result[5].isCurrent).toBe(true);
        expect(result[5].label).toBe('Step 6');
      });
    });

    describe('mobile (mobile = true)', () => {
      it('should mark last as current when there are 2 items (below threshold)', () => {
        const items = makeItems(2);
        fixture.componentRef.setInput('mobile', true);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(2);
        expect(result[0].isCurrent).toBeUndefined();
        expect(result[1].isCurrent).toBe(true);
      });

      it('should mark last as current when there are exactly 3 items (at threshold)', () => {
        const items = makeItems(3);
        fixture.componentRef.setInput('mobile', true);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(3);
        expect(result[2].isCurrent).toBe(true);
        expect(result.some((i) => i.isEllipsis)).toBe(false);
      });

      it('should truncate with ellipsis when there are more than 3 items', () => {
        const items = makeItems(5);
        fixture.componentRef.setInput('mobile', true);
        fixture.componentRef.setInput('breadcrumbItems', items);
        fixture.detectChanges();

        const result = cmp.displayItems;
        expect(result).toHaveLength(3);
        expect(result[0].label).toBe('Step 1');
        expect(result[1].isEllipsis).toBe(true);
        expect(result[1].label).toBe('...');
        expect(result[2].isCurrent).toBe(true);
        expect(result[2].label).toBe('Step 5');
      });
    });
  });

  describe('navigateRoute', () => {
    it('should call router.navigate with the provided route', () => {
      cmp.navigateRoute('/dashboard');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should warn and not navigate when route is undefined', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      cmp.navigateRoute(undefined);
      expect(warnSpy).toHaveBeenCalledWith('Rota não especificada');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should navigate to current URL with query params when route contains a colon', () => {
      mockRouter.url = '/products/123?sort=asc';
      cmp.navigateRoute(':id');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/123'], {
        queryParams: { tab: 'details' },
      });
    });
  });

  describe('trackByItem', () => {
    it('should return a stable key combining label and link', () => {
      const item = { label: 'Home', link: '/home' };
      const key = cmp.trackByItem(0, item);
      expect(key).toBe('Home-/home');
    });

    it('should return a key with empty link suffix when link is missing', () => {
      const item = { label: 'Profile' };
      const key = cmp.trackByItem(1, item);
      expect(key).toBe('Profile-');
    });
  });
});
