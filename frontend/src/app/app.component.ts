import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './translation.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = $localize`:@@Hello:Hello`;
  ninetyNine: string = $localize`:@@ninety-nine:ninety-nine`;
  private languageChangedSubscription: Subscription;

  constructor(protected translationService: TranslationService) {
    this.languageChangedSubscription =
      this.translationService.languageChanged$.subscribe({
        next: (newLanguage) => {
          console.log('Language changed to:', newLanguage);
          this.title = $localize`:@@Hello:Hello`;
          this.ninetyNine = $localize`:@@ninety-nine:ninety-nine`;
        },
        error: (err) => console.error('Language change error:', err),
        complete: () => console.log('Langauge change completed'),
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.languageChangedSubscription.unsubscribe();
  }
}
