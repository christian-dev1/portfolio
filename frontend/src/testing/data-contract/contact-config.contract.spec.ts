import example from '../../../public/config/contact.example.json';
import {
  INTERNATIONAL_PHONE,
  WHATSAPP_NUMBER,
  toContactConfig,
} from '../../app/shared/contact-config/models/contact-config.model';
import { expectLocalizedText } from './contract-helpers';

/**
 * Seul l'exemple est commité : le vrai `contact.json` est ignoré par Git
 * et généré au démarrage du conteneur à partir des variables d'environnement.
 */
describe('Data contract: config/contact.example.json', () => {
  it('should be entirely valid (nothing dropped when loaded)', () => {
    expect(toContactConfig(example)).toEqual(example);
  });

  it('should use an international WhatsApp number', () => {
    expect(example.whatsapp).toMatch(WHATSAPP_NUMBER);
  });

  it('should use international phone numbers with labels in French and English', () => {
    for (const [index, phone] of example.phones.entries()) {
      expect(phone.number, `phones[${index}].number`).toMatch(INTERNATIONAL_PHONE);
      expectLocalizedText(phone.label, `phones[${index}].label`);
    }
  });

  it('should only contain dummy numbers (zeros after the country code)', () => {
    expect(example.whatsapp).toMatch(/^2376?0+$/);
    for (const phone of example.phones) {
      expect(phone.number.replace(/\s/g, '')).toMatch(/^\+2376?0+$/);
    }
  });
});
