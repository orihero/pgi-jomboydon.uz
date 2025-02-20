import { Dictionary } from './dictionaries/types';
import { Language } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en').then((module) => module.dictionary),
  ru: () => import('./dictionaries/ru').then((module) => module.dictionary),
  uz: () => import('./dictionaries/uz').then((module) => module.dictionary),
};

export const getDictionary = async (locale: Language): Promise<Dictionary> => {
  return dictionaries[locale]();
}; 