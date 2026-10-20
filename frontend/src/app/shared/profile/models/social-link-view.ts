import { BRAND_ICONS, BrandIcon, BrandIconSlug } from '../../ui/brand-icons';
import { SocialLink, SocialNetwork } from './profile.model';

const NETWORK_ICONS: Record<SocialNetwork, BrandIconSlug> = {
  linkedin: 'linkedin',
  github: 'github',
  gitlab: 'gitlab',
  youtube: 'youtube',
  tiktok: 'tiktok',
  facebook: 'facebook',
  instagram: 'instagram',
  snapchat: 'snapchat',
  email: 'gmail',
};

/** Ce dont un composant a besoin pour afficher un lien social (icônes rondes, tuiles de contact). */
export interface SocialLinkView {
  network: SocialNetwork;
  href: string;
  external: boolean;
  /** Nom accessible du lien, ex. « LinkedIn (nouvel onglet) ». */
  labelKey: string;
  /** Nom affiché du réseau, ex. « LinkedIn » ou « E-mail ». */
  nameKey: string;
  icon: BrandIcon;
}

/** Garde les réseaux renseignés (URL non vide), dans l'ordre des données, éventuellement filtrés. */
export function toSocialLinkViews(
  links: SocialLink[],
  only?: readonly SocialNetwork[],
): SocialLinkView[] {
  return links
    .filter((link) => link.url.trim() !== '')
    .filter((link) => !only || only.includes(link.network))
    .map((link) => {
      const isEmail = link.network === 'email';
      return {
        network: link.network,
        href: isEmail ? `mailto:${link.url}` : link.url,
        external: !isEmail,
        labelKey: `social.${link.network}`,
        nameKey: `social.names.${link.network}`,
        icon: BRAND_ICONS[NETWORK_ICONS[link.network]],
      };
    });
}
