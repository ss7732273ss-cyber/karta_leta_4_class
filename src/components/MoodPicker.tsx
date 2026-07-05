import React from 'react';

interface MoodPickerProps {
  selectedMood: string;
  onChange: (mood: string) => void;
  readOnly?: boolean;
}

export const moods = [
  { emoji: '😊', label: 'Понравилось', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { emoji: '😍', label: 'Очень понравилось', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { emoji: '🤔', label: 'Было интересно подумать', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { emoji: '😢', label: 'Было грустно', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  { emoji: '😄', label: 'Было весело', color: 'bg-amber-50 border-amber-200 text-amber-700' },
];

export default function MoodPicker({ selectedMood, onChange, readOnly = false }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
      {moods.map((m) => {
        const isSelected = selectedMood === m.emoji;
        return (
          <button
            key={m.emoji}
            id={`mood-btn-${m.emoji}`}
            type="button"
            disabled={readOnly}
            onClick={() => onChange(m.emoji)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'
            } ${
              isSelected
                ? `${m.color} scale-102 font-bold ring-2 ring-emerald-400`
                : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
            }`}
          >
            <span className="text-3xl mb-1">{m.emoji}</span>
            <span className="text-xs text-center font-display leading-tight">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
