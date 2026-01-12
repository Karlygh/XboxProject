export interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  year?: number;
  players?: string;
  trailer?: string;
  developer?: string;
  platforms?: string[];
  price?: number;
  longDescription?: string;
}