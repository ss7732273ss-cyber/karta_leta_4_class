import { Book, DiaryEntry } from '../types/reading';
import { books } from '../data/books';

export interface ProgressStats {
  total: number;
  completedCount: number;
  readingCount: number;
  notStartedCount: number;
  percentage: number;
  medals: {
    medal5: boolean;
    medal10: boolean;
    medal20: boolean;
    medal28: boolean;
  };
  averageRating: number;
  favoriteBooks: Book[];
}

export const calculateStats = (entries: Record<number, DiaryEntry>): ProgressStats => {
  const total = books.length;
  let completedCount = 0;
  let readingCount = 0;
  let notStartedCount = 0;
  let totalRating = 0;
  let ratedCount = 0;
  const ratings: Record<number, number> = {};

  books.forEach((book) => {
    const entry = entries[book.id];
    const status = entry?.status || 'not_started';
    if (status === 'done') {
      completedCount++;
    } else if (status === 'reading') {
      readingCount++;
    } else {
      notStartedCount++;
    }

    if (entry && entry.rating > 0) {
      ratings[book.id] = entry.rating;
      totalRating += entry.rating;
      ratedCount++;
    }
  });

  const percentage = Math.round((completedCount / total) * 100);

  const medals = {
    medal5: completedCount >= 4,
    medal10: completedCount >= 8,
    medal20: completedCount >= 12,
    medal28: completedCount >= 16,
  };

  const averageRating = ratedCount > 0 ? Math.round((totalRating / ratedCount) * 10) / 10 : 0;

  // Favorite books: rating is maximum (at least 4 stars)
  let favoriteBooks: Book[] = [];
  const maxRating = ratedCount > 0 ? Math.max(...Object.values(ratings)) : 0;
  if (maxRating >= 4) {
    favoriteBooks = books.filter((book) => ratings[book.id] && ratings[book.id] === maxRating);
  }

  return {
    total,
    completedCount,
    readingCount,
    notStartedCount,
    percentage,
    medals,
    averageRating,
    favoriteBooks,
  };
};

export const getNextBook = (booksList: Book[], entries: Record<number, DiaryEntry>): Book | null => {
  // 1. check if there is a book with status 'reading'
  const readingBook = booksList.find((book) => {
    const entry = entries[book.id];
    return entry && entry.status === 'reading';
  });
  if (readingBook) return readingBook;

  // 2. if not, find the first book with status not 'done'
  const nextNotDone = booksList.find((book) => {
    const entry = entries[book.id];
    const status = entry?.status || 'not_started';
    return status !== 'done';
  });

  return nextNotDone || null;
};
