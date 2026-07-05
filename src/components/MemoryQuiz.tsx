import React, { useState, useEffect } from 'react';
import { MemoryQuestion } from '../types/reading';
import { ArrowUp, ArrowDown, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface MemoryQuizProps {
  questions: MemoryQuestion[];
  savedAnswers: Record<string, string | string[]>;
  onAnswersChange: (answers: Record<string, string | string[]>) => void;
  isCompleted: boolean;
}

export default function MemoryQuiz({ questions, savedAnswers, onAnswersChange, isCompleted }: MemoryQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(savedAnswers);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Initialize empty answers for unanswered questions
  useEffect(() => {
    const updated = { ...savedAnswers };
    questions.forEach((q) => {
      if (updated[q.id] === undefined) {
        if (q.type === 'sequence') {
          // Shuffle or just assign initial options list as string[]
          updated[q.id] = [...(q.options || [])];
        } else if (q.type === 'match') {
          // Store matches as Record<left, right> mapped to JSON string
          updated[q.id] = JSON.stringify({});
        } else {
          updated[q.id] = '';
        }
      }
    });
    setAnswers(updated);
  }, [questions, savedAnswers]);

  // Handle choice selection
  const handleChoiceSelect = (qId: string, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  // Handle text answers
  const handleTextChange = (qId: string, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  // Move sequence item Up/Down
  const handleMoveSequence = (qId: string, index: number, direction: 'up' | 'down') => {
    const list = [...(answers[qId] as string[] || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    const newAnswers = { ...answers, [qId]: list };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  // Handle Match Selection
  const handleMatchSelect = (qId: string, leftItem: string, rightItem: string) => {
    const currentMatches = JSON.parse((answers[qId] as string) || '{}');
    if (rightItem) {
      currentMatches[leftItem] = rightItem;
    } else {
      delete currentMatches[leftItem];
    }
    const newAnswers = { ...answers, [qId]: JSON.stringify(currentMatches) };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  // Grade the quiz
  const handleCheckQuiz = () => {
    let correctCount = 0;
    let totalCared = 0;

    questions.forEach((q) => {
      const ans = answers[q.id];
      if (q.type === 'choice') {
        totalCared++;
        if (ans === q.answer) correctCount++;
      } else if (q.type === 'sequence') {
        totalCared++;
        // Compare string arrays
        const isCorrect = JSON.stringify(ans) === JSON.stringify(q.answer);
        if (isCorrect) correctCount++;
      } else if (q.type === 'match') {
        totalCared++;
        const currentMatches = JSON.parse((ans as string) || '{}');
        let matchesAll = true;
        q.pairs?.forEach((pair) => {
          if (currentMatches[pair.left] !== pair.right) {
            matchesAll = false;
          }
        });
        if (matchesAll && q.pairs && q.pairs.length > 0) correctCount++;
      } else if (q.type === 'text') {
        // Free text matches if length > 4 chars
        if ((ans as string || '').trim().length > 4) {
          correctCount++;
        }
        totalCared++;
      }
    });

    setScore({ correct: correctCount, total: totalCared });
    setShowResults(true);
  };

  // Render score message
  const getFeedbackMessage = () => {
    const ratio = score.correct / score.total;
    if (ratio === 1) return 'Ты потрясающе помнишь книгу! Станция полностью пройдена! 🎉';
    if (ratio >= 0.7) return 'Отлично, главные события на месте! Станция почти разгадана! ✨';
    if (ratio >= 0.4) return 'Ты хорошо помнишь эту книгу, но можно ещё раз заглянуть в ответы! 📚';
    return 'Можно заглянуть в дневник и вспомнить ещё пару деталей! 💫';
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60">
        <HelpCircle className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-extrabold font-display text-slate-800">Блок «Вспомни книгу»</h3>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const currentVal = answers[q.id];

          return (
            <div key={q.id} className="space-y-2.5">
              <label className="block text-sm font-black font-display text-slate-700 leading-tight">
                {qIndex + 1}. {q.question}
              </label>

              {/* Choice Input */}
              {q.type === 'choice' && q.options && (
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = currentVal === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChoiceSelect(q.id, opt)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-display text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold shadow-xs'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text Input */}
              {q.type === 'text' && (
                <textarea
                  id={`text-quiz-${q.id}`}
                  rows={2}
                  value={(currentVal as string) || ''}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  placeholder="Запиши свои воспоминания или мысли здесь..."
                  className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs sm:text-sm font-sans transition-colors resize-y"
                />
              )}

              {/* Sequence Input */}
              {q.type === 'sequence' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 font-bold font-display uppercase tracking-wider block">
                    Используй стрелочки, чтобы расположить по порядку:
                  </span>
                  <div className="space-y-1.5">
                    {((currentVal as string[]) || []).map((item, itemIdx, arr) => (
                      <div
                        key={item}
                        className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-2xs"
                      >
                        <span className="text-xs sm:text-sm font-medium font-sans text-slate-600">
                          {itemIdx + 1}. {item}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveSequence(q.id, itemIdx, 'up')}
                            disabled={itemIdx === 0}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSequence(q.id, itemIdx, 'down')}
                            disabled={itemIdx === arr.length - 1}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Input */}
              {q.type === 'match' && q.pairs && (
                <div className="space-y-2.5">
                  <span className="text-[11px] text-slate-400 font-bold font-display uppercase tracking-wider block">
                    Подбери правильные пары героев и событий:
                  </span>
                  <div className="space-y-2">
                    {q.pairs.map((pair) => {
                      const matchedVal = JSON.parse((currentVal as string) || '{}')[pair.left] || '';
                      return (
                        <div
                          key={pair.left}
                          className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs"
                        >
                          <span className="text-xs font-black font-display text-slate-700 sm:text-right sm:pr-4">
                            {pair.left}
                          </span>
                          <select
                            id={`match-select-${q.id}-${pair.left}`}
                            value={matchedVal}
                            onChange={(e) => handleMatchSelect(q.id, pair.left, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-600 focus:outline-none focus:border-emerald-300 w-full"
                          >
                            <option value="">-- Выбери совпадение --</option>
                            {q.pairs?.map((p) => (
                              <option key={p.right} value={p.right}>
                                {p.right}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grade Trigger Button */}
      <div className="pt-4 border-t border-slate-200/60 flex flex-col items-center gap-3">
        <button
          type="button"
          id="check-quiz-answers-btn"
          onClick={handleCheckQuiz}
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-extrabold font-display px-6 py-2.5 rounded-xl transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          Проверить ответы памяти
        </button>

        {showResults && (
          <div
            id="quiz-results-panel"
            className={`w-full p-4 rounded-2xl border flex items-start gap-3 transition-all animate-in fade-in duration-300 ${
              score.correct === score.total
                ? 'bg-emerald-100/40 border-emerald-300 text-emerald-800'
                : 'bg-amber-100/40 border-amber-300 text-amber-800'
            }`}
          >
            {score.correct === score.total ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="block text-xs font-extrabold font-display">
                Правильно разгадано: {score.correct} из {score.total} вопросов!
              </span>
              <p className="text-xs font-semibold font-display mt-1 leading-tight">
                {getFeedbackMessage()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
