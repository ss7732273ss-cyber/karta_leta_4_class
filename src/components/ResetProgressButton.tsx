import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetProgressButtonProps {
  onReset: () => void;
}

export default function ResetProgressButton({ onReset }: ResetProgressButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative inline-block no-print">
      <button
        type="button"
        id="reset-progress-trigger"
        onClick={() => setShowConfirm(true)}
        className="text-xs text-slate-400 hover:text-rose-500 font-display flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Сбросить прогресс
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-xl border-2 border-slate-700/5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h3 className="text-xl font-bold font-display text-slate-800 mb-2">Начать путешествие заново?</h3>
            <p className="text-sm text-slate-500 mb-6 font-sans">
              Это полностью удалит твой прогресс, все заполненные дневники и полученные медали. Это действие нельзя отменить!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                id="reset-cancel-btn"
                onClick={() => setShowConfirm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold font-display transition-all active:scale-95 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                id="reset-confirm-btn"
                onClick={() => {
                  onReset();
                  setShowConfirm(false);
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold font-display shadow-sm shadow-rose-200 transition-all active:scale-95 cursor-pointer"
              >
                Да, начать заново
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
