import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { startWith, switchMap } from 'rxjs';
import { LanguageService } from '../../../../core/i18n/language.service';
import { CvPdfService } from '../../data-access/cv-pdf.service';

/** « Télécharger mon CV » : affiché seulement si le PDF de la langue active existe vraiment. */
@Component({
  selector: 'app-cv-download-button',
  imports: [TranslocoPipe],
  template: `
    @if (url(); as url) {
      <a class="button button--secondary" [href]="url" download>
        {{ 'home.downloadCv' | transloco }}
      </a>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CvDownloadButton {
  private readonly cvPdf = inject(CvPdfService);

  protected readonly url = toSignal(
    toObservable(inject(LanguageService).lang).pipe(
      switchMap((lang) => this.cvPdf.getAvailableUrl(lang).pipe(startWith(''))),
    ),
    { initialValue: '' },
  );
}
