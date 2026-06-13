export interface Category {
  id: string; // the unique identifier for the category
  name: string; // the name of the category
  description: string; // the description of the category
  slug: string;  // the slug of the category
  imageUrl: string; // the image url of the category
  isActive: boolean; // whether or not the category is active, which is a boolean
  createdAt: string; // When was the category created?
  updatedAt: string; // When was the category last updated?
}