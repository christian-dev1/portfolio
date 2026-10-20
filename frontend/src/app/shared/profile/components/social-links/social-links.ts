import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BrandIcon } from '../../../ui/brand-icon/brand-icon';
import { SocialLink, SocialNetwork } from '../../models/profile.model';
import { toSocialLinkViews } from '../../models/social-link-view';

/** Logos ronds des réseaux, posés sur un aplat de marque (zone bleue, footer). */
@Component({
  selector: 'app-social-links',
  imports: [TranslocoPipe, BrandIcon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  readonly links = input.required<SocialLink[]>();
  /** Limite l'affichage à ces réseaux (ex. la zone bleue de l'accueil) ; tous par défaut. */
  readonly only = input<readonly SocialNetwork[]>();

  /** Un réseau sans URL n'est pas affiché. */
  protected readonly items = computed(() => toSocialLinkViews(this.links(), this.only()));
}
