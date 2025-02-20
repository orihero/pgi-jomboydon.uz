export interface Product {
  id: number;
  name: string;
  name_ru: string;
  name_uz: string;
  description?: string;
  description_ru?: string;
  description_uz?: string;
  price: number;
  imageUrl?: string;
  category: string;
  category_ru: string;
  category_uz: string;
} 