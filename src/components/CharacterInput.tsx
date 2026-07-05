import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CharacterInputProps {
  characters: string[];
  onChange: (characters: string[]) => void;
  readOnly?: boolean;
}

export default function CharacterInput({ characters, onChange, readOnly = false }: CharacterInputProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !characters.includes(trimmed)) {
      onChange([...characters, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (char: string) => {
    onChange(characters.filter((c) => c !== char));
  };

  return (
    <div className="w-full">
      {!readOnly && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="character-text-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Например: Иван-Царевич"
            className="flex-1 bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 font-display transition-colors"
          />
          <button
            type="button"
            id="add-character-btn"
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline font-display">Добавить</span>
          </button>
        </div>
      )}

      {characters.length === 0 ? (
        <p className="text-sm text-slate-400 italic font-display">Герои пока не добавлены. Добавь главных героев книги!</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {characters.map((char) => (
            <span
              key={char}
              className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold font-display px-3.5 py-1.5 rounded-full text-sm"
            >
              {char}
              {!readOnly && (
                <button
                  type="button"
                  id={`remove-char-${char}`}
                  onClick={() => handleRemove(char)}
                  className="hover:bg-emerald-100 p-0.5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
