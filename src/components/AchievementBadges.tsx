import React from 'react';
import { Award, BookOpen, Star, Trophy, Heart } from 'lucide-react';

interface AchievementBadgesProps {
  completedCount: number;
  keepsakeCount?: number;
}

export default function AchievementBadges({ completedCount, keepsakeCount = 0 }: AchievementBadgesProps) {
  const achievements = [
    {
      id: '5',
      title: 'Базовый лагерь',
      subtitle: 'Новобранец',
      description: 'Совершено 4 книжных открытия из списка',
      target: 4,
      icon: <Award className="w-8 h-8" />,
      color: 'bg-amber-50/50 text-amber-600 border-amber-300 shadow-amber-100/50',
    },
    {
      id: '10',
      title: 'Перевал открытий',
      subtitle: 'Следопыт',
      description: 'Совершено 8 книжных открытий из списка',
      target: 8,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-teal-50/50 text-teal-600 border-teal-300 shadow-teal-100/50',
    },
    {
      id: '20',
      title: 'Покоритель высот',
      subtitle: 'Покоритель гор',
      description: 'Совершено 12 книжных открытий из списка',
      target: 12,
      icon: <Star className="w-8 h-8" />,
      color: 'bg-indigo-50/50 text-indigo-600 border-indigo-300 shadow-indigo-100/50',
    },
    {
      id: '28',
      title: 'Вся карта пройдена',
      subtitle: 'Великий Первопроходец',
      description: 'Покорены все 16 вершин литературы!',
      target: 16,
      icon: <Trophy className="w-8 h-8 text-rose-500" />,
      color: 'bg-rose-50/80 text-rose-600 border-rose-300 shadow-rose-200/50 animate-pulse',
    },
    {
      id: 'keepsake',
      title: 'Мастер воспоминаний',
      subtitle: 'Хранитель Историй',
      description: 'Собрано 3 памятные открытки из сундука! ✉️🧭',
      target: 3,
      icon: <Heart className="w-8 h-8 text-rose-500 fill-rose-300 animate-pulse" />,
      color: 'bg-[#fffdf2] text-amber-600 border-amber-300 shadow-amber-200/50',
      isUnlocked: keepsakeCount >= 3,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {achievements.map((ach) => {
        const isUnlocked = ach.isUnlocked !== undefined ? ach.isUnlocked : completedCount >= ach.target;
        return (
          <div
            key={ach.id}
            id={`medal-${ach.id}`}
            className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
              isUnlocked
                ? `${ach.color} bg-white shadow-md scale-102 border-solid`
                : 'bg-slate-50 border-slate-200 border-dashed text-slate-400 opacity-60'
            }`}
          >
            <div className={`mb-2.5 p-2.5 rounded-full ${isUnlocked ? 'bg-white shadow-xs' : 'bg-slate-100'}`}>
              {ach.icon}
            </div>
            <h4 className="text-sm font-extrabold font-display text-slate-800 leading-tight mb-0.5">{ach.title}</h4>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-emerald-600 mb-1">
              {isUnlocked ? ach.subtitle : 'Впереди...'}
            </span>
            <p className="text-[11px] text-slate-500 font-sans leading-tight">
              {isUnlocked 
                ? ach.description 
                : ach.id === 'keepsake'
                ? `Осталось собрать еще ${3 - keepsakeCount} открытки`
                : `Осталось прочитать еще ${ach.target - completedCount} ${getWordEnding(ach.target - completedCount)}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function getWordEnding(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'книг';
  }
  if (lastDigit === 1) {
    return 'книгу';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'книги';
  }
  return 'книг';
}
