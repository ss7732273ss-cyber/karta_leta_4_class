import React, { useState } from 'react';
import { Book, DiaryEntry } from '../types/reading';
import KeepsakeCardComponent from './KeepsakeCardComponent';
import { Sparkles, Image, Eye, BookOpen, Star } from 'lucide-react';

interface KeepsakeAlbumProps {
  entries: Record<number, DiaryEntry>;
  booksList: Book[];
  childName: string;
}

export default function KeepsakeAlbum({ entries, booksList, childName }: KeepsakeAlbumProps) {
  const [selectedBookForCard, setSelectedBookForCard] = useState<Book | null>(null);

  // Filter books that are fully read (status === 'done') and have entries
  const completedEntries = Object.values(entries).filter((entry) => entry.status === 'done');
  
  const completedBooks = completedEntries
    .map((entry) => booksList.find((b) => b.id === entry.bookId))
    .filter((b): b is Book => b !== undefined);

  if (completedBooks.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-50/50 via-rose-50/30 to-amber-50/50 border border-dashed border-amber-300 rounded-[32px] p-6 text-center shadow-xs no-print">
        <div className="max-w-md mx-auto py-4">
          <span className="text-4xl animate-bounce-slow inline-block mb-3">🌻</span>
          <h3 className="text-base sm:text-lg font-black font-display text-amber-900 mb-1.5">
            Твой Альбом Памятных Открыток
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Здесь будут собираться твои волшебные открытки после прохождения каждой книги. Прочти свою первую книгу на карте, разгадай викторину, и твоё первое сокровище появится прямо в этом альбоме!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-700/5 rounded-[32px] p-6 sm:p-8 shadow-sm no-print">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
        <div className="flex items-center gap-2 pl-1">
          <span className="text-2xl animate-pulse select-none">📖</span>
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Альбом воспоминаний летнего чтения ✨
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
              Нажми на открытку, чтобы рассмотреть её во всех деталях и распечатать маме или бабушке!
            </p>
          </div>
        </div>
        <span className="bg-amber-100 text-amber-800 font-black text-xs px-3.5 py-1.5 rounded-full font-display border border-amber-200">
          🎉 Собрано: {completedBooks.length} открыток
        </span>
      </div>

      {/* Grid of Polaroid Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {completedBooks.map((book) => {
          const entry = entries[book.id];
          if (!entry) return null;
          
          return (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBookForCard(book)}
              className="group bg-[#fffdf5] border-2 border-amber-100 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all hover:scale-105 cursor-pointer flex flex-col text-left relative overflow-hidden"
            >
              {/* Highlight ribbon */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400 group-hover:bg-amber-500 transition-colors" />
              
              {/* Cover Mini Sketch Drawing or Icon */}
              <div className="bg-white border border-amber-100/60 rounded-xl h-24 flex items-center justify-center relative mb-3 mt-1.5 overflow-hidden">
                {entry.drawing ? (
                  <img 
                    src={entry.drawing} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-4xl select-none group-hover:scale-115 transition-transform duration-300">
                    {book.icon}
                  </span>
                )}
                
                {/* Overlay hover eye icon */}
                <div className="absolute inset-0 bg-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Book title and Author */}
              <h4 className="text-xs font-black font-display text-slate-800 leading-tight line-clamp-1 mb-0.5 group-hover:text-amber-700 transition-colors">
                {book.title}
              </h4>
              <span className="text-[10px] text-slate-400 font-sans truncate block">
                {book.author}
              </span>

              {/* Rating and seal preview */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-amber-100">
                <div className="flex gap-0.5 text-[9px] text-amber-500 font-bold">
                  {'★'.repeat(entry.rating)}
                </div>
                <span className="text-[10px] select-none" title="Папка открытки">
                  ✉️
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Card expanded view Modal */}
      {selectedBookForCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white/0 rounded-[32px] overflow-hidden my-8">
            <KeepsakeCardComponent
              book={selectedBookForCard}
              entry={entries[selectedBookForCard.id]}
              childName={childName}
              onClose={() => setSelectedBookForCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
