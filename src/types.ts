export type LangCode = 'en' | 'fr' | 'es';

export interface TranslationDetails {
  title: string;
  subtitle: string;
  [key: string]: any;
}

export type Translations = Record<LangCode, TranslationDetails>;
