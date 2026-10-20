import { LocalizedText } from '../../i18n/localized-text';

export interface ContactPhone {
  /** Format international, ex. « +237 600 00 00 00 ». */
  number: string;
  label: LocalizedText;
}

/**
 * Coordonnées personnelles, jamais commitées : lues depuis `/config/contact.json`,
 * généré au démarrage du conteneur à partir de variables d'environnement.
 */
export interface ContactConfig {
  /** Numéro WhatsApp en chiffres seulement (indicatif pays inclus), ou vide. */
  whatsapp: string;
  phones: ContactPhone[];
}

export const EMPTY_CONTACT_CONFIG: ContactConfig = { whatsapp: '', phones: [] };

/** Indicatif pays + numéro : 8 à 15 chiffres (norme E.164). */
export const WHATSAPP_NUMBER = /^\d{8,15}$/;
/** « + » puis chiffres, espaces autorisés entre les groupes. */
export const INTERNATIONAL_PHONE = /^\+\d{1,3}( ?\d){6,14}$/;

function isLocalizedText(value: unknown): value is LocalizedText {
  const text = value as Partial<LocalizedText> | null;
  return typeof text?.fr === 'string' && typeof text.en === 'string' && !!text.fr && !!text.en;
}

function isContactPhone(value: unknown): value is ContactPhone {
  const phone = value as Partial<ContactPhone> | null;
  return (
    typeof phone?.number === 'string' &&
    INTERNATIONAL_PHONE.test(phone.number) &&
    isLocalizedText(phone.label)
  );
}

/** Garde uniquement ce qui est valide ; tout le reste est ignoré (jamais d'erreur affichée). */
export function toContactConfig(raw: unknown): ContactConfig {
  const data = raw as { whatsapp?: unknown; phones?: unknown } | null;
  const whatsapp =
    typeof data?.whatsapp === 'string' && WHATSAPP_NUMBER.test(data.whatsapp) ? data.whatsapp : '';
  const phones = Array.isArray(data?.phones) ? data.phones.filter(isContactPhone) : [];
  return { whatsapp, phones };
}
