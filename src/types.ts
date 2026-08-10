export type LangCode = 'en' | 'fr' | 'es' | 'ar';


export interface TranslationDetails {
  title: string;
  subtitle: string;
  [key: string]: any;
}

export type Translations = Partial<Record<LangCode, TranslationDetails>>;
