import React, { useRef } from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { Star, Printer, Download, Sparkles, Heart, Award, Compass, Eye } from 'lucide-react';

interface KeepsakeCardComponentProps {
  book: Book;
  entry: DiaryEntry;
  childName: string;
  onClose?: () => void;
}

export default function KeepsakeCardComponent({ book, entry, childName, onClose }: KeepsakeCardComponentProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Genre-specific crest / seal generator
  const getGenreSeal = () => {
    const cleanTitle = book.title.replace(/[«»"]/g, '');
    const isSerious = book.id === 20 || cleanTitle.toLowerCase().includes('чучело') || cleanTitle.toLowerCase().includes('звездный мальчик') || cleanTitle.toLowerCase().includes('звёздный мальчик');
    const isAdventure = book.zone.includes('приключений') || book.zone.includes('героев') || book.title.toLowerCase().includes('путешествие') || book.title.toLowerCase().includes('приключения') || book.title.toLowerCase().includes('маугли') || book.type === 'приключения';
    const isFairy = book.type === 'сказка' || book.zone.includes('сказок');

    if (isSerious) {
      return {
        icon: '🕊️',
        title: 'Печать Мудрости',
        subtitle: 'чистое сердце & глубокие мысли',
        color: 'bg-indigo-50 border-indigo-300 text-indigo-700',
        ringColor: 'border-indigo-400/40'
      };
    }
    if (isAdventure) {
      return {
        icon: '🦁',
        title: 'Орден Храброго Сердца',
        subtitle: 'смелость, приключения & дружба',
        color: 'bg-emerald-50 border-emerald-300 text-emerald-700',
        ringColor: 'border-emerald-400/40'
      };
    }
    if (isFairy) {
      return {
        icon: '🪄',
        title: 'Звезда Сказочника',
        subtitle: 'воображение, вера в чудеса',
        color: 'bg-amber-50 border-amber-300 text-amber-700',
        ringColor: 'border-amber-400/40'
      };
    }
    return {
      icon: '❤️',
      title: 'Знак Книжного Уюта',
      subtitle: 'доброта, искренность & дружба',
      color: 'bg-rose-50 border-rose-300 text-rose-700',
      ringColor: 'border-rose-400/40'
    };
  };

  const seal = getGenreSeal();

  // Handle local print of ONLY this card
  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print(); // Fallback if popup blocked
      return;
    }

    const drawingImgHtml = entry.drawing 
      ? `<div style="margin-top: 15px; text-align: center;">
          <p style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #4c6c29; font-weight: bold; margin-bottom: 5px;">🎨 Твой рисунок:</p>
          <img src="${entry.drawing}" style="max-height: 200px; max-width: 100%; border: 2px solid #eae5c9; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" />
         </div>`
      : '';

    // Get favorite moment representation
    const favMomentText = entry.favoriteMoment 
      ? entry.favoriteMoment 
      : (entry.mostMagicalTags && entry.mostMagicalTags.length > 0)
        ? `Понравилось: ${entry.mostMagicalTags.join(', ')}`
        : 'Увлекательное путешествие по страницам книги!';

    const charactersText = entry.characters && entry.characters.length > 0 
      ? entry.characters.join(', ') 
      : '';

    const parts = [entry.beginning, entry.important, entry.ending].map(p => p?.trim()).filter(Boolean);
    let plotText = '';
    if (parts.length > 0) {
      plotText = parts.map(p => p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.').join(' ');
    } else if (entry.about?.trim()) {
      plotText = entry.about.trim();
    }

    let mainIdeaText = '';
    if (entry.about?.trim()) {
      mainIdeaText = entry.about.trim();
    } else if (entry.aboutTags && entry.aboutTags.length > 0) {
      mainIdeaText = `Книга раскрывает такие ценности, как ${entry.aboutTags.join(', ').toLowerCase()}.`;
    }

    let lessonText = '';
    if (entry.howWouldYouAct?.trim()) {
      lessonText = `Поставив себя на место главного героя, читатель решил поступить так: «${entry.howWouldYouAct}».`;
    } else if (entry.mostMagicalTags && entry.mostMagicalTags.length > 0) {
      lessonText = `Учит проявлять лучшие качества: ${entry.mostMagicalTags.slice(0, 3).join(', ').toLowerCase()}.`;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Памятная карточка читателя - ${book.title}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@0,800;1,600&display=swap">
          <style>
            body {
              margin: 0;
              padding: 20px;
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
            }
            .card {
              width: 580px;
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              border: 8px double #fbbf24;
              border-radius: 28px;
              padding: 30px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
              position: relative;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #f59e0b;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .title {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #b45309;
              font-weight: 800;
              margin: 0 0 5px 0;
            }
            .book-title {
              font-size: 24px;
              font-weight: 800;
              color: #1e293b;
              margin: 5px 0;
            }
            .book-author {
              font-size: 13px;
              color: #78350f;
              font-weight: 600;
              margin: 0;
            }
            .announcement {
              text-align: center;
              margin: 20px 0;
              font-size: 18px;
              font-weight: 800;
              color: #047857;
              background-color: rgba(255,255,255,0.7);
              padding: 12px 18px;
              border-radius: 16px;
              border: 1px solid #fcd34d;
            }
            .details-grid {
              display: grid;
              grid-template-cols: 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .detail-block {
              background-color: rgba(255,255,255,0.6);
              padding: 12px 15px;
              border-radius: 16px;
              border: 1px solid rgba(251,191,36,0.3);
            }
            .block-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #78350f;
              font-weight: 800;
              margin-bottom: 4px;
            }
            .block-value {
              font-size: 13px;
              color: #334155;
              line-height: 1.4;
              margin: 0;
            }
            .favorite-moment {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              color: #451a03;
              font-size: 14px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 25px;
              border-top: 1px solid rgba(245,158,11,0.2);
              padding-top: 15px;
            }
            .stamp {
              background-color: #ffffff;
              border: 3px solid #fcd34d;
              border-radius: 50%;
              width: 75px;
              height: 75px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .stamp-emoji {
              font-size: 26px;
            }
            .stamp-text {
              font-size: 7px;
              text-transform: uppercase;
              font-weight: 800;
              color: #b45309;
              text-align: center;
              margin-top: 2px;
              max-width: 65px;
              line-height: 1.1;
            }
            .date-stamp {
              font-size: 10px;
              font-weight: bold;
              color: #92400e;
              background-color: #fef3c7;
              padding: 4px 10px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <p class="title">🌻 Летнее Чтение • Памятная Открытка 🌻</p>
              <h2 class="book-title">${book.icon} ${book.title}</h2>
              <p class="book-author">Автор: ${book.author}</p>
            </div>
            
            <div class="announcement">
              🌟 Эту книгу прочитал(а) ${childName || 'Юный Книголюб'}! 🌟
            </div>

            <div class="details-grid">
              <div class="detail-block">
                <div class="block-label">⭐ Моя оценка & настроение:</div>
                <div class="block-value" style="font-size: 14px; font-weight: bold;">
                  ${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)} ${entry.mood ? `• Настроение: ${entry.mood}` : ''}
                </div>
              </div>

              <div class="detail-block">
                <div class="block-label">❤️ Самый любимый момент книги:</div>
                <p class="block-value favorite-moment">«${favMomentText}»</p>
              </div>
            </div>

            ${drawingImgHtml}

            <div class="footer">
              <div class="date-stamp">
                Дата: ${new Date(entry.updatedAt || Date.now()).toLocaleDateString('ru-RU')}
              </div>
              
              <div class="stamp">
                <div class="stamp-emoji">${seal.icon}</div>
                <div class="stamp-text">${seal.title}</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const currentName = childName || 'Юный Книголюб';

  const displayMoment = entry.favoriteMoment 
    ? entry.favoriteMoment 
    : (entry.mostMagicalTags && entry.mostMagicalTags.length > 0)
      ? `Мне безумно понравились моменты: ${entry.mostMagicalTags.join(', ')}`
      : 'Удивительное путешествие, полное открытий и незабываемых впечатлений!';

  return (
    <div 
      ref={cardRef}
      id={`keepsake-card-${book.id}`}
      className="relative bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fef3c7] border-4 border-amber-400/40 rounded-[32px] p-6 sm:p-8 shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg animate-in fade-in zoom-in-95 duration-300 mb-8 max-w-2xl mx-auto"
    >
      {/* Summer Sparkly Accents */}
      <div className="absolute top-3 right-4 flex gap-1 text-amber-500 animate-pulse pointer-events-none">
        <Sparkles className="w-5 h-5 fill-amber-300" />
      </div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
 
      {/* Decorative Wavy Border (Postage Stamp Feel) */}
      <div className="absolute inset-2 border-2 border-dashed border-amber-500/25 rounded-2xl pointer-events-none" />
 
      {/* Card Header */}
      <div className="text-center pb-4 border-b-2 border-dashed border-amber-500/20 mb-5 relative z-10">
        <span className="inline-block bg-amber-500/15 text-[#b36200] font-black text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full font-display mb-2">
          🌻 Памятная Карточка Читателя 🌻
        </span>
        <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 leading-tight">
          {book.icon} «{book.title}»
        </h3>
        <p className="text-xs font-bold text-amber-800/80 font-display mt-1">
          Автор: {book.author}
        </p>
      </div>
 
      {/* LARGE ACHIEVEMENT ANNOUNCEMENT */}
      <div className="bg-white/70 border border-amber-200/60 rounded-2xl p-4 text-center mb-5 shadow-2xs relative z-10 hover:scale-102 transition-all">
        <span className="text-xl sm:text-2xl font-black font-display text-[#047857] leading-tight block">
          👑 Эту книгу прочитал(а) {currentName}! 👑
        </span>
        <p className="text-[10px] sm:text-xs text-slate-500 font-sans mt-1">
          Поздравляем с прохождением станции на Карте Летних Приключений!
        </p>
      </div>
 
      {/* Grid of details */}
      <div className="space-y-4 relative z-10 flex-grow">
        {/* Rating and mood */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/50 p-3 rounded-xl border border-amber-200/30">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-[#b36200] font-display mb-1">
              ⭐ Моя оценка:
            </span>
            <div className="flex gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < (entry.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
          </div>
 
          <div className="bg-white/50 p-3 rounded-xl border border-amber-200/30 flex flex-col justify-center">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-[#b36200] font-display mb-1">
              😍 Настроение:
            </span>
            <span className="text-xs font-bold font-display text-slate-700">
              {entry.mood || 'Отличное! 🥳'}
            </span>
          </div>
        </div>

        {/* Favorite moment */}
        <div className="bg-[#fffdf2]/95 p-4 rounded-xl border border-amber-200/40 shadow-2xs relative">
          <span className="block text-[9px] uppercase tracking-wider font-extrabold text-[#b36200] font-display mb-1.5">
            ❤️ Любимый момент в книге:
          </span>
          <p className="text-xs sm:text-sm font-display text-amber-950 font-medium italic leading-relaxed pl-3 border-l-2 border-amber-400">
            «{displayMoment}»
          </p>
        </div>
 
        {/* If drawing is present */}
        {entry.drawing && (
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/30 text-center shadow-2xs">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-[#4c6c29] font-display mb-1.5">
              🎨 Мой рисунок к произведению:
            </span>
            <img 
              src={entry.drawing} 
              alt="Мой рисунок" 
              className="max-h-40 mx-auto rounded-lg border border-slate-200/80 shadow-3xs hover:scale-105 transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Card Footer with stamp & seal */}
      <div className="mt-6 pt-4 border-t border-dashed border-amber-500/20 flex items-center justify-between relative z-10">
        <div className="text-left">
          <span className="block text-[10px] text-amber-800/60 font-sans">
            Дата прохождения:
          </span>
          <span className="text-xs font-bold font-display text-slate-700">
            {new Date(entry.updatedAt || Date.now()).toLocaleDateString('ru-RU')}
          </span>
        </div>

        {/* Dynamic wax-like circular crest seal */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 shadow-2xs ${seal.color}`}>
          <span className="text-2xl select-none animate-pulse shrink-0">{seal.icon}</span>
          <div className="leading-tight">
            <span className="block text-[10px] font-black font-display uppercase tracking-wider">
              {seal.title}
            </span>
            <span className="block text-[8px] font-semibold text-slate-500 font-sans uppercase">
              {seal.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Actions buttons */}
      <div className="mt-6 flex flex-wrap gap-2.5 justify-center no-print relative z-10">
        <button
          type="button"
          onClick={handlePrintCard}
          className="bg-amber-500 hover:bg-amber-600 text-white font-black font-display text-xs px-5 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer border-2 border-amber-300"
        >
          <Printer className="w-4 h-4" />
          Распечатать открытку 🖨️
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black font-display text-xs px-4 py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Скрыть открытку
          </button>
        )}
      </div>
    </div>
  );
}
