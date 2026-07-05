import React from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { calculateStats } from '../utils/progress';
import { resolveDiaryDetails } from '../utils/diaryResolver';
import { Printer, X, Star, Heart, Calendar, Award, BookOpen, Clock, Check } from 'lucide-react';

interface PrintPreviewModalProps {
  type: 'diary' | 'diploma' | null;
  booksList: Book[];
  entries: Record<number, DiaryEntry>;
  childName: string;
  onClose: () => void;
  onPrint: () => void;
}

export default function PrintPreviewModal({
  type,
  booksList,
  entries,
  childName,
  onClose,
  onPrint,
}: PrintPreviewModalProps) {
  if (!type) return null;

  const stats = calculateStats(entries);
  const printDateString = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const activeBooks = booksList.filter((b) => entries[b.id] && entries[b.id].status === 'done');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 no-print animate-in fade-in duration-200">
      <div className="bg-[#fcfcf7] border-4 border-[#eae5c9] w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white/95">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff9f29]" />
            <h2 className="text-sm sm:text-base font-black font-display text-slate-800">
              {type === 'diary' ? '📖 Читательский дневник капитана' : '🏆 Почётный диплом мастера'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrint}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-display px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              Печать / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#F7F9F6]">
          
          {/* DIARY PREVIEW */}
          {type === 'diary' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Title Card */}
              <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 text-center shadow-xs relative overflow-hidden">
                <div className="absolute top-4 right-4 text-emerald-500/10 text-6xl select-none pointer-events-none font-mono">
                  ★
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-2 font-display">
                  Летний Дневник Чтения
                </span>
                <h1 className="text-3xl font-black font-display text-slate-800 leading-tight">
                  КАРТА ЛЕТА
                </h1>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Книжное приключение после 3 класса
                </p>
                
                <div className="w-16 h-1 bg-emerald-500 mx-auto my-5 rounded-full" />
                
                <p className="text-xs text-slate-500 font-sans">Путешественник-искатель:</p>
                <h3 className="text-xl font-black text-slate-800 underline decoration-emerald-500 decoration-wavy underline-offset-4 mt-1 font-display">
                  {childName || 'Юный читатель'}
                </h3>

                <div className="mt-6 p-4 bg-[#fcfcf7] border border-[#eae5c9] rounded-2xl max-w-sm mx-auto">
                  <span className="text-xs font-bold text-slate-600 block">Летний результат чтения:</span>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    Прочитано {activeBooks.length} из {booksList.length} книг
                  </p>
                </div>
              </div>

              {/* Checklist Grid Card */}
              <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-black font-display text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Список станций и успехи
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {booksList.map((book) => {
                    const entry = entries[book.id];
                    const isDone = entry?.status === 'done';
                    return (
                      <div
                        key={book.id}
                        className="flex justify-between items-center py-2 border-b border-slate-50 text-xs"
                      >
                        <span className="truncate max-w-[70%] text-slate-700">
                          <strong className="font-mono text-slate-400 mr-1.5">{book.id}.</strong>
                          {book.title}
                        </span>
                        <span
                          className={`font-black font-display px-2.5 py-0.5 rounded-full text-[10px] ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : entry?.status === 'reading'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}
                        >
                          {isDone ? '✓ Прочитано' : entry?.status === 'reading' ? '• Читаю' : 'Не начато'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Read Books Content */}
              {activeBooks.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 text-center shadow-xs">
                  <p className="text-xs text-slate-400 italic">
                    Пока нет полностью прочитанных книг. Начни читать и заполни дневник, чтобы записи появились здесь! ✨
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeBooks.map((book) => {
                    const entry = entries[book.id];
                    if (!entry) return null;

                    const resolved = resolveDiaryDetails(book, entry);

                    return (
                      <div key={book.id} className="bg-white border-2 border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xs space-y-4 text-left">
                        <div className="flex justify-between items-start pb-3 border-b border-slate-100 gap-2">
                          <div>
                            <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider block font-display">
                              Станция {book.id} • {book.zone}
                            </span>
                            <h4 className="text-base font-black font-display text-slate-800">«{book.title}»</h4>
                            <p className="text-xs text-slate-400 font-semibold font-sans">{book.author}</p>
                          </div>
                          <div className="text-right flex flex-col items-end shrink-0">
                            <div className="flex text-amber-400 text-sm">
                              {'★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating)}
                            </div>
                            <span className="text-xl mt-1 select-none">{entry.mood}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Главные герои</span>
                            <p className="text-xs font-semibold text-slate-700">{resolved.characters}</p>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Очень краткое содержание (сюжет)</span>
                            <p className="text-xs text-slate-700 leading-relaxed italic bg-[#fffdf7] p-3 rounded-xl border border-[#eae5c9]/60">
                              {resolved.plot}
                            </p>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Главная мысль</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-sans">{resolved.mainIdea}</p>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Чему учит книга</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-sans">{resolved.lesson}</p>
                          </div>

                          {entry.favoriteMoment && (
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Любимый момент</span>
                              <p className="text-xs text-slate-700 leading-relaxed font-sans italic bg-amber-50/20 p-2.5 rounded-lg border border-amber-100/30">
                                «{entry.favoriteMoment}»
                              </p>
                            </div>
                          )}

                          {entry.drawing && (
                            <div className="flex flex-col items-center pt-2 font-sans">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block self-start mb-1">Рисунок книжного чуда</span>
                              <img
                                src={entry.drawing}
                                className="max-w-[280px] max-h-[140px] object-contain border border-slate-200 rounded-xl bg-slate-50"
                                alt="Книжное чудо"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DIPLOMA PREVIEW */}
          {type === 'diploma' && (
            <div className="max-w-xl mx-auto bg-white border-2 border-slate-200 rounded-[24px] p-6 sm:p-10 shadow-xs">
              <div className="border-8 border-double border-amber-500 rounded-xl p-6 sm:p-8 text-center bg-amber-50/10 space-y-6">
                <div>
                  <span className="text-xs font-black tracking-widest text-amber-700 block uppercase font-display">
                    ПОЧЁТНЫЙ ДИПЛОМ
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase leading-tight mt-1 font-display">
                    МАСТЕР ЛЕТНЕГО ЧТЕНИЯ
                  </h1>
                  <div className="w-32 h-1 bg-amber-500 mx-auto my-4 rounded-full" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                    Награждается юный путешественник Книжного леса:
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 underline decoration-amber-500 decoration-wavy underline-offset-6 font-display">
                    {childName || 'Храбрый Читатель'}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed pt-2">
                    За великолепное прохождение всех станций интерактивного маршрута <strong className="text-slate-700">«Карта лета»</strong> после 3 класса, заведение читательского дневника, усердный труд и отличные ответы на проверках памяти!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto p-3 bg-white border border-amber-200/60 rounded-xl text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Пройдено станций</span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      {activeBooks.length} из {booksList.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Наградные медали</span>
                    <span className="text-base font-black text-amber-600 font-mono">
                      {Object.values(stats.medals).filter(Boolean).length} из 4
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 text-[10px] text-slate-400 font-sans pt-4 border-t border-slate-100">
                  <div className="text-left">
                    <span>Подпись: _________________</span>
                    <span className="block text-[8px] text-slate-400 mt-0.5">Родитель или Учитель</span>
                  </div>
                  <div className="text-right">
                    <span>Дата: {printDateString}</span>
                    <span className="block text-[8px] text-slate-400 mt-0.5">Летнее приключение</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
