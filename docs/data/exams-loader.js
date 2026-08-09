/**
 * Load and parse exams.json schema
 */

let _examsCache = null;

async function loadExams() {
  if (_examsCache) return _examsCache;
  
  try {
    const response = await fetch('data/exams.json');
    _examsCache = await response.json();
    return _examsCache;
  } catch (error) {
    console.error('Failed to load exams:', error);
    return null;
  }
}

async function getExam(examCode = '220-1201') {
  const exams = await loadExams();
  if (!exams || !exams.exams) return null;
  return exams.exams[examCode] || null;
}

async function getQuestionBank(examCode = '220-1201') {
  const exam = await getExam(examCode);
  return exam ? exam.questionBank : [];
}

/**
 * Shuffle array using Fisher-Yates
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
 * Shuffle options within a question
 */
function shuffleQuestion(question) {
  return {
    ...question,
    options: shuffleArray(question.options)
  };
}

/**
 * Normalize answer for comparison (case-insensitive, trim whitespace)
 */
function normalizeAnswer(answer) {
  return String(answer).trim().toLowerCase();
}

/**
 * Check if user answer is correct
 */
function isAnswerCorrect(question, userAnswer) {
  if (!question.correctAnswer || question.correctAnswer.length === 0) {
    return false;
  }
  
  const normalizedUser = normalizeAnswer(userAnswer);
  return question.correctAnswer.some(correct => 
    normalizeAnswer(correct) === normalizedUser
  );
}

/**
 * Get random questions from a pool
 */
function getRandomQuestions(count, questionBank) {
  const shuffled = shuffleArray(questionBank);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

window.examsLoader = {
  loadExams,
  getExam,
  getQuestionBank,
  shuffleArray,
  shuffleQuestion,
  normalizeAnswer,
  isAnswerCorrect,
  getRandomQuestions
};
