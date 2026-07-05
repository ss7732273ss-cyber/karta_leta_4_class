import React, { useState } from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { calculateStats } from '../utils/progress';
import { Printer, Heart, Star, BookOpen, Clock, Calendar, Shield, Award } from 'lucide-react';

interface ParentModePanelProps {
  entries: Record<number, DiaryEntry>;
  booksList: Book[];
  childName: string;
  onTriggerPrint: (type: 'diary' | 'diploma') => void;
}

export default function ParentModePanel({ entries, booksList, childName, onTriggerPrint }: ParentModePanelProps) {
  const stats = calculateStats(entries);

  // List of books currently being read
  const readingBooks = booksList.filter((b) => {
    const entry = entries[b.id];
    return entry && entry.status === 'reading';
  });

  // List of books not yet started
  const notStartedBooks = booksList.filter((b) => {
    const entry = entries[b.id];
    return !entry || entry.status === 'not_started';
  });

  // Get the date of the last saved entry
  const getLastUpdatedDate = () => {
    const dates = Object.values(entries)
      .map((e) => e.updatedAt)
      .filter(Boolean);
    if (dates.length === 0) return 'Пока нет записей';
    const latest = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
    return latest.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div id="parent-mode-panel" className="bg-white border-2 border-slate-700/5 rounded-[32px] p-6 sm:p-8 shadow-sm no-print mb-10">
      {/* Title block */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
        <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black font-display text-slate-800">Кабинет экспедиции: Прогресс и Результаты</h2>
          <p className="text-xs text-slate-500 font-semibold font-sans">
            Сводка открытий, печать путевого дневника и диплома первопроходца
          </p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-center">
          <span className="block text-[11px] font-black font-display text-emerald-800 uppercase tracking-wider mb-1">
            Прочитано
          </span>
          <span className="text-3xl font-black font-mono text-emerald-700">{stats.completedCount}</span>
          <span className="block text-[10px] text-slate-400 font-bold font-sans mt-0.5">книг из {booksList.length}</span>
        </div>

        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
          <span className="block text-[11px] font-black font-display text-blue-800 uppercase tracking-wider mb-1">
            Сейчас читает
          </span>
          <span className="text-3xl font-black font-mono text-blue-700">{stats.readingCount}</span>
          <span className="block text-[10px] text-slate-400 font-bold font-sans mt-0.5">в процессе</span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
          <span className="block text-[11px] font-black font-display text-amber-800 uppercase tracking-wider mb-1">
            Средняя оценка
          </span>
          <span className="text-3xl font-black font-mono text-amber-700">
            {stats.averageRating > 0 ? stats.averageRating : '—'}
          </span>
          <span className="block text-[10px] text-slate-400 font-bold font-sans mt-0.5">звёзд по дневникам</span>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
          <span className="block text-[11px] font-black font-display text-slate-500 uppercase tracking-wider mb-1">
            Активные медали
          </span>
          <span className="text-3xl font-black font-mono text-slate-700">
            {Object.values(stats.medals).filter(Boolean).length}
          </span>
          <span className="block text-[10px] text-slate-400 font-bold font-sans mt-0.5">из 4 наград</span>
        </div>
      </div>

      {/* Print Trigger Card */}
      <div className="bg-slate-50 border-2 border-slate-700/5 p-5 sm:p-6 rounded-[24px] mb-8">
        <h3 className="text-sm font-black font-display text-slate-700 mb-3 flex items-center gap-1.5">
          <Printer className="w-4 h-4 text-slate-400" />
          Экспорт и сохранение результатов
        </h3>
        <p className="text-xs text-slate-500 font-sans mb-5 leading-relaxed">
          Вы можете сохранить дневник и диплом в PDF-файл или напечатать их на принтере через встроенный диалог печати браузера.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            id="print-diary-btn"
            onClick={() => onTriggerPrint('diary')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-display px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4" />
            Печать читательского дневника
          </button>
          <button
            type="button"
            id="print-diploma-btn"
            onClick={() => onTriggerPrint('diploma')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold font-display px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4" />
            Распечатать диплом мастера
          </button>
        </div>
      </div>

      {/* Lists Section: Favorites, Reading, Remaining */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Books list */}
        <div className="space-y-3">
          <h4 className="text-sm font-black font-display text-slate-700 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Любимые книги ({stats.favoriteBooks.length})
          </h4>
          {stats.favoriteBooks.length === 0 ? (
            <p className="text-xs text-slate-400 italic font-sans pl-1">
              Оцените любимые книги на 5 звёзд, чтобы они появились здесь.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stats.favoriteBooks.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{b.icon}</span>
                    <div className="min-w-0">
                      <span className="block text-xs font-black font-display text-slate-700 truncate">{b.title}</span>
                      <span className="block text-[10px] text-slate-400 font-sans truncate">{b.author}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: entries[b.id]?.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In-progress Reading List */}
        <div className="space-y-3">
          <h4 className="text-sm font-black font-display text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500" />
            Сейчас в процессе чтения ({readingBooks.length})
          </h4>
          {readingBooks.length === 0 ? (
            <p className="text-xs text-slate-400 italic font-sans pl-1">Пока нет книг в процессе чтения.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {readingBooks.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{b.icon}</span>
                    <div className="min-w-0">
                      <span className="block text-xs font-black font-display text-slate-700 truncate">{b.title}</span>
                      <span className="block text-[10px] text-slate-400 font-sans truncate">{b.author}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-display text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                    Читает
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Yet to Start List */}
        <div className="space-y-3 md:col-span-2 pt-3 border-t border-slate-100">
          <h4 className="text-sm font-black font-display text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Ещё не начатые книги ({notStartedBooks.length})
          </h4>
          {notStartedBooks.length === 0 ? (
            <p className="text-xs text-slate-500 font-bold font-display text-emerald-600 pl-1">
              Поздравляем! Все книги из списка успешно прочитаны! 🎉
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {notStartedBooks.map((b) => (
                <div key={b.id} className="flex items-center gap-2 p-2 bg-slate-50/30 border border-slate-100/60 rounded-xl">
                  <span className="text-base select-none">{b.icon}</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold font-display text-slate-600 truncate">{b.title}</span>
                    <span className="block text-[9px] text-slate-400 font-sans truncate">{b.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Последнее сохранение: {getLastUpdatedDate()}
        </span>
        <span className="font-semibold font-display text-emerald-600">
          Локальные данные в полной сохранности на текущем устройстве
        </span>
      </div>
    </div>
  );
}
