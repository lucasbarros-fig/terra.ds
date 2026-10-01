import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { EmbedComponent } from './app/embed.component';

bootstrapApplication(EmbedComponent, {
  providers: [provideZonelessChangeDetection(), provideRouter([], withDisabledInitialNavigation())],
}).catch((err) => console.error(err));
