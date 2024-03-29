import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { forkJoin, map, shareReplay, Subject } from 'rxjs';
import { loadTranslations } from '@angular/localize';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _language: string = localStorage.getItem('language') || 'en';
  private languageChangeSubject = new Subject<string>();
  public languageChanged$ = this.languageChangeSubject.asObservable();

  constructor(private http: HttpClient) {}

  languages$ = this.http.get<any>(`${environment.apiBaseUrl}/languages`).pipe(
    map((response) => response),
    shareReplay(1),
  );

  updateLanguage(language: string) {
    this.language = language;
  }

  private fetchTranslations(lang: string) {
    return this.http.get(`${environment.apiBaseUrl}/translations/${lang}`);
  }

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    if (value !== this._language) {
      this._language = value;
      localStorage.setItem('language', value);
      const baseLang = value.split('_')[0];
      const requests = [this.fetchTranslations(baseLang)];
      if (value.includes('_')) {
        requests.push(this.fetchTranslations(value));
      }
      forkJoin(requests)
        .pipe(
          map((translationsArray) => {
            return translationsArray.reduce((acc, current) => {
              return { ...acc, ...current };
            }, {});
          }),
        )
        .subscribe((mergedTranslations: any) => {
          loadTranslations(mergedTranslations);
          this.languageChangeSubject.next(value);
        });
    }
  }
}
