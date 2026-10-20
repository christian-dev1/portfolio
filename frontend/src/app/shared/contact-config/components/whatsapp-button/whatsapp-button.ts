import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BrandIcon } from '../../../ui/brand-icon/brand-icon';
import { BRAND_ICONS } from '../../../ui/brand-icons';

/** Bouton « WhatsApp » au logo officiel ; le numéro n'apparaît jamais en texte. */
@Component({
  selector: 'app-whatsapp-button',
  imports: [TranslocoPipe, BrandIcon],
  template: `
    <a
      class="button whatsapp-button"
      [class.whatsapp-button--dark-ink]="icon.inkOnHex === 'dark'"
      [style.--brand-hex]="icon.hex"
      [href]="href()"
      target="_blank"
      rel="noopener noreferrer"
      [attr.aria-label]="'contact.whatsappLabel' | transloco"
    >
      <app-brand-icon [icon]="icon" />
      {{ 'contact.whatsapp' | transloco }}
    </a>
  `,
  styles: `
    .whatsapp-button {
      gap: 0.5rem;
      background-color: var(--brand-hex);
      color: var(--color-on-brand);
    }

    .whatsapp-button--dark-ink {
      color: var(--color-brand-ink);
    }

    .whatsapp-button:hover {
      filter: brightness(0.95);
    }
  `,
})
export class WhatsappButton {
  /** Numéro en chiffres seulement, indicatif pays inclus. */
  readonly number = input.required<string>();

  protected readonly icon = BRAND_ICONS.whatsapp;
  protected readonly href = computed(() => `https://wa.me/${this.number()}`);
}
