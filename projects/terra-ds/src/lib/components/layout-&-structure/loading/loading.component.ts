import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import {
  LOADING_TEXT_ANIMATION,
  ANIMATION_STEP_INTERVAL,
  LOADING_LOGO_ANIMATION,
} from './animation';
import { getResolvedLogoSrc, preloadLogoUrls } from './logo-object-url-cache';
import { IconComponent } from '../icon/icon.component';

interface TextRow { id: number; text: string }
interface CarouselItem { id: number; value: string; phase: number }

@Component({
  selector: 'lib-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
  animations: [
    LOADING_TEXT_ANIMATION,
    LOADING_LOGO_ANIMATION,
  ],
  imports: [
    NgFor,
    NgIf,
    IconComponent,
  ],
})
export class LoadingComponent implements OnInit {
  @Input({ required: false }) texts: string[] = [];
  @Input({ required: false }) logos: string[] = [];
  @Input({ required: false }) icons: string[] = [];
  @Input({ required: false }) active = true;

  protected currentItems: CarouselItem[] = [];
  protected textRows: TextRow[] = [];
  protected isIconMode = false;

  private sourceItems: string[] = [];
  private itemIndex = 0;
  private itemCounter = 0;
  private textStep = 0;

  ngOnInit(): void {
    this.start();
  }

  protected trackByItemId(_i: number, item: CarouselItem): number {
    return item.id;
  }

  protected trackByTextKey(_i: number, text: TextRow): number {
    return text.id;
  }

  private async start() {
    this.sourceItems = this.logos.length ? this.logos : this.icons;
    this.isIconMode = !this.logos.length && this.icons.length > 0;

    if (!this.sourceItems.length) return;

    if (this.logos.length) {
      await preloadLogoUrls(this.logos);
    }

    this.populateItems();
    this.setTextStep(0);
    setInterval(() => this.next(), ANIMATION_STEP_INTERVAL);
  }

  private next() {
    this.advanceItem();
    this.nextTextStep();
  }

  private populateItems(): void {
    for (let i = 0; i < 5; i++) {
      this.advanceItem();
    }
  }

  private advanceItem(): void {
    const raw = this.sourceItems[this.itemIndex % this.sourceItems.length];
    const value =
      this.logos.length > 0 ? getResolvedLogoSrc(raw) : raw;
    const newItem: CarouselItem = { id: this.itemCounter++, value, phase: 0 };
    this.currentItems = [
      newItem,
      ...this.currentItems
        .map(item => ({ ...item, phase: item.phase + 1 }))
        .filter(item => item.phase < 5),
    ];
    this.itemIndex++;
  }

  private nextTextStep() {
    const next = this.textStep + 1;
    this.setTextStep(next >= this.texts.length ? 0 : next);
  }

  private setTextStep(step: number): void {
    this.textStep = step;
    this.textRows = [{ id: step, text: this.texts[step] ?? '' }];
  }
}
