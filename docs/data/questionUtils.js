/**
 * Question utilities — all helpers for data resolution, validation, and generation
 */

let _dynamicCache = null;

async function loadDynamicAnswers() {
  if (!_dynamicCache) {
    const res = await fetch('./data/dynamicAnswers.json');
    _dynamicCache = await res.json();
  }
  return _dynamicCache;
}

/**
 * Resolve dynamic question with state and national context
 */
async function resolveQuestion(raw, userState = 'CA') {
  if (raw.answerType === 'fixed') return { ...raw };

  const resolved = { ...raw };
  const dynamicData = await loadDynamicAnswers();

  if (raw.answerType === 'dynamic-national') {
    const d = dynamicData.national[raw.dynamicKey];
    resolved.displayAnswer = d?.displayAnswer ?? '';
    resolved.acceptableAnswers = d?.acceptableAnswers ?? [];
  }

  if (raw.answerType === 'dynamic-state') {
    const d = dynamicData.states[userState]?.[raw.dynamicKey];
    resolved.displayAnswer = d?.displayAnswer ?? '';
    resolved.acceptableAnswers = d?.acceptableAnswers ?? [];
  }

  resolved._unresolved = !resolved.displayAnswer;
  return resolved;
}

/**
 * Normalize answer for comparison — ignore case, articles, punctuation, whitespace
 */
function normalizeAnswer(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[.,'"()]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Check if user answer matches any acceptable answer
 */
function isAnswerCorrect(q, userAnswer) {
  if (!q.acceptableAnswers || q.acceptableAnswers.length === 0) return false;
  const norm = normalizeAnswer(userAnswer);
  return q.acceptableAnswers.some(a => normalizeAnswer(a) === norm);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get random questions from a pool, deduped by normalized question text
 */
function getRandomQuestions(count, pool) {
  const shuffled = shuffleArray(pool);
  const result = [];
  const seenNormalized = new Set();

  for (const q of shuffled) {
    if (result.length >= count) break;
    const normalized = normalizeAnswer(q.question);
    if (!seenNormalized.has(normalized)) {
      seenNormalized.add(normalized);
      result.push(q);
    }
  }

  return result;
}

/**
 * Get all questions by category
 */
function getQuestionsByCategory(category, pool) {
  return pool.filter(q => q.category === category);
}

/**
 * Get 65/20 subset
 */
function get65_20Questions(pool) {
  return pool.filter(q => q.is65_20 === true);
}

/**
 * Get dynamic questions (need resolution)
 */
function getDynamicQuestions(pool) {
  return pool.filter(q => q.answerType !== 'fixed');
}

/**
 * Get fixed questions (ready to use)
 */
function getFixedQuestions(pool) {
  return pool.filter(q => q.answerType === 'fixed');
}

/**
 * Count correct answers in session
 */
function countCorrect(session, allQuestions) {
  return Object.entries(session.answers).filter(([qId, userAns]) => {
    const q = allQuestions.find(qq => String(qq.id) === String(qId));
    return q && isAnswerCorrect(q, userAns);
  }).length;
}

/**
 * Generate distractors using answerFormat from schema
 */
function generateDistractors(correctAnswer, answerFormat, pool, currentId) {
  const sameFormat = pool
    .filter(q => q.id !== currentId && q.answerFormat === answerFormat)
    .flatMap(q => [q.displayAnswer, ...q.acceptableAnswers])
    .filter(Boolean);

  const deduped = [...new Set(sameFormat)];
  const shuffled = shuffleArray(deduped);
  const distractors = shuffled.slice(0, 3);

  // Fallback if not enough same-format distractors
  while (distractors.length < 3) {
    const fallback = generateFallbackDistractor(answerFormat, correctAnswer);
    if (!distractors.includes(fallback) && fallback !== correctAnswer) {
      distractors.push(fallback);
    }
  }

  return distractors;
}

/**
 * Generate fallback distractor based on format
 */
function generateFallbackDistractor(format, correctAnswer) {
  switch (format) {
    case 'date':
    case 'number':
      const num = parseInt(correctAnswer) || 2000;
      return String(num + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 50) + 1));
    case 'person':
      const names = ['John Smith', 'Jane Doe', 'Thomas Brown', 'Mary Johnson', 'Robert Lee', 'Sarah Williams'];
      return names[Math.floor(Math.random() * names.length)];
    case 'place':
      const places = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      return places[Math.floor(Math.random() * places.length)];
    case 'concept':
    case 'document':
    case 'freeform':
    default:
      const responses = ['Not specified', 'Unknown', 'Various', 'Depends on state', 'Multiple options'];
      return responses[Math.floor(Math.random() * responses.length)];
  }
}

/**
 * Build multiple choice options (1 correct + 3 distractors)
 */
function buildMultipleChoice(q, allQuestions) {
  const correctAnswer = q.displayAnswer;
  const distractors = generateDistractors(correctAnswer, q.answerFormat, allQuestions, q.id);
  const allOptions = [correctAnswer, ...distractors];
  return shuffleArray(allOptions);
}
