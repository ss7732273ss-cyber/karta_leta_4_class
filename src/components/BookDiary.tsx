import React, { useState, useEffect, useRef } from 'react';
import { Book, DiaryEntry, BookStatus } from '../types/reading';
import StarRating from './StarRating';
import MoodPicker from './MoodPicker';
import MemoryQuiz from './MemoryQuiz';
import { getPlayfulBookData } from '../data/playfulData';
import { resolveDiaryDetails } from '../utils/diaryResolver';
import KeepsakeCardComponent from './KeepsakeCardComponent';
import { 
  Save, 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Sparkles, 
  Smile, 
  Heart, 
  Brush, 
  Eraser, 
  Trash2, 
  Compass, 
  Check, 
  Volume2, 
  HelpCircle,
  HelpCircle as HelpIcon,
  MessageSquare,
  Printer,
  FileText
} from 'lucide-react';

interface BookDiaryProps {
  book: Book;
  savedEntry?: DiaryEntry;
  onSave: (entry: DiaryEntry, nextStatus?: BookStatus, stayOpen?: boolean) => void;
  onClose: () => void;
  childName?: string;
  onTriggerPrint?: (type: 'diary' | 'diploma' | 'book_summary', bookId?: number) => void;
}

export default function BookDiary({ book, savedEntry, onSave, onClose, childName = '', onTriggerPrint }: BookDiaryProps) {
  // Load playful book data (humor, cards, predefined details)
  const playfulData = getPlayfulBookData(book.id, book.title, book.author, book.zone, book.type);

  const cleanTitle = book.title.replace(/[«»"]/g, '');
  const isSerious = book.id === 20 || cleanTitle.toLowerCase().includes('чучело') || cleanTitle.toLowerCase().includes('звездный мальчик') || cleanTitle.toLowerCase().includes('звёздный мальчик');
  const isAdventure = book.zone.includes('приключений') || book.zone.includes('героев') || book.title.toLowerCase().includes('путешествие') || book.title.toLowerCase().includes('приключения') || book.title.toLowerCase().includes('маугли') || book.type === 'приключения';
  const isFairy = book.type === 'сказка' || book.zone.includes('сказок');

  let themeHeaderBg = "bg-gradient-to-r from-emerald-100/70 via-[#fefded]/90 to-amber-100/70";
  let themeHeaderBorder = "border-[#eae5c9]";
  let themeBadgeClass = "bg-[#ff9f29]/15 text-[#b36200] border-[#ff9f29]/25";
  let themeAuthorText = "text-[#5d8233]";
  let themeStationPrefix = "🗺️ Станция";
  let themeBodyBg = "bg-[#fdfcf0]/25";

  if (isSerious) {
    themeHeaderBg = "bg-gradient-to-r from-slate-100 via-[#fafbff] to-[#f0fdfa]";
    themeHeaderBorder = "border-slate-300";
    themeBadgeClass = "bg-slate-500/10 text-slate-700 border-slate-500/20";
    themeAuthorText = "text-slate-600";
    themeStationPrefix = "🕊️ Станция Глубоких Чувств & Важных Истин";
    themeBodyBg = "bg-[#fafbfc]";
  } else if (isAdventure) {
    themeHeaderBg = "bg-gradient-to-r from-sky-100/70 via-[#fcfdf2]/90 to-[#d9f99d]/50";
    themeHeaderBorder = "border-[#cbd2be]";
    themeBadgeClass = "bg-emerald-500/15 text-emerald-700 border-emerald-500/25";
    themeAuthorText = "text-[#2c5211]";
    themeStationPrefix = "🧭 Станция Открытий & Приключений";
    themeBodyBg = "bg-[#f4fcf6]/30";
  } else if (isFairy) {
    themeHeaderBg = "bg-gradient-to-r from-[#ffe4e6]/50 via-[#fffbeb]/90 to-[#ffe4e6]/50";
    themeHeaderBorder = "border-[#fecdd3]";
    themeBadgeClass = "bg-rose-500/15 text-rose-700 border-rose-500/25";
    themeAuthorText = "text-[#b32040]";
    themeStationPrefix = "✨ Волшебная Станция Сказки ✨";
    themeBodyBg = "bg-[#fffbfb]/40";
  } else {
    themeHeaderBg = "bg-gradient-to-r from-[#fff7ed] via-[#fffbeb] to-[#fff1f2]/70";
    themeHeaderBorder = "border-[#fed7aa]";
    themeBadgeClass = "bg-amber-500/15 text-[#b36200] border-amber-500/25";
    themeAuthorText = "text-[#a855f7]";
    themeStationPrefix = "🏡 Тёплая Станция Дружбы и Уюта ❤️";
    themeBodyBg = "bg-[#fffbf2]/40";
  }

  // States
  const [about, setAbout] = useState(savedEntry?.about || '');
  const [aboutTags, setAboutTags] = useState<string[]>(savedEntry?.aboutTags || []);
  const [characters, setCharacters] = useState<string[]>(savedEntry?.characters || []);
  const [beginning, setBeginning] = useState(savedEntry?.beginning || '');
  const [important, setImportant] = useState(savedEntry?.important || '');
  const [ending, setEnding] = useState(savedEntry?.ending || '');
  const [favoriteMoment, setFavoriteMoment] = useState(savedEntry?.favoriteMoment || '');
  const [rating, setRating] = useState(savedEntry?.rating || 0);
  const [mood, setMood] = useState(savedEntry?.mood || '');
  const [memoryAnswers, setMemoryAnswers] = useState<Record<string, string | string[]>>(savedEntry?.memoryAnswers || {});
  const [status, setStatus] = useState<BookStatus>(savedEntry?.status || 'reading');
  
  // Custom states for playful experience
  const [howWouldYouAct, setHowWouldYouAct] = useState(savedEntry?.howWouldYouAct || '');
  const [mostMagicalTags, setMostMagicalTags] = useState<string[]>(savedEntry?.mostMagicalTags || []);
  const [funnyMomentTags, setFunnyMomentTags] = useState<string[]>(savedEntry?.funnyMomentTags || []);
  const [otherCharacterInput, setOtherCharacterInput] = useState('');
  const [drawing, setDrawing] = useState(savedEntry?.drawing || '');
  const [showManualText, setShowManualText] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Canvas ref & drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasColor, setCanvasColor] = useState('#FF9F29'); // Default: Amber Gold
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // Automatically transition status from 'not_started' to 'reading' on initial open
  useEffect(() => {
    if (!savedEntry || savedEntry.status === 'not_started') {
      setStatus('reading');
    }
  }, [savedEntry]);

  // Automatically synchronize empty diary fields with responses from "Вспомни книгу" (MemoryQuiz)
  useEffect(() => {
    if (!book.memoryQuestions || book.memoryQuestions.length === 0) return;

    let updatedCharacters = [...characters];
    let updatedBeginning = beginning;
    let updatedImportant = important;
    let updatedEnding = ending;
    let updatedHowWouldYouAct = howWouldYouAct;

    book.memoryQuestions.forEach((q) => {
      const ans = memoryAnswers[q.id];
      if (!ans) return;

      // 1. Sequence -> Chronological plot (beginning, important, ending)
      if (q.type === 'sequence' && Array.isArray(ans) && ans.length >= 3) {
        if (!beginning) updatedBeginning = ans[0] || '';
        if (!important) updatedImportant = ans[1] || '';
        if (!ending) updatedEnding = ans[2] || '';
      }

      // 2. Match -> Characters
      if (q.type === 'match' && typeof ans === 'string') {
        try {
          const parsed = JSON.parse(ans);
          Object.keys(parsed).forEach((char) => {
            if (char && !updatedCharacters.includes(char)) {
              updatedCharacters.push(char);
            }
          });
        } catch (e) {
          // ignore
        }
      }

      // 3. Choice question with character answer or lesson
      if (q.type === 'choice' && typeof ans === 'string') {
        const questionLower = q.question.toLowerCase();
        if (questionLower.includes('кто') || questionLower.includes('герой') || questionLower.includes('персонаж')) {
          const realCharNames = playfulData.characters.filter(c => !c.isFake).map(c => c.name);
          if (realCharNames.includes(ans) && !updatedCharacters.includes(ans)) {
            updatedCharacters.push(ans);
          }
        }
        if (questionLower.includes('чему учит') || questionLower.includes('главная мысль')) {
          if (!howWouldYouAct) {
            updatedHowWouldYouAct = `Книга учит нас ${ans.toLowerCase()}`;
          }
        }
      }

      // 4. Text questions
      if (q.type === 'text' && typeof ans === 'string' && ans.trim().length > 5) {
        const textVal = ans.trim();
        const questionLower = q.question.toLowerCase();
        if (questionLower.includes('чему учит') || questionLower.includes('почему') || questionLower.includes('какой поступок')) {
          if (!howWouldYouAct) {
            updatedHowWouldYouAct = textVal;
          }
        }
      }
    });

    // Strip any fake characters if they ended up here
    const fakeCharNames = playfulData.characters.filter(c => c.isFake).map(c => c.name);
    updatedCharacters = updatedCharacters.filter(char => !fakeCharNames.includes(char));

    if (updatedBeginning !== beginning) setBeginning(updatedBeginning);
    if (updatedImportant !== important) setImportant(updatedImportant);
    if (updatedEnding !== ending) setEnding(updatedEnding);
    if (JSON.stringify(updatedCharacters) !== JSON.stringify(characters)) setCharacters(updatedCharacters);
    if (updatedHowWouldYouAct !== howWouldYouAct) setHowWouldYouAct(updatedHowWouldYouAct);
  }, [memoryAnswers, book.memoryQuestions]);

  // Sync about tags selection to about text block (so the text box gets pre-filled!)
  const handleToggleAboutTag = (tag: string) => {
    let newTags;
    if (aboutTags.includes(tag)) {
      newTags = aboutTags.filter((t) => t !== tag);
    } else {
      newTags = [...aboutTags, tag];
    }
    setAboutTags(newTags);

    // Dynamic generation of description to avoid manual input!
    if (newTags.length > 0) {
      // Stripping emojis for clean text
      const cleanTags = newTags.map(t => t.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "").trim());
      setAbout(`Эта замечательная книга рассказывает о: ${cleanTags.join(', ')}.`);
    } else {
      setAbout('');
    }
  };

  // Toggle Character cards selection
  const handleToggleCharacter = (charName: string) => {
    if (characters.includes(charName)) {
      setCharacters(characters.filter((c) => c !== charName));
    } else {
      setCharacters([...characters, charName]);
    }
  };

  // Add custom manual character
  const handleAddOtherCharacter = () => {
    const trimmed = otherCharacterInput.trim();
    if (trimmed && !characters.includes(trimmed)) {
      setCharacters([...characters, trimmed]);
      setOtherCharacterInput('');
    }
  };

  // Toggle Magical Stickers
  const handleToggleMagicalTag = (tag: string) => {
    if (mostMagicalTags.includes(tag)) {
      setMostMagicalTags(mostMagicalTags.filter((t) => t !== tag));
    } else {
      setMostMagicalTags([...mostMagicalTags, tag]);
    }
  };

  // Toggle Funny moments
  const handleToggleFunnyTag = (tag: string) => {
    if (funnyMomentTags.includes(tag)) {
      setFunnyMomentTags(funnyMomentTags.filter((t) => t !== tag));
    } else {
      setFunnyMomentTags([...funnyMomentTags, tag]);
    }
  };

  // Playful acting options in hero's shoes
  const actingOptions = [
    { text: 'Проявил бы мужество и пошёл на риск! 💪', value: 'risk' },
    { text: 'Попытался бы договориться мирно 🤝', value: 'talk' },
    { text: 'Обратился бы за помощью к мудрым наставникам 📚', value: 'help' },
    { text: 'Придумал бы хитрый логический план 🧩', value: 'plan' },
    { text: 'Проявил бы осторожность и выждал момент 🧭', value: 'wait' },
    { text: 'Поступил бы честно, невзирая на страх 🕊️', value: 'slipper' },
  ];

  // Draw board Canvas handlers
  const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const xOnClient = clientX - rect.left;
    const yOnClient = clientY - rect.top;
    
    // Scale correctly from CSS size back to internal canvas coordinates
    const x = (xOnClient / rect.width) * canvas.width;
    const y = (yOnClient / rect.height) * canvas.height;
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : canvasColor;
    ctx.lineWidth = brushSize;

    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setDrawing(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawing('');
  };

  // Initialize and load saved canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (savedEntry?.drawing) {
      const img = new Image();
      img.src = savedEntry.drawing;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [savedEntry, book.id]);

  // Save handers
  const handleSaveOnly = () => {
    // Collect magical tag summary into favoriteMoment text box to remain compatible with standard schema
    const tagsPart = mostMagicalTags.length > 0 ? `✨ Самое волшебное: ${mostMagicalTags.join(', ')}.` : '';
    const funnyPart = funnyMomentTags.length > 0 ? ` 😆 Смешные моменты: ${funnyMomentTags.join(', ')}.` : '';
    const actPart = howWouldYouAct ? ` 🧭 На месте героя поступил бы так: ${actingOptions.find(o => o.value === howWouldYouAct)?.text || ''}.` : '';
    const fullFavMoment = `${favoriteMoment}${favoriteMoment ? ' ' : ''}${tagsPart}${funnyPart}${actPart}`.trim();

    const entry: DiaryEntry = {
      bookId: book.id,
      status: status,
      about,
      characters,
      beginning,
      important,
      ending,
      favoriteMoment: fullFavMoment,
      rating,
      mood,
      memoryAnswers,
      updatedAt: new Date().toISOString(),
      drawing,
      howWouldYouAct,
      mostMagicalTags,
      funnyMomentTags,
      aboutTags,
    };
    onSave(entry, status, true);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleCompleteAndSave = () => {
    const tagsPart = mostMagicalTags.length > 0 ? `✨ Самое волшебное: ${mostMagicalTags.join(', ')}.` : '';
    const funnyPart = funnyMomentTags.length > 0 ? ` 😆 Смешные моменты: ${funnyMomentTags.join(', ')}.` : '';
    const actPart = howWouldYouAct ? ` 🧭 На месте героя поступил бы так: ${actingOptions.find(o => o.value === howWouldYouAct)?.text || ''}.` : '';
    const fullFavMoment = `${favoriteMoment}${favoriteMoment ? ' ' : ''}${tagsPart}${funnyPart}${actPart}`.trim();

    const entry: DiaryEntry = {
      bookId: book.id,
      status: 'done',
      about,
      characters,
      beginning,
      important,
      ending,
      favoriteMoment: fullFavMoment,
      rating,
      mood,
      memoryAnswers,
      updatedAt: new Date().toISOString(),
      drawing,
      howWouldYouAct,
      mostMagicalTags,
      funnyMomentTags,
      aboutTags,
    };
    onSave(entry, 'done');
  };

  return (
    <div 
      id="book-diary-editor" 
      className={`bg-white rounded-[36px] border-4 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 mb-10 ${
        isSerious ? 'border-slate-300' : isAdventure ? 'border-[#cbd2be]' : isFairy ? 'border-[#fecdd3]' : 'border-[#fed7aa]'
      }`}
    >
      
      {/* 🎪 Magic Header */}
      <div className={`relative p-6 sm:p-8 border-b-4 overflow-hidden ${themeHeaderBg} ${themeHeaderBorder}`}>
        
        {/* Whimsical clouds backdrop decorations */}
        <div className="absolute top-0 right-10 w-44 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 left-12 w-60 h-24 bg-emerald-100/40 rounded-full blur-xl pointer-events-none" />

        <button
          type="button"
          id="diary-back-btn"
          onClick={onClose}
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#4c6c29] hover:text-[#2b3b17] text-xs font-black font-display px-4 py-2 rounded-xl border-2 border-[#cbd2be] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer no-print"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к карте приключений
        </button>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <span className={`text-5xl sm:text-6xl p-3.5 bg-white rounded-3xl shadow-md border-2 select-none animate-bounce-slow ${themeHeaderBorder}`}>
              {book.icon}
            </span>
            <div>
              <span className={`inline-block font-black text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full font-display mb-1.5 border ${themeBadgeClass}`}>
                {themeStationPrefix} {book.id} • {book.zone}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800 leading-tight">
                {book.title}
              </h2>
              <p className={`text-xs sm:text-sm font-extrabold font-display ${themeAuthorText}`}>
                ✍️ Автор: {book.author}
              </p>
            </div>
          </div>
          
          {status === 'done' && (
            <div className="bg-emerald-500 text-white font-black font-display text-xs px-4 py-2 rounded-2xl shadow-md flex items-center gap-1.5 border-2 border-emerald-300 animate-pulse">
              <CheckCircle className="w-4 h-4" />
              Книга прочитана! ⭐
            </div>
          )}
        </div>

        {/* Watercolor sketch placeholder / Watercolor hint */}
        <div className="mt-6 p-4 bg-white/85 border-2 border-[#cbd2be] rounded-2xl shadow-2xs backdrop-blur-xs relative">
          <div className="absolute top-3 right-4 text-xs font-black text-amber-500/80 uppercase tracking-widest font-display">
            АКВАРЕЛЬНАЯ ЗАРИСОВКА 🎨
          </div>
          <span className="block text-[11px] font-black font-display text-[#4c6c29] uppercase tracking-widest mb-1.5">
            🖼️ Пейзаж этой книжной станции:
          </span>
          <p className="text-xs sm:text-sm text-slate-600 font-display italic leading-relaxed pl-1.5 border-l-2 border-emerald-400">
            «{book.illustration}»
          </p>
        </div>
      </div>

      {/* 🧭 Playful Interactive Body */}
      <div className={`p-6 sm:p-8 space-y-10 ${themeBodyBg}`}>
        
        {/* Welcome Traveller Banner */}
        <div className="bg-[#f5f9ed] border-2 border-[#cbd2be]/60 p-4 rounded-3xl flex items-center gap-3">
          <Smile className="w-10 h-10 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-black font-display text-[#2b3b17]">
              {isSerious ? "Добро пожаловать в мир мыслей и искренних историй! 🕊️" : "Привет, юный книжный путешественник! 👋"}
            </h4>
            <p className="text-xs text-slate-500 font-display">
              {isSerious 
                ? "Давай сохраним в твоём дневнике самые глубокие, нежные и важные мысли об этом произведении. Отмечай чувства героев и создавай свою памятную карточку!"
                : "Давай сохраним лучшие воспоминания об этой книге весело и без долгой скучной писанины! Выбирай картинки, нажимай кнопочки и раскрашивай!"}
            </p>
          </div>
        </div>

        {/* 📋 Section 1: О книге в двух словах (или в трёх!) */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              О книге в двух словах (или в трёх!)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans pl-1">
            Выбери, о чём эта волшебная история (можно выбрать несколько вариантов):
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {playfulData.aboutOptions.map((opt) => {
              const isSelected = aboutTags.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleToggleAboutTag(opt)}
                  className={`text-left p-3.5 rounded-2xl border-2 transition-all font-display text-xs sm:text-sm relative flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-[#ff9f29] text-[#804400] font-black scale-[1.02] shadow-sm'
                      : 'bg-[#fdfcf7] border-slate-200/80 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="pr-4 leading-snug">{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#ff9f29] border-[#ff9f29] text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Collapsible Manual custom writing scroll */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => setShowManualText(!showManualText)}
              className="text-xs text-[#5d8233] hover:text-[#3c541e] font-black font-display underline flex items-center gap-1 cursor-pointer"
            >
              {showManualText ? '📖 Спрятать свиток ручной записи' : '📜 Написать своё описание книги руками (секретный свиток)'}
            </button>
            
            {showManualText && (
              <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                <label className="block text-xs font-black font-display text-slate-600">
                  Твоё собственное описание сюжета:
                </label>
                <textarea
                  id="diary-about-textarea"
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Запиши своими словами, если хочешь..."
                  className="w-full bg-[#fdfcf7] border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#ff9f29] text-slate-700 text-xs sm:text-sm font-sans"
                />
              </div>
            )}
          </div>
        </div>

        {/* 👑 Section 2: Кто здесь самый-самый? */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Smile className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Кто здесь самый-самый? Отметь главных героев! 
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans pl-1">
            Выдели ключевых персонажей. Будь внимателен — среди них затесался весёлый небывалый гость! 😉
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
            {playfulData.characters.map((char) => {
              const isSelected = characters.includes(char.name);
              return (
                <div
                  key={char.name}
                  onClick={() => handleToggleCharacter(char.name)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
                    char.isFake 
                      ? isSelected 
                        ? 'bg-rose-50 border-rose-400 text-rose-800 font-black' 
                        : 'bg-rose-50/10 border-rose-100 text-slate-600 hover:border-rose-200'
                      : isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-black'
                        : 'bg-[#fdfcf7] border-slate-200/80 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-3xl p-1.5 bg-white rounded-xl shadow-2xs border border-slate-100 group-hover:scale-110 transition-transform select-none">
                      {char.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-black font-display leading-tight block truncate">
                          {char.name}
                        </span>
                        {char.isFake && (
                          <span className="bg-rose-100 text-rose-700 text-[8px] font-black uppercase px-1 rounded font-display select-none">
                            Шутка 🤫
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-tight">
                        {char.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                      isSelected 
                        ? char.isFake ? 'bg-rose-500 border-rose-500 text-white' : 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom extra character in secret */}
          <div className="pt-2 max-w-md">
            <label className="block text-xs font-black font-display text-slate-500 mb-1.5 pl-1">
              ✏️ Другой герой (напиши в секретике, если кого-то забыли):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otherCharacterInput}
                onChange={(e) => setOtherCharacterInput(e.target.value)}
                placeholder="Имя твоего героя..."
                className="flex-1 bg-[#fdfcf7] border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-display focus:outline-none focus:border-[#ff9f29]"
              />
              <button
                type="button"
                onClick={handleAddOtherCharacter}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black font-display text-xs px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Добавить
              </button>
            </div>
            {characters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400 font-black font-display uppercase tracking-wider block mr-1 self-center">Отмечены:</span>
                {characters.map((c) => (
                  <span key={c} className="bg-emerald-50 border border-emerald-100 text-[#4c6c29] text-[10px] font-black font-display px-2.5 py-1 rounded-lg flex items-center gap-1">
                    {c}
                    <button type="button" onClick={() => setCharacters(characters.filter(x => x !== c))} className="text-emerald-700/60 hover:text-emerald-900 font-sans font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🎬 Section 3: Хроника событий и Три акта */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <BookOpen className="w-5 h-5 text-[#5d8233]" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Порядок событий (разложи историю по полочкам)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans pl-1">
            Выбери, как развивались события в книге. Выбирай весёлые варианты для шуток или точные для хорошей оценки!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            {/* Act 1: Что случилось в начале */}
            <div className="space-y-3 p-4 bg-[#fcfdf8] border border-slate-200/60 rounded-2xl relative">
              <span className="absolute -top-3 left-4 bg-[#5d8233] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-display">
                1. Сначала... 📜
              </span>
              <div className="space-y-2 pt-2">
                {playfulData.beginningOptions.map((opt) => {
                  const isSelected = beginning === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBeginning(opt)}
                      className={`w-full text-left p-2.5 rounded-xl border-2 text-xs font-display leading-relaxed transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-2xs'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={beginning}
                onChange={(e) => setBeginning(e.target.value)}
                placeholder="Или напиши своё начало..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-sans text-slate-700"
              />
            </div>

            {/* Act 2: Что было самым важным */}
            <div className="space-y-3 p-4 bg-[#fcfdf8] border border-slate-200/60 rounded-2xl relative">
              <span className="absolute -top-3 left-4 bg-[#ff9f29] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-display">
                2. Самое важное! ⚡
              </span>
              <div className="space-y-2 pt-2">
                {playfulData.importantOptions.map((opt) => {
                  const isSelected = important === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setImportant(opt)}
                      className={`w-full text-left p-2.5 rounded-xl border-2 text-xs font-display leading-relaxed transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-[#ff9f29] text-[#804400] font-black shadow-2xs'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={important}
                onChange={(e) => setImportant(e.target.value)}
                placeholder="Или напиши своё главное..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-sans text-slate-700"
              />
            </div>

            {/* Act 3: Финал */}
            <div className="space-y-3 p-4 bg-[#fcfdf8] border border-slate-200/60 rounded-2xl relative">
              <span className="absolute -top-3 left-4 bg-sky-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-display">
                3. Чем закончилось? 🏆
              </span>
              <div className="space-y-2 pt-2">
                {playfulData.endingOptions.map((opt) => {
                  const isSelected = ending === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEnding(opt)}
                      className={`w-full text-left p-2.5 rounded-xl border-2 text-xs font-display leading-relaxed transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 text-sky-800 font-black shadow-2xs'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
                placeholder="Или напиши свой финал..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-sans text-slate-700"
              />
            </div>

          </div>
        </div>

        {/* 🧭 Section 4: Как бы поступил ты на месте главного героя? */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Как бы ты поступил на месте {playfulData.heroName || 'героя'}? 🧭
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans pl-1">
            Выбери свой мудрый план действий:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {actingOptions.map((opt) => {
              const isSelected = howWouldYouAct === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHowWouldYouAct(opt.value)}
                  className={`p-3.5 rounded-2xl border-2 transition-all font-display text-xs sm:text-sm text-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-500 text-white font-black scale-105 shadow-md'
                      : 'bg-[#fdfcf7] border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎨 Section 5: Нарисуй своё чудо (Canvas drawing board) */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Brush className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Нарисуй своё чудо 🎨
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans pl-1">
            Нарисуй пальцем или мышкой то чудо или момент из книги, который запомнился тебе больше всего! Рисунок сохранится в твоём дневнике!
          </p>

          <div className="flex flex-col lg:flex-row gap-5 pt-2 items-center lg:items-stretch">
            
            {/* Canvas Container */}
            <div className="relative border-4 border-[#eae5c9] rounded-[24px] overflow-hidden bg-white shadow-inner shrink-0 w-full max-w-[480px]">
              <canvas
                ref={canvasRef}
                width={480}
                height={280}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-auto aspect-[12/7] block cursor-crosshair touch-none bg-white"
              />
            </div>

            {/* Paint Brush controls and colors */}
            <div className="flex-1 flex flex-col justify-between p-2 space-y-4 w-full">
              
              <div className="space-y-3">
                <span className="block text-[10px] font-black font-display text-[#4c6c29] uppercase tracking-wider">
                  🎨 Твоя сказочная палитра красок:
                </span>
                
                {/* Colors circles */}
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { color: '#FF9F29', name: 'Золото' },
                    { color: '#5D8233', name: 'Лес' },
                    { color: '#C3645F', name: 'Рубин' },
                    { color: '#4079C9', name: 'Океан' },
                    { color: '#7C3AED', name: 'Магия' },
                    { color: '#1A1F11', name: 'Уголь' },
                  ].map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => {
                        setCanvasColor(item.color);
                        setIsEraser(false);
                      }}
                      title={item.name}
                      style={{ backgroundColor: item.color }}
                      className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 cursor-pointer ${
                        canvasColor === item.color && !isEraser
                          ? 'border-slate-800 scale-105 shadow-md'
                          : 'border-white shadow-2xs'
                      }`}
                    />
                  ))}

                  {/* Eraser Button */}
                  <button
                    type="button"
                    onClick={() => setIsEraser(true)}
                    className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all hover:scale-110 cursor-pointer bg-slate-100 ${
                      isEraser ? 'border-slate-800 scale-105 shadow-md' : 'border-white shadow-2xs'
                    }`}
                    title="Ластик"
                  >
                    <Eraser className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Brush size */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-black font-display text-slate-500 uppercase tracking-wider">
                  Размер кисточки: {brushSize}px
                </span>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Drawing stats/actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-black font-display text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Очистить холст
                </button>
                
                <div className="text-[11px] text-slate-400 font-display flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Шедевр сохраняется автоматически!
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 🌟 Section 6: Наклейки & Впечатления */}
        <div className="space-y-4 bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-base sm:text-lg font-black font-display text-slate-800">
              Мои впечатления и волшебные наклейки ⭐
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Rating */}
            <div className="space-y-2 p-4 bg-[#fdfcf7] rounded-2xl border border-slate-200/50">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Моя оценка книге:
              </label>
              <div className="py-2.5 px-4 bg-white border border-slate-100 rounded-2xl w-max shadow-2xs">
                <StarRating rating={rating} onChange={setRating} />
              </div>
              <p className="text-[10px] text-slate-400 font-sans italic">Поставь звёздочки, насколько история была увлекательной!</p>
            </div>

            {/* Mood picker */}
            <div className="space-y-2 p-4 bg-[#fdfcf7] rounded-2xl border border-slate-200/50">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Моё настроение после чтения:
              </label>
              <MoodPicker selectedMood={mood} onChange={setMood} />
            </div>
          </div>

          {/* Stickers tags */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-black font-display text-slate-700">
              Наклей наклейки! Что тебе понравилось больше всего? (Выбери несколько)
            </span>
            <div className="flex flex-wrap gap-2.5">
              {playfulData.mostMagicalTags.map((tag) => {
                const isSelected = mostMagicalTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleMagicalTag(tag)}
                    className={`text-xs font-black font-display px-4 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900 shadow-md scale-105 border-2 border-amber-500'
                        : 'bg-amber-50 text-[#b36200] hover:bg-amber-100/70 border-2 border-amber-100/40'
                    }`}
                  >
                    🌟 {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Funny moments tags */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-black font-display text-slate-700">
              Поделись смешным моментом! Что тебя рассмешило?
            </span>
            <div className="flex flex-wrap gap-2.5">
              {playfulData.funnyMomentTags.map((tag) => {
                const isSelected = funnyMomentTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleFunnyTag(tag)}
                    className={`text-xs font-black font-display px-4 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-md scale-105 border-2 border-rose-600'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100/70 border-2 border-rose-100/40'
                    }`}
                  >
                    🤪 {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Free Moment Writing text block */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
              Твой самый любимый момент своими словами:
            </label>
            <textarea
              id="diary-fav-moment-textarea"
              rows={2}
              value={favoriteMoment}
              onChange={(e) => setFavoriteMoment(e.target.value)}
              placeholder="Опиши момент, который тебя больше всего зацепил..."
              className="w-full bg-[#fdfcf7] border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#ff9f29] text-slate-700 text-xs sm:text-sm font-sans"
            />
          </div>
        </div>

        {/* 📚 Section 7: Проверка памяти (Memory Quiz) */}
        {book.memoryQuestions && book.memoryQuestions.length > 0 && (
          <div className="bg-white rounded-[28px] border-2 border-slate-100 p-1 sm:p-2 shadow-sm overflow-hidden">
            <MemoryQuiz
              questions={book.memoryQuestions}
              savedAnswers={memoryAnswers}
              onAnswersChange={setMemoryAnswers}
              isCompleted={status === 'done'}
            />
          </div>
        )}

        {/* 📝 Section 8: Итог книги (Book Summary) */}
        <div id="book-summary-block" className="bg-white rounded-[28px] border-2 border-slate-100 p-6 sm:p-8 shadow-sm no-print space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-slate-800">Итог книги</h3>
              <p className="text-xs text-slate-400 font-semibold font-sans">
                Сводный аккуратный отчет о прочитанном произведении
              </p>
            </div>
          </div>

          {(() => {
            const currentEntry: DiaryEntry = {
              bookId: book.id,
              about,
              characters,
              beginning,
              important,
              ending,
              favoriteMoment,
              rating,
              mood,
              memoryAnswers,
              status,
              howWouldYouAct,
              mostMagicalTags,
              funnyMomentTags,
              aboutTags,
              drawing,
              updatedAt: new Date().toISOString()
            };

            const resolved = resolveDiaryDetails(book, currentEntry);
            const fav = favoriteMoment?.trim();

            return (
              <div className="space-y-6">
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl text-left leading-relaxed">
                  Этот отчет автоматически и в реальном времени собирается на основе твоих ответов в блоке <strong>«Вспомни книгу»</strong> и дневниковых записей. Он содержит точные сведения о произведении для школы!
                </p>

                <div className="border-2 border-slate-300 rounded-2xl p-5 sm:p-6 bg-[#fffdf5] relative overflow-hidden shadow-xs text-left">
                  {/* Circular Stamp */}
                  <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-emerald-600/30 flex flex-col items-center justify-center rotate-12 select-none pointer-events-none opacity-80">
                    <span className="text-[9px] font-black font-display text-emerald-700 uppercase tracking-wider leading-none">Мудрость</span>
                    <span className="text-xl sm:text-2xl mt-0.5">📖</span>
                    <span className="text-[8px] font-bold font-sans text-emerald-600 mt-0.5">Одобрено</span>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Произведение</span>
                      <p className="text-base sm:text-lg font-black font-display text-slate-800">«{book.title}»</p>
                      <p className="text-xs text-slate-500 font-semibold font-sans">{book.author}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Главные герои</span>
                      <p className="text-xs sm:text-sm font-semibold font-sans text-slate-700">
                        {resolved.characters}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Очень краткое содержание (сюжет)</span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic bg-white/60 p-3 rounded-xl border border-slate-100">
                        {resolved.plot}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Главная мысль</span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                        {resolved.mainIdea}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Чему учит книга</span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                        {resolved.lesson}
                      </p>
                    </div>

                    {fav && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Любимый момент</span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-amber-50/50 p-2.5 rounded-lg border border-[#eae5c9] italic">
                          «{fav}»
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      if (onTriggerPrint) {
                        onTriggerPrint('book_summary', book.id);
                      } else {
                        window.print();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-display px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Распечатать отчёт / Сохранить в PDF
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 🎪 Keepsake Card Live Preview */}
        {status === 'done' && (
          <div className="pt-6 border-t-2 border-dashed border-amber-300">
            <h3 className="text-center font-black font-display text-slate-800 text-lg mb-4 flex items-center justify-center gap-1.5 animate-pulse">
              🎉 Твоя Памятная Открытка Читателя Готова! 🎉
            </h3>
            <KeepsakeCardComponent
              book={book}
              entry={{
                bookId: book.id,
                about,
                characters,
                beginning,
                important,
                ending,
                favoriteMoment,
                rating,
                mood,
                memoryAnswers,
                status,
                howWouldYouAct,
                mostMagicalTags,
                funnyMomentTags,
                aboutTags,
                drawing,
                updatedAt: savedEntry?.updatedAt || new Date().toISOString()
              }}
              childName={childName}
            />
          </div>
        )}

        {/* 🎪 Footer Actions Banner */}
        <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4 no-print">
          
          {isDraftSaved && (
            <span className="text-emerald-600 font-extrabold font-display text-xs sm:text-sm animate-bounce mr-2">
              🎒 Черновик успешно сохранён! ✨
            </span>
          )}

          <button
            type="button"
            id="diary-save-only-btn"
            onClick={handleSaveOnly}
            className="w-full sm:w-auto bg-[#eae5c9]/60 hover:bg-[#eae5c9] text-[#4c6c29] font-black font-display px-6 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-[#cbd2be] cursor-pointer text-xs sm:text-sm"
          >
            <Save className="w-5 h-5" />
            Сохранить черновик в рюкзак
          </button>

          <button
            type="button"
            id="diary-mark-completed-btn"
            onClick={handleCompleteAndSave}
            className="w-full sm:w-auto bg-[#ff9f29] hover:bg-[#e68512] text-white font-black font-display px-8 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm border-2 border-[#ffc880]"
          >
            <CheckCircle className="w-5 h-5" />
            {status === 'done' ? 'Сохранить изменения открытки ✨' : 'Отметить как прочитанную! 👑'}
          </button>
          
        </div>
      </div>
    </div>
  );
}
