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
  /** PDF public du CV par langue, déposé sur le serveur au déploiement ; vide = bouton masqué. */
  cvPdf: LocalizedText;
  /** Clé d'accès Web3Forms (UUID) ; vide = formulaire de contact masqué. */
  web3formsAccessKey: string;
}

export const EMPTY_CONTACT_CONFIG: ContactConfig = {
  whatsapp: '',
  phones: [],
  cvPdf: { fr: '', en: '' },
  web3formsAccessKey: '',
};

/** Indicatif pays + numéro : 8 à 15 chiffres (norme E.164). */
export const WHATSAPP_NUMBER = /^\d{8,15}$/;
/** « + » puis chiffres, espaces autorisés entre les groupes. */
export const INTERNATIONAL_PHONE = /^\+\d{1,3}( ?\d){6,14}$/;
/** Chemin absolu servi par le site, terminé par « .pdf ». */
export const LOCAL_PDF_PATH = /^\/[\w./-]+\.pdf$/;
/** UUID au format 8-4-4-4-12 (chiffres hexadécimaux). */
export const UUID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

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
  const data = raw as {
    whatsapp?: unknown;
    phones?: unknown;
    cvPdf?: { fr?: unknown; en?: unknown } | null;
    web3formsAccessKey?: unknown;
  } | null;
  const valid = (value: unknown, pattern: RegExp) =>
    typeof value === 'string' && pattern.test(value) ? value : '';
  return {
    whatsapp: valid(data?.whatsapp, WHATSAPP_NUMBER),
    phones: Array.isArray(data?.phones) ? data.phones.filter(isContactPhone) : [],
    cvPdf: {
      fr: valid(data?.cvPdf?.fr, LOCAL_PDF_PATH),
      en: valid(data?.cvPdf?.en, LOCAL_PDF_PATH),
    },
    web3formsAccessKey: valid(data?.web3formsAccessKey, UUID),
  };
}
