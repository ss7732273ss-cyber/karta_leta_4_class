import React from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { calculateStats, getNextBook } from '../utils/progress';
import { ChevronRight, Award, Compass, Star, MapPin } from 'lucide-react';

interface ProgressPanelProps {
  entries: Record<number, DiaryEntry>;
  booksList: Book[];
  onOpenBook: (book: Book) => void;
}

export default function ProgressPanel({ entries, booksList, onOpenBook }: ProgressPanelProps) {
  const stats = calculateStats(entries);
  const nextBook = getNextBook(booksList, entries);
  const totalBooks = booksList.length || 16;
  const currentCompleted = stats.completedCount;

  // Milestone mapping to align with our 16-book post-4th-grade explorer list
  const milestones = [
    { target: 4, label: 'Базовый лагерь', badge: '⛺', active: currentCompleted >= 4 },
    { target: 8, label: 'Перевал открытий', badge: '🧭', active: currentCompleted >= 8 },
    { target: 12, label: 'Покоритель высот', badge: '🧗', active: currentCompleted >= 12 },
    { target: 16, label: 'Первооткрыватель', badge: '👑', active: currentCompleted >= 16 },
  ];

  return (
    <div className="bg-white border-2 border-[#eae5c9] rounded-[32px] p-6 shadow-md mb-6 no-print">
      {/* Top title and ratio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-slate-800 font-extrabold font-display text-lg sm:text-xl flex items-center gap-2">
            🗺️ Литературная экспедиция:
            <span className="text-emerald-600 font-black">
              {currentCompleted} из {totalBooks} великих открытий
            </span>
          </span>
          <p className="text-xs text-slate-500 font-sans mt-0.5">Каждая прочитанная книга приближает тебя к вершине читательского мастерства!</p>
        </div>
        {nextBook && (
          <span className="text-xs sm:text-sm text-slate-600 font-semibold font-display bg-[#fdfcf7] px-3.5 py-1.5 rounded-xl border border-[#eae5c9]">
            Рекомендуем исследовать: <span className="text-[#5d8233] font-black">«{nextBook.title}»</span>
          </span>
        )}
      </div>

      {/* 🧭 Playful Expedition Progress Track */}
      <div className="relative pt-6 pb-2.5 px-4 bg-emerald-50/10 rounded-2xl border-2 border-dashed border-[#cbd2be] mb-6">
        
        {/* The Trail Path Layout */}
        <div className="relative h-7 bg-emerald-100/30 rounded-lg border-y-2 border-emerald-300/40 flex items-center mb-1 overflow-visible">
          
          {/* Top and Bottom track lines */}
          <div className="absolute top-1.5 left-0 right-0 h-[2px] bg-slate-300" />
          <div className="absolute bottom-1.5 left-0 right-0 h-[2px] bg-slate-300" />

          {/* 16 Expedition Nodes */}
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none items-center">
            {Array.from({ length: totalBooks }).map((_, i) => {
              const isCompleted = i < currentCompleted;
              return (
                <div 
                  key={i} 
                  title={`Открытие ${i + 1}`}
                  className={`w-[6px] h-[20px] rounded-xs transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' 
                      : 'bg-slate-300'
                  }`} 
                />
              );
            })}
          </div>

          {/* Color filled route path representing covered path */}
          <div 
            className="absolute top-[6px] bottom-[6px] left-2 bg-emerald-500/20 rounded-xs transition-all duration-500 ease-out pointer-events-none"
            style={{ width: `calc(${(currentCompleted / totalBooks) * 100}% - 8px)` }}
          />

          {/* sliding compass representing active position */}
          <div 
            className="absolute transition-all duration-500 ease-out pointer-events-none flex items-center justify-center -top-3.5"
            style={{ 
              left: `calc(${(currentCompleted / totalBooks) * 100}% - 14px)`,
              marginLeft: currentCompleted === 0 ? '14px' : '0px'
            }}
          >
            <span className="text-2xl animate-bounce-slow drop-shadow-md select-none">
              {currentCompleted === totalBooks ? '🥇🏆' : '⛵'}
            </span>
          </div>

          {/* Summit Mountain Peak flag */}
          <div className="absolute -right-3 -top-2.5 w-10 h-10 bg-amber-400 text-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-md" title="Вершина экспедиции!">
            <Star className={`w-4 h-4 fill-amber-500 ${currentCompleted === totalBooks ? 'animate-spin' : ''}`} />
          </div>
        </div>

        {/* Milestone Indicator Flags along the track */}
        <div className="relative h-5 text-[9px] font-bold font-display text-slate-400 uppercase tracking-wider select-none px-2">
          {milestones.map((ms) => {
            const posPercent = (ms.target / totalBooks) * 100;
            return (
              <div 
                key={ms.target} 
                className="absolute transform -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${posPercent}%` }}
              >
                <span className={`transition-all ${ms.active ? 'text-amber-600 font-extrabold scale-110' : ''}`}>
                  📍 {ms.target}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Achievements Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {milestones.map((ms) => (
          <div
            key={ms.target}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 transition-all ${
              ms.active
                ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm scale-102 font-bold'
                : 'bg-[#fdfcf7]/50 border-slate-100 text-slate-400'
            }`}
          >
            <span className={`text-lg transition-all ${ms.active ? 'scale-110' : 'opacity-40 grayscale'}`}>
              {ms.badge}
            </span>
            <div className="text-left min-w-0">
              <span className="text-[10px] uppercase block text-slate-400 font-bold leading-none">{ms.target} книг</span>
              <span className="text-xs font-black font-display truncate block mt-0.5">{ms.label}</span>
            </div>
            {ms.active && <span className="text-[10px] ml-auto text-amber-500">✨</span>}
          </div>
        ))}
      </div>

      {/* Next Station block */}
      <div className="bg-emerald-50/30 border-2 border-[#cbd2be]/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 font-display mb-1">
            📍 СЛЕДУЮЩИЙ МАРШРУТ ЭКСПЕДИЦИИ:
          </span>
          {nextBook ? (
            <>
              <h3 className="text-lg font-black font-display text-slate-800 mb-0.5">
                {nextBook.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans">
                {nextBook.author} • {nextBook.zone}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-black font-display text-slate-800 mb-0.5">
                Экспедиция успешно завершена! 🎉
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans">
                Поздравляем, ты покорил все 16 вершин! Открой родительский раздел в шапке, чтобы напечатать свой памятный читательский дневник и диплом!
              </p>
            </>
          )}
        </div>

        {nextBook && (
          <button
            type="button"
            id="open-next-book-btn"
            onClick={() => onOpenBook(nextBook)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-display px-8 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
          >
            Начать исследование
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
