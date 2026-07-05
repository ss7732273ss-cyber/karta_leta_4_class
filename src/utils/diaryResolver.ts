import { Book, DiaryEntry } from '../types/reading';
import { getPlayfulBookData, PlayfulBookData } from '../data/playfulData';

export interface ResolvedDiaryData {
  characters: string;
  plot: string;
  mainIdea: string;
  lesson: string;
  beginning: string;
  important: string;
  ending: string;
}

/**
 * Resolves the absolute best factual and educational details for a book,
 * automatically synthesizing them from the "Вспомни книгу" (MemoryQuiz) answers,
 * manual diary entries, and playful curated options (filtering out the funny/joke elements).
 */
export function resolveDiaryDetails(book: Book, entry: DiaryEntry): ResolvedDiaryData {
  const playfulData = getPlayfulBookData(book.id, book.title, book.author, book.zone, book.type);

  // 1. RESOLVE CHARACTERS (Главные герои)
  // Priority 1: Manual characters entered/selected by the child
  let resolvedCharactersList = entry.characters && entry.characters.length > 0
    ? [...entry.characters]
    : [];

  // Priority 2: Extract from Match quiz answers if present
  if (resolvedCharactersList.length === 0 && book.memoryQuestions) {
    book.memoryQuestions.forEach((q) => {
      const ans = entry.memoryAnswers?.[q.id];
      if (!ans) return;

      if (q.type === 'match' && typeof ans === 'string') {
        try {
          const parsed = JSON.parse(ans);
          Object.keys(parsed).forEach((char) => {
            if (char && !resolvedCharactersList.includes(char)) {
              resolvedCharactersList.push(char);
            }
          });
        } catch (e) {
          // ignore
        }
      }
      
      if (q.type === 'choice' && typeof ans === 'string') {
        const questionLower = q.question.toLowerCase();
        if (questionLower.includes('кто') || questionLower.includes('герой') || questionLower.includes('персонаж')) {
          // Add answer if it matches any known real characters
          const realCharNames = playfulData.characters.filter(c => !c.isFake).map(c => c.name);
          if (realCharNames.includes(ans) && !resolvedCharactersList.includes(ans)) {
            resolvedCharactersList.push(ans);
          }
        }
      }
    });
  }

  // Filter out any funny/fake characters (e.g. "Тапок-волшебник", "Космический пончик")
  const fakeCharNames = playfulData.characters.filter(c => c.isFake).map(c => c.name);
  resolvedCharactersList = resolvedCharactersList.filter(char => !fakeCharNames.includes(char));

  // Priority 3: Curated clean character list
  if (resolvedCharactersList.length === 0 && playfulData.characters) {
    resolvedCharactersList = playfulData.characters
      .filter(c => !c.isFake)
      .map(c => c.name);
  }

  const resolvedCharacters = resolvedCharactersList.length > 0
    ? resolvedCharactersList.join(', ')
    : 'Главные герои произведения';


  // 2. RESOLVE THREE ACTS CHRONOLOGY (beginning, important, ending)
  let resolvedBeginning = entry.beginning?.trim() || '';
  let resolvedImportant = entry.important?.trim() || '';
  let resolvedEnding = entry.ending?.trim() || '';

  // Extract from Sequence memory quiz answer if present (which contains exactly the ordered events!)
  if ((!resolvedBeginning || !resolvedImportant || !resolvedEnding) && book.memoryQuestions) {
    book.memoryQuestions.forEach((q) => {
      const ans = entry.memoryAnswers?.[q.id];
      if (q.type === 'sequence' && Array.isArray(ans) && ans.length >= 3) {
        // Compare with corrected/arranged answers
        if (!resolvedBeginning) resolvedBeginning = ans[0] || '';
        if (!resolvedImportant) resolvedImportant = ans[1] || '';
        if (!resolvedEnding) resolvedEnding = ans[2] || '';
      }
    });
  }

  // Fallback values from playfulData (filtered to avoid joke ending options)
  if (!resolvedBeginning && playfulData.beginningOptions) {
    resolvedBeginning = playfulData.beginningOptions.filter(opt => !opt.includes('💤') && !opt.includes('чипсы'))[0] || '';
  }
  if (!resolvedImportant && playfulData.importantOptions) {
    resolvedImportant = playfulData.importantOptions.filter(opt => !opt.includes('🥣') && !opt.includes('конфет'))[0] || '';
  }
  if (!resolvedEnding && playfulData.endingOptions) {
    resolvedEnding = playfulData.endingOptions.filter(opt => !opt.includes('Гавайи') && !opt.includes('корыте') && !opt.includes('Луну'))[0] || '';
  }


  // 3. RESOLVE SHORT SUMMARY / PLOT (Очень краткое содержание)
  const plotParts = [resolvedBeginning, resolvedImportant, resolvedEnding].map(p => p.trim()).filter(Boolean);
  let resolvedPlot = '';
  
  if (plotParts.length > 0) {
    resolvedPlot = plotParts.map(p => p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.').join(' ');
  } else if (entry.about?.trim()) {
    resolvedPlot = entry.about.trim();
  } else if (book.memoryQuestions) {
    // Check for any text responses from memory quiz
    const textVals: string[] = [];
    book.memoryQuestions.forEach((q) => {
      const ans = entry.memoryAnswers?.[q.id];
      if (q.type === 'text' && typeof ans === 'string' && ans.trim().length > 4) {
        textVals.push(ans.trim());
      }
    });
    if (textVals.length > 0) {
      resolvedPlot = textVals.map(p => p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.').join(' ');
    }
  }

  if (!resolvedPlot && playfulData.aboutOptions) {
    // Find first aboutOption that does NOT contain a joke/fake emoji (e.g. 🍝, 🛸, 🍩)
    resolvedPlot = playfulData.aboutOptions.filter(opt => !opt.includes('макаронах') && !opt.includes('драконе') && !opt.includes('тапочек') && !opt.includes('пончик'))[0] || 'Увлекательная история, полная важных открытий.';
  }


  // 4. RESOLVE MAIN IDEA (Главная мысль)
  let resolvedMainIdea = '';
  
  if (entry.aboutTags && entry.aboutTags.length > 0) {
    resolvedMainIdea = `Это произведение рассказывает о таких важных ценностях, как ${entry.aboutTags.map(t => t.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "").trim().toLowerCase()).join(', ')}.`;
  } else if (entry.about?.trim()) {
    resolvedMainIdea = entry.about.trim();
  }

  // Extract from Choice / Text memory questions about main ideas/lessons
  if (!resolvedMainIdea && book.memoryQuestions) {
    book.memoryQuestions.forEach((q) => {
      const ans = entry.memoryAnswers?.[q.id];
      if (!ans) return;

      const questionLower = q.question.toLowerCase();
      if (questionLower.includes('главная мысль') || questionLower.includes('чему учит') || questionLower.includes('почему')) {
        if (typeof ans === 'string' && ans.length > 5) {
          resolvedMainIdea = `Книга помогает понять: ${ans.toLowerCase()}${ans.endsWith('.') ? '' : '.'}`;
        }
      }
    });
  }

  if (!resolvedMainIdea && playfulData.aboutOptions) {
    // Find second/third serious option
    const filteredAbout = playfulData.aboutOptions.filter(opt => !opt.includes('макаронах') && !opt.includes('драконе') && !opt.includes('тапочек') && !opt.includes('пончик'));
    resolvedMainIdea = filteredAbout[1] || filteredAbout[0] || 'Важность дружбы, верности и честности в любых жизненных ситуациях.';
  }


  // 5. RESOLVE LESSON (Чему учит книга)
  let resolvedLesson = '';

  if (entry.howWouldYouAct?.trim()) {
    // Priority 1: Playing in hero's shoes (map short key to beautiful description)
    const actingOptionsMap: Record<string, string> = {
      'risk': 'Проявил бы мужество и пошёл на риск! 💪',
      'talk': 'Попытался бы договориться мирно 🤝',
      'help': 'Обратился бы за помощью к мудрым наставникам 📚',
      'plan': 'Придумал бы хитрый логический план 🧩',
      'wait': 'Проявил бы осторожность и выждал момент 🧭',
      'slipper': 'Поступил бы честно, невзирая на страх 🕊️',
    };
    const actionText = actingOptionsMap[entry.howWouldYouAct] || entry.howWouldYouAct;
    resolvedLesson = `Поставив себя на место главного героя, читатель решил поступить так: «${actionText}».`;
  } else if (entry.mostMagicalTags && entry.mostMagicalTags.length > 0) {
    // Priority 2: Best qualities
    resolvedLesson = `История учит проявлять лучшие человеческие качества: ${entry.mostMagicalTags.slice(0, 3).map(t => t.toLowerCase()).join(', ')}.`;
  }

  // Priority 3: Extract from Memory Quiz lesson-oriented questions
  if (!resolvedLesson && book.memoryQuestions) {
    book.memoryQuestions.forEach((q) => {
      const ans = entry.memoryAnswers?.[q.id];
      if (!ans) return;

      const questionLower = q.question.toLowerCase();
      if (questionLower.includes('учит') || questionLower.includes('почему') || questionLower.includes('какой поступок')) {
        if (typeof ans === 'string' && ans.length > 5) {
          resolvedLesson = `Учит поступать правильно: ${ans.toLowerCase()}${ans.endsWith('.') ? '' : '.'}`;
        }
      }
    });
  }

  if (!resolvedLesson) {
    if (book.zone === 'Долина преданий') {
      resolvedLesson = 'Сказка или легенда учит преодолевать трудности, ценить дружбу, верность слову и верить в силу добра.';
    } else if (book.zone === 'Берега природы и судеб') {
      resolvedLesson = 'Произведение учит сопереживать животным и природе, ценить преданность, бережно относиться ко всему живому и брать ответственность за тех, кого приручили.';
    } else if (book.zone === 'Перевал мужества') {
      resolvedLesson = 'Повесть учит невероятной силе духа, стойкости в тяжелые минуты, состраданию к ближним и преодолению любых трудностей ради благородной цели.';
    } else if (book.zone === 'Горизонты открытий') {
      resolvedLesson = 'Книга учит смекалке, любознательности, вере в силу науки и разума, а также дружбе и взаимовыручке в весёлых приключениях.';
    } else {
      resolvedLesson = 'Рассказ учит честности, уважению к окружающим, ответственности за свои слова и проявлению искренней заботы и доброты.';
    }
  }

  return {
    characters: resolvedCharacters,
    plot: resolvedPlot,
    mainIdea: resolvedMainIdea,
    lesson: resolvedLesson,
    beginning: resolvedBeginning || 'Начало приключения',
    important: resolvedImportant || 'Главное событие',
    ending: resolvedEnding || 'Конец приключения',
  };
}
