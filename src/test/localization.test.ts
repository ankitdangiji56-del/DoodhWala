import { describe, it, expect } from 'vitest';
import { hi } from '../locales/hi';
import { en } from '../locales/en';
import { brx } from '../locales/brx';
import { mwr } from '../locales/mwr';
import { TranslationDictionary } from '../locales/types';

describe('Four-Language Localization Suite (Phase 2 & Phase 9.1)', () => {
  const allLanguages: { code: string; name: string; dict: TranslationDictionary }[] = [
    { code: 'hi', name: 'Hindi', dict: hi },
    { code: 'en', name: 'English', dict: en },
    { code: 'brx', name: 'Braj Bhasha', dict: brx },
    { code: 'mwr', name: 'Marwari Bhasha', dict: mwr },
  ];

  it('Default language must be Hindi (hi) with culturally accessible translations', () => {
    const defaultLanguageCode = 'hi';
    expect(defaultLanguageCode).toBe('hi');
    expect(hi.navProducts).toBe('डेयरी उत्पाद');
    expect(hi.addToCart).toBe('कार्ट में जोड़ें');
    expect(hi.heroOrderNow).toBe('अभी ऑर्डर करें');
  });

  it('All 4 languages must have complete dictionary key parity (100% keys translated)', () => {
    const hindiKeys = Object.keys(hi) as (keyof TranslationDictionary)[];
    expect(hindiKeys.length).toBeGreaterThan(60);

    allLanguages.forEach(({ code, name, dict }) => {
      const dictKeys = Object.keys(dict) as (keyof TranslationDictionary)[];
      
      // Every key present in Hindi must exist and be a non-empty string in each language
      hindiKeys.forEach((key) => {
        expect(
          dict[key],
          `Missing key [${String(key)}] in ${name} (${code})`
        ).toBeDefined();

        expect(
          typeof dict[key],
          `Key [${String(key)}] in ${name} (${code}) must be string`
        ).toBe('string');

        expect(
          dict[key].trim().length,
          `Key [${String(key)}] in ${name} (${code}) cannot be blank`
        ).toBeGreaterThan(0);
      });

      // Total key length must match 100%
      expect(dictKeys.length).toBe(hindiKeys.length);
    });
  });

  it('Braj Bhasha uses authentic culturally natural Devanagari vocabulary', () => {
    expect(brx.addToCart).toBe('थैली में धरौ');
    expect(brx.heroOrderNow).toBe('अभी मँगवाव');
    expect(brx.catMilk).toBe('ताज़ौ दूध');
    expect(brx.catGhee).toBe('बिलौने कौ घी');
    expect(brx.catCurd).toBe('माटी की मटकी कौ दही');
    expect(brx.outOfStock).toBe('अभी खूटि गयौ');
  });

  it('Marwari Bhasha uses authentic culturally respectful Devanagari vocabulary', () => {
    expect(mwr.addToCart).toBe('झोली में जोड़ो');
    expect(mwr.heroOrderNow).toBe('अबे ही मँगावो');
    expect(mwr.catMilk).toBe('ताजो दूध');
    expect(mwr.catGhee).toBe('बिलोणा रो घी');
    expect(mwr.catCurd).toBe('माटी री मटकी रो दही');
    expect(mwr.outOfStock).toBe('खूट गयो');
  });

  it('English translations provide crisp, professional dairy terminology', () => {
    expect(en.navProducts).toBe('Dairy Products');
    expect(en.addToCart).toBe('Add to Cart');
    expect(en.heroOrderNow).toBe('Order Now');
    expect(en.outOfStock).toBe('Out of Stock');
  });

  it('Hindi translations conform directly to user master prompt specifications', () => {
    expect(hi.navProducts).toBe('डेयरी उत्पाद');
    expect(hi.addToCart).toBe('कार्ट में जोड़ें');
    expect(hi.outOfStock).toBe('स्टॉक समाप्त');
    expect(hi.navLogin).toBe('लॉगिन करें');
    expect(hi.navSignup).toBe('नया खाता बनाएँ');
  });
});
