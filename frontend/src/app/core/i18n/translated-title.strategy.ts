import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, switchMap } from 'rxjs';

/**
 * Les routes déclarent une clé de traduction (`title: 'titles.home'`) au lieu d'un texte.
 * Cette stratégie traduit la clé et remet le titre à jour à chaque changement de langue.
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private readonly titleKeys = new Subject<string>();

  constructor() {
    super();
    this.titleKeys
      .pipe(
        // selectTranslate ré-émet à chaque changement de langue ;
        // switchMap abandonne l'ancienne clé quand on change de page.
        switchMap((key) => this.transloco.selectTranslate<string>(key)),
        takeUntilDestroyed(),
      )
      .subscribe((translated) => this.title.setTitle(translated));
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    if (key !== undefined) {
      this.titleKeys.next(key);
    }
  }
}
