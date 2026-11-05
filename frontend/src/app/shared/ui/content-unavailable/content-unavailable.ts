import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentRetry } from './loadable';

/** Bloc affiché à la place d'un contenu de l'API qui n'a pas pu être chargé. */
@Component({
  selector: 'app-content-unavailable',
  imports: [TranslocoPipe],
  templateUrl: './content-unavailable.html',
  styleUrl: './content-unavailable.scss',
})
export class ContentUnavailable {
  private readonly contentRetry = inject(ContentRetry);

  protected retry(): void {
    this.contentRetry.retry();
  }
}
