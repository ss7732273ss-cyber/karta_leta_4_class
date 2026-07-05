export type BookStatus = 'not_started' | 'reading' | 'done';

export type BookType = 'сказка' | 'рассказ' | 'стихи' | 'повесть' | 'приключения';

export type MapZone =
  | 'Долина преданий'
  | 'Берега природы и судеб'
  | 'Перевал мужества'
  | 'Горизонты открытий';

export interface MemoryQuestion {
  id: string;
  type: 'choice' | 'text' | 'sequence' | 'match';
  question: string;
  options?: string[];
  answer?: string | string[]; // Correct answer(s)
  pairs?: Array<{
    left: string;
    right: string;
  }>;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  type: BookType;
  zone: MapZone;
  subtitle: string;
  icon: string;
  illustration: string; // Description of the visual motif for rendering/printing
  memoryQuestions: MemoryQuestion[];
}

export interface DiaryEntry {
  bookId: number;
  status: BookStatus;
  about: string;
  characters: string[];
  beginning: string;
  important: string;
  ending: string;
  favoriteMoment: string;
  rating: number;
  mood: string;
  memoryAnswers: Record<string, string | string[]>;
  updatedAt: string;
  // Playful additions
  drawing?: string; // Base64 drawing representation
  howWouldYouAct?: string; // Option selected for acting in hero's shoes
  mostMagicalTags?: string[]; // Selected magical tags
  funnyMomentTags?: string[]; // Selected funny tags
  aboutTags?: string[]; // Selected tags for what the book is about
}

export interface AppState {
  entries: Record<number, DiaryEntry>;
  childName: string;
}
