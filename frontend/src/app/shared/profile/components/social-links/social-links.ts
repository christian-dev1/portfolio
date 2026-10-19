import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BrandIcon } from '../../../ui/brand-icon/brand-icon';
import { BRAND_ICONS, BrandIconSlug } from '../../../ui/brand-icons';
import { SocialLink, SocialNetwork } from '../../models/profile.model';

const NETWORK_ICONS: Record<SocialNetwork, BrandIconSlug> = {
  github: 'github',
  gitlab: 'gitlab',
  linkedin: 'linkedin',
  facebook: 'facebook',
  youtube: 'youtube',
  tiktok: 'tiktok',
  email: 'gmail',
};

/** Logos ronds des réseaux, posés sur un aplat de marque (zone bleue, footer). */
@Component({
  selector: 'app-social-links',
  imports: [TranslocoPipe, BrandIcon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  readonly links = input.required<SocialLink[]>();

  /** Un réseau sans URL n'est pas affiché. */
  protected readonly items = computed(() =>
    this.links()
      .filter((link) => link.url.trim() !== '')
      .map((link) => {
        const isEmail = link.network === 'email';
        return {
          network: link.network,
          href: isEmail ? `mailto:${link.url}` : link.url,
          external: !isEmail,
          labelKey: `social.${link.network}`,
          icon: BRAND_ICONS[NETWORK_ICONS[link.network]],
        };
      }),
  );
}
