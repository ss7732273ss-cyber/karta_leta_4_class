import React, { useState } from 'react';
import { Edit2, Check, Sparkles } from 'lucide-react';

interface HeaderHeroProps {
  childName: string;
  onNameChange: (name: string) => void;
}

export default function HeaderHero({ childName, onNameChange }: HeaderHeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(childName);

  const handleSave = () => {
    onNameChange(tempName.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#fffdf2] via-[#fef9c3]/50 to-[#ecfccb]/30 border-4 border-[#fcd34d] rounded-[36px] p-6 sm:p-10 overflow-hidden shadow-xl shadow-amber-500/5 mb-6 no-print">
      {/* Decorative stars / bubbles / elements representing summer and travel */}
      <div className="absolute top-6 right-6 text-amber-500 opacity-90 animate-bounce-slow">
        <Sparkles className="w-9 h-9" />
      </div>
      <div className="absolute -bottom-8 -right-6 text-8xl select-none opacity-20 pointer-events-none transform rotate-12">
        🧭
      </div>
      <div className="absolute bottom-6 left-6 text-emerald-500 opacity-25 text-5xl select-none pointer-events-none transform -rotate-12">
        📚
      </div>
      <div className="absolute top-1/2 right-1/4 text-yellow-400 opacity-30 text-6xl select-none pointer-events-none animate-pulse">
        ☀️
      </div>
      <div className="absolute -top-6 left-1/3 text-sky-400 opacity-20 text-7xl select-none pointer-events-none">
        🎈
      </div>

      <div className="max-w-2xl relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[#ff9f29]/20 text-[#b36200] font-black text-[11px] sm:text-xs font-display uppercase tracking-widest px-4 py-2 rounded-full mb-4 border-2 border-[#ff9f29]/30 shadow-2xs">
          🏕️ ТВОЯ ЛЕТНЯЯ КНИЖНАЯ ЭКСПЕДИЦИЯ ☀️
        </span>

        <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-800 leading-tight tracking-tight mb-3">
          Карта летних приключений 🗺️
        </h1>
        <p className="text-sm sm:text-lg font-black font-display text-[#4c6c29] mb-6 leading-relaxed">
          Интерактивный читательский дневник-экспедиция после 4 класса • 16 великих вершин, ярких открытий и незабываемых путешествий во время каникул! 🎒🎒⛵
        </p>

        {/* Kid's name block */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/95 border-2 border-[#fcd34d] p-4.5 rounded-2xl w-full sm:w-max shadow-md shadow-amber-500/5 backdrop-blur-xs">
          <span className="text-sm sm:text-base font-black text-slate-800 font-display flex items-center gap-2">
            {childName ? `Привет, смелый капитан ${childName}! 🧑‍✈️` : 'Привет, таинственный путешественник! 👋'}
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="kid-name-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введи своё имя..."
                className="bg-[#fdfcf7] border-2 border-[#ff9f29]/40 rounded-xl px-3 py-2 text-xs sm:text-sm font-display text-slate-800 focus:outline-none focus:border-[#ff9f29] focus:ring-2 focus:ring-[#ff9f29]/10"
                maxLength={20}
              />
              <button
                type="button"
                id="save-kid-name-btn"
                onClick={handleSave}
                className="bg-[#ff9f29] hover:bg-[#e68512] text-white p-2.5 rounded-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center border-2 border-[#ffc880] shadow-sm"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="edit-kid-name-trigger"
              onClick={() => {
                setTempName(childName);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#ff9f29] hover:text-[#e68512] font-black font-display underline underline-offset-4 decoration-dotted cursor-pointer transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {childName ? 'Изменить имя' : 'Записать моё имя во флаг корабля! 🚩'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
