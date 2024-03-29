import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { loadTranslations } from '@angular/localize';
import { routes } from './app.routes';

async function fetchAndMergeTranslations(language: string): Promise<any> {
  const baseLang = language.split('_')[0];
  let translations = {};

  try {
    if (language.includes('_')) {
      const baseResponse = await fetch(
        `${environment.apiBaseUrl}/translations/${baseLang}`,
      );
      translations = await baseResponse.json();
    }

    const langResponse = await fetch(
      `${environment.apiBaseUrl}/translations/${language}`,
    );
    const langTranslations = await langResponse.json();

    translations = { ...translations, ...langTranslations };
  } catch (error) {
    console.error('Error fetching translations:', error);
  }

  return translations;
}

async function initializeLanguage(): Promise<void> {
  const language = localStorage.getItem('language') || 'en';
  if (language && language !== 'en') {
    const translations = await fetchAndMergeTranslations(language);
    loadTranslations(translations);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeLanguage,
      multi: true,
    },
  ],
};
