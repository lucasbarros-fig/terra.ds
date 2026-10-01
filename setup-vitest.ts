import '@angular/compiler';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/**
 * Angular 21 defaults TestBed to zoneless CD. This repo still uses Zone.js,
 * so tests must opt back into zone-based change detection globally.
 * Zone patching itself comes from `@analogjs/vite-plugin-angular/setup-vitest`
 * — do not import `zone.js` / `zone.js/testing` here or Vitest will double-patch.
 */
@NgModule({
  providers: [provideZoneChangeDetection()],
})
class ZoneChangeDetectionTestingModule {}

if (getTestBed().platform === null) {
  getTestBed().initTestEnvironment(
    [BrowserDynamicTestingModule, ZoneChangeDetectionTestingModule],
    platformBrowserDynamicTesting(),
  );
}
