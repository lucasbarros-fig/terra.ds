import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { INTRODUCTION_HTML } from './introduction.content';

@Component({
  selector: 'lib-introduction',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="pds-intro-root" [innerHTML]="content"></div>`,
  styles: [
    `
      .pds-intro {
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        color: var(--color-text-essential-body);
        background: var(--color-theme-base);
        max-width: 900px;
        margin: 0 auto;
        padding: var(--size-spacing-16);
        box-sizing: border-box;
      }
      @media (min-width: 480px) {
        .pds-intro {
          padding: var(--size-spacing-24);
        }
      }
      @media (min-width: 768px) {
        .pds-intro {
          padding: var(--size-spacing-32);
        }
      }
      @media (min-width: 1025px) {
        .pds-intro {
          padding: 40px;
        }
      }

      .pds-intro section {
        margin-bottom: var(--size-spacing-32);
        padding-bottom: var(--size-spacing-32);
        border-bottom: var(--size-stoke-1) solid var(--color-stroke-frame);
      }
      .pds-intro section:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
      }

      .pds-intro h1 {
        font-size: var(--size-font-heading-32, 32px);
        color: var(--color-text-essential-heading);
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 var(--size-spacing-8);
      }
      .pds-intro h2 {
        font-size: var(--size-font-heading-24, 24px);
        color: var(--color-text-essential-heading);
        font-weight: 700;
        line-height: 1.3;
        margin: 0 0 var(--size-spacing-16);
      }
      .pds-intro h3 {
        font-size: var(--size-font-heading-20, 20px);
        color: var(--color-text-essential-heading);
        font-weight: 600;
        line-height: 1.4;
        margin: 0 0 var(--size-spacing-8);
      }
      .pds-intro p,
      .pds-intro li {
        font-size: var(--size-font-body-16, 16px);
        line-height: 1.6;
      }
      .pds-intro code {
        font-family: 'Source Code Pro', 'Courier New', monospace;
        font-size: 0.9em;
        background: var(--color-theme-upper);
        padding: 1px 5px;
        border-radius: var(--size-radius-4);
      }

      .pds-cards {
        list-style: none;
        margin: var(--size-spacing-16) 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-spacing-16);
      }
      .pds-card {
        background: var(--color-theme-lower);
        border: var(--size-stoke-1) solid var(--color-stroke-frame);
        border-radius: var(--size-radius-8);
        padding: var(--size-spacing-16);
        box-sizing: border-box;
        flex: 1 1 100%;
      }
      @media (prefers-reduced-motion: no-preference) {
        .pds-card {
          transition: border-color 0.2s ease-out;
        }
      }
      .pds-card:hover {
        border-color: var(--color-branding-surface-primary-base);
      }
      @media (min-width: 480px) {
        .pds-card {
          flex: 1 1 calc(50% - var(--size-spacing-8));
        }
      }
      @media (min-width: 1025px) {
        .pds-card {
          flex: 1 1 calc(25% - var(--size-spacing-12));
        }
      }
      .pds-card h3 {
        font-size: var(--size-font-body-16, 16px);
        margin: 0 0 var(--size-spacing-4);
      }
      .pds-card p {
        font-size: var(--size-font-body-14, 14px);
        color: var(--color-text-essential-body);
        margin: 0;
      }

      .pds-packages {
        list-style: none;
        margin: var(--size-spacing-8) 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--size-spacing-8);
      }
      .pds-pkg-item {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--size-spacing-8);
        padding: var(--size-spacing-12) var(--size-spacing-16);
        background: var(--color-theme-lower);
        border: var(--size-stoke-1) solid var(--color-stroke-frame);
        border-radius: var(--size-radius-8);
      }
      .pds-pkg-name {
        font-family: 'Source Code Pro', monospace;
        font-size: var(--size-font-body-14, 14px);
        font-weight: 600;
        color: var(--color-text-essential-heading);
        flex: 1 1 auto;
      }
      .pds-badge {
        display: inline-block;
        background: var(--color-branding-surface-primary-base);
        color: #fff;
        border-radius: var(--size-radius-999);
        padding: 2px 10px;
        font-size: var(--size-font-body-12, 12px);
        font-weight: 600;
        white-space: nowrap;
      }
      .pds-pkg-link {
        color: var(--color-branding-surface-primary-base);
        font-size: var(--size-font-body-12, 12px);
        text-decoration: none;
      }
      .pds-pkg-link:hover {
        text-decoration: underline;
      }

      .pds-code-block {
        position: relative;
        background: var(--color-theme-upper);
        border: var(--size-stoke-1) solid var(--color-stroke-frame);
        border-radius: var(--size-radius-4);
        margin: var(--size-spacing-4) 0 var(--size-spacing-16);
        overflow: hidden;
      }
      .pds-code-block pre {
        margin: 0;
        padding: var(--size-spacing-16);
        padding-right: 80px;
        overflow-x: auto;
      }
      .pds-code-block code {
        font-family: 'Source Code Pro', 'Courier New', monospace;
        font-size: var(--size-font-body-14, 14px);
        color: var(--color-text-essential-body);
        background: transparent;
        padding: 0;
        white-space: pre;
        line-height: 1.6;
      }
      .pds-copy-btn {
        position: absolute;
        top: var(--size-spacing-8);
        right: var(--size-spacing-8);
        background: var(--color-theme-lower);
        border: var(--size-stoke-1) solid var(--color-stroke-frame);
        border-radius: var(--size-radius-4);
        color: var(--color-text-essential-caption);
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        font-size: var(--size-font-body-12, 12px);
        padding: 4px 10px;
        cursor: pointer;
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .pds-copy-btn:hover {
        background: var(--color-branding-surface-primary-base);
        color: #fff;
        border-color: var(--color-branding-surface-primary-base);
      }
      .pds-copy-btn:focus-visible {
        outline: 2px solid var(--color-branding-surface-primary-base);
        outline-offset: 2px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .pds-copy-btn {
          transition:
            background 0.2s ease-out,
            color 0.2s ease-out,
            border-color 0.2s ease-out;
        }
      }
      .pds-code-label {
        font-size: var(--size-font-body-14, 14px);
        color: var(--color-text-essential-caption);
        margin: var(--size-spacing-16) 0 var(--size-spacing-4);
      }
      .pds-subsection-title {
        font-size: var(--size-font-body-16, 16px);
        font-weight: 600;
        color: var(--color-text-essential-heading);
        margin: var(--size-spacing-16) 0 var(--size-spacing-8);
      }

      .pds-table-wrapper {
        overflow-x: auto;
      }
      .pds-table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--size-font-body-14, 14px);
      }
      .pds-table th,
      .pds-table td {
        text-align: left;
        padding: var(--size-spacing-12) var(--size-spacing-16);
        border-bottom: var(--size-stoke-1) solid var(--color-stroke-frame);
      }
      .pds-table thead th {
        color: var(--color-text-essential-caption);
        font-size: var(--size-font-body-12, 12px);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: var(--color-theme-lower);
      }
      .pds-table tbody tr:nth-child(even) {
        background: var(--color-theme-lower);
      }
      .pds-table tbody th {
        font-family: 'Source Code Pro', monospace;
        color: var(--color-text-essential-body);
        font-weight: 400;
      }
      .pds-table td {
        color: var(--color-text-essential-caption);
      }

      .pds-license-link {
        color: var(--color-branding-surface-primary-base);
      }
    `,
  ],
})
export class IntroductionComponent implements AfterViewInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly content: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
    INTRODUCTION_HTML,
  );

  private readonly onCopyClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (!target.classList.contains('pds-copy-btn')) {
      return;
    }
    this.copyCode(target);
  };

  ngAfterViewInit(): void {
    this.host.nativeElement.addEventListener('click', this.onCopyClick);
  }

  ngOnDestroy(): void {
    this.host.nativeElement.removeEventListener('click', this.onCopyClick);
  }

  private copyCode(btn: HTMLButtonElement): void {
    const block = btn.closest('.pds-code-block');
    const code = block?.querySelector('code')?.textContent?.trim();

    if (!code || !navigator.clipboard || !window.isSecureContext) {
      btn.hidden = true;
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        btn.textContent = 'Copiado!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Copiar';
          btn.disabled = false;
        }, 2000);
      })
      .catch(() => {
        btn.hidden = true;
      });
  }
}
