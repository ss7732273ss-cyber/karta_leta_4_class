import React from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { Star, CheckCircle, BookOpen, Compass, MapPin } from 'lucide-react';

interface AdventureMapProps {
  booksList: Book[];
  entries: Record<number, DiaryEntry>;
  onOpenBook: (book: Book) => void;
}

export default function AdventureMap({ booksList, entries, onOpenBook }: AdventureMapProps) {
  // Group books by the new 4 zones
  const zones: Record<string, { books: Book[]; colorClass: string; icon: string; bgClass: string; borderClass: string; textClass: string }> = {
    'Долина преданий': {
      books: [],
      colorClass: 'bg-amber-100/50 text-amber-800 border-amber-200',
      icon: '📜',
      bgClass: 'bg-amber-50/25',
      borderClass: 'border-[#eae5c9]',
      textClass: 'text-amber-800',
    },
    'Берега природы и судеб': {
      books: [],
      colorClass: 'bg-emerald-100/50 text-emerald-800 border-emerald-200',
      icon: '🌿',
      bgClass: 'bg-emerald-50/25',
      borderClass: 'border-[#cbd2be]',
      textClass: 'text-emerald-800',
    },
    'Перевал мужества': {
      books: [],
      colorClass: 'bg-rose-100/50 text-rose-800 border-rose-200',
      icon: '⛰️',
      bgClass: 'bg-rose-50/25',
      borderClass: 'border-rose-200/50',
      textClass: 'text-rose-800',
    },
    'Горизонты открытий': {
      books: [],
      colorClass: 'bg-sky-100/50 text-sky-800 border-sky-200',
      icon: '🧭',
      bgClass: 'bg-sky-50/25',
      borderClass: 'border-sky-200/50',
      textClass: 'text-sky-800',
    },
  };

  // Populate zones correctly
  booksList.forEach((book) => {
    if (zones[book.zone]) {
      zones[book.zone].books.push(book);
    }
  });

  return (
    <div id="adventure-map-container" className="space-y-12 no-print">
      {Object.entries(zones).map(([zoneName, zoneConfig]) => {
        if (zoneConfig.books.length === 0) return null;

        return (
          <section
            key={zoneName}
            id={`zone-${zoneName.replace(/\s+/g, '-').toLowerCase()}`}
            className={`relative p-6 sm:p-8 rounded-[32px] border-2 ${zoneConfig.bgClass} ${zoneConfig.borderClass} transition-all`}
          >
            {/* Decorative Map Badge */}
            <div className="absolute -top-5 left-6 sm:left-10 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white border-2 shadow-sm border-slate-200">
              <span className="text-2xl">{zoneConfig.icon}</span>
              <h2 className="text-lg font-black font-display text-slate-800">{zoneName}</h2>
            </div>

            <div className="mt-4 text-slate-500 text-xs font-bold font-display flex items-center gap-1.5 mb-8">
              <Compass className="w-4 h-4 animate-spin-slow text-slate-400" />
              Экспедиционный сектор • {zoneConfig.books.length} {zoneConfig.books.length === 1 ? 'вершина' : zoneConfig.books.length < 5 ? 'вершины' : 'вершин'}
            </div>

            {/* Path rendering using winding alternating grid / list */}
            <div className="relative space-y-6">
              {/* The Trail line running vertically on mobile, and connecting cards */}
              <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 border-l-2 border-dashed border-slate-200 pointer-events-none" />

              {zoneConfig.books.map((book, idx) => {
                const entry = entries[book.id];
                const status = entry?.status || 'not_started';
                const rating = entry?.rating || 0;

                // Alternating position for desktop
                const isEven = idx % 2 === 0;

                // Styles according to status
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-display">
                    Не начато
                  </span>
                );
                let cardBorderClass = 'border-slate-100 hover:border-slate-200';
                let ringClass = '';

                if (status === 'reading') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-display animate-pulse">
                      Исследую 📖
                    </span>
                  );
                  cardBorderClass = 'border-blue-200 shadow-blue-50';
                  ringClass = 'ring-4 ring-blue-50 active-pulse';
                } else if (status === 'done') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-display">
                      <CheckCircle className="w-3 h-3" /> Пройдено
                    </span>
                  );
                  cardBorderClass = 'border-emerald-200 shadow-emerald-50';
                  ringClass = 'ring-4 ring-emerald-50';
                }

                return (
                  <div
                    key={book.id}
                    id={`station-card-${book.id}`}
                    className={`flex flex-col sm:flex-row items-center w-full ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Space filler to keep alternating look on desktop */}
                    <div className="hidden sm:block sm:w-1/2" />

                    {/* Indicator flag / node on the map trail */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-[11px] sm:-translate-x-[15px] z-10 flex items-center justify-center">
                      <div
                        onClick={() => onOpenBook(book)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                          status === 'done'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : status === 'reading'
                            ? 'bg-blue-500 text-white shadow-md animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {status === 'done' ? (
                          <span className="text-[10px] sm:text-xs font-bold font-display">✓</span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-bold font-display">{book.id}</span>
                        )}
                      </div>
                    </div>

                    {/* Interactive card container */}
                    <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8">
                      <div
                        onClick={() => onOpenBook(book)}
                        className={`relative bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer ${cardBorderClass} ${ringClass}`}
                      >
                        {/* Star rating preview if completed */}
                        {status === 'done' && rating > 0 && (
                          <div className="absolute top-4 right-4 flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 items-start">
                          {/* Book Icon Emoji */}
                          <div className="text-3xl p-2 bg-slate-50 border border-slate-100 rounded-xl select-none">
                            {book.icon}
                          </div>

                          {/* Station details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {statusBadge}
                              <span className="text-[10px] font-bold font-display bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                {book.type}
                              </span>
                            </div>

                            <h3 className="text-base font-extrabold font-display text-slate-800 leading-tight mb-0.5 truncate">
                              {book.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-semibold font-sans mb-2">
                              {book.author}
                            </p>

                            <p className="text-xs text-slate-400 font-sans italic line-clamp-1">
                              {book.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Station Action Footer */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-400 font-bold font-display flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            Открытие {book.id}
                          </span>
                          <span className="text-emerald-600 hover:text-emerald-700 font-extrabold font-display inline-flex items-center gap-0.5">
                            {status === 'done' ? 'Посмотреть дневник' : status === 'reading' ? 'Продолжить исследование' : 'Начать исследование'} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
