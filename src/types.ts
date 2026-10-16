export type Language = 'fa' | 'en';
export type Category = 'hot' | 'cold' | 'signature' | 'tea' | 'dessert' | 'breakfast';
export interface Product {
  id: string; slug: string; nameFa: string; nameEn: string;
  descriptionFa: string; descriptionEn: string; price: number;
  category: Category; image: string; available: boolean; featured: boolean;
  tags: string[]; ingredientsFa: string; ingredientsEn: string;
}
