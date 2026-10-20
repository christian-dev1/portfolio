import { Component, DOCUMENT, DestroyRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { WhatsappButton } from '../../../../shared/contact-config/components/whatsapp-button/whatsapp-button';
import { ContactConfigService } from '../../../../shared/contact-config/data-access/contact-config.service';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { toSocialLinkViews } from '../../../../shared/profile/models/social-link-view';
import { BrandIcon } from '../../../../shared/ui/brand-icon/brand-icon';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { Stagger } from '../../../../shared/ui/stagger/stagger';
import { ContactForm } from '../../components/contact-form/contact-form';

type CopyState = 'idle' | 'copied' | 'failed';

/** Durée d'affichage du retour « Copié » / « Copie impossible ». */
const FEEDBACK_DURATION_MS = 4000;

@Component({
  selector: 'app-contact-page',
  imports: [TranslocoPipe, PageBanner, BrandIcon, WhatsappButton, Stagger, ContactForm],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly document = inject(DOCUMENT);
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  protected readonly profile = toSignal(inject(ProfileService).getProfile());
  /** Numéro WhatsApp hors Git ; le bloc est masqué si la configuration est vide. */
  protected readonly contactConfig = toSignal(inject(ContactConfigService).getContactConfig());
  protected readonly networks = computed(() => {
    const profile = this.profile();
    return profile ? toSocialLinkViews(profile.socialLinks) : undefined;
  });
  protected readonly email = computed(
    () =>
      this.profile()
        ?.socialLinks.find((link) => link.network === 'email')
        ?.url.trim() ?? '',
  );
  protected readonly copyState = signal<CopyState>('idle');

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.feedbackTimer));
  }

  /**
   * Appelée directement dans le clic : le navigateur n'autorise l'écriture dans le
   * presse-papiers qu'en réponse à une action de l'utilisateur.
   */
  protected async copyEmail(address: HTMLElement): Promise<void> {
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) {
        throw new Error('Clipboard API unavailable');
      }
      await clipboard.writeText(this.email());
      this.showFeedback('copied');
    } catch {
      // Repli : on sélectionne l'adresse pour que le visiteur la copie lui-même (Ctrl+C).
      this.selectText(address);
      this.showFeedback('failed');
    }
  }

  private showFeedback(state: CopyState): void {
    this.copyState.set(state);
    clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => this.copyState.set('idle'), FEEDBACK_DURATION_MS);
  }

  private selectText(element: HTMLElement): void {
    const selection = this.document.getSelection();
    const range = this.document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}
