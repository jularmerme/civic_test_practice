/**
 * Convert questions from old schema to new exam schema
 * Generates distractors based on answer type (year, number, name, text)
 */

const fs = require('fs');
const path = require('path');

// Load existing questions
const questionsPath = path.join(__dirname, '../docs/data/questions.js');
let questionsContent = fs.readFileSync(questionsPath, 'utf8');

// Extract JSON array
const startIdx = questionsContent.indexOf('[');
const endIdx = questionsContent.lastIndexOf(']') + 1;
let jsonStr = questionsContent.substring(startIdx, endIdx);

// Remove any trailing function definitions
jsonStr = jsonStr.replace(/\];.*$/s, '];');

let oldQuestions = [];
try {
  oldQuestions = eval(jsonStr);
} catch (e) {
  console.error('Error parsing questions:', e.message);
  process.exit(1);
}

console.log(`Loaded ${oldQuestions.length} old format questions`);

// Helper: Detect answer type
function getAnswerType(answer) {
  if (!answer || typeof answer !== 'string') return 'text';
  
  const trimmed = answer.trim();
  
  // Year: 4 digits
  if (/^\d{4}$/.test(trimmed)) return 'year';
  
  // Number (any digits)
  if (/^\d+$/.test(trimmed)) return 'number';
  
  // Decimal/float
  if (/^\d+\.?\d*$/.test(trimmed)) return 'decimal';
  
  // Name: Capitalized words
  if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(trimmed)) return 'name';
  
  // Default: text
  return 'text';
}

// Helper: Generate distractors matching the correct answer type
function generateDistractors(correctAnswer, allQuestions, currentQuestionId) {
  const correctType = getAnswerType(correctAnswer);
  const candidates = [];
  
  // Collect answers of same type from other questions
  for (const q of allQuestions) {
    if (q.id !== currentQuestionId) {
      const answers = [q.displayAnswer, ...q.acceptableAnswers].filter(Boolean);
      for (const ans of answers) {
        if (getAnswerType(ans) === correctType && ans !== correctAnswer) {
          candidates.push(ans);
        }
      }
    }
  }
  
  // Deduplicate and shuffle
  const unique = [...new Set(candidates)];
  const shuffled = unique.sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3);
  
  // If not enough distractors, generate generic ones
  while (distractors.length < 3) {
    let distractor = '';
    switch (correctType) {
      case 'year':
        const baseYear = parseInt(correctAnswer);
        distractor = String(baseYear + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 100) + 1));
        break;
      case 'number':
        distractor = String(Math.floor(Math.random() * 1000));
        break;
      case 'decimal':
        distractor = (Math.random() * 100).toFixed(2);
        break;
      case 'name':
        const names = ['John Smith', 'Jane Doe', 'Thomas Brown', 'Mary Johnson', 'Robert Lee', 'Sarah Williams', 'James Miller', 'Elizabeth Davis'];
        distractor = names[Math.floor(Math.random() * names.length)];
        break;
      default:
        const responses = ['Not specified', 'Unknown', 'Various', 'Depends', 'Multiple options', 'All of the above', 'None of the above'];
        distractor = responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (!distractors.includes(distractor) && distractor !== correctAnswer) {
      distractors.push(distractor);
    }
  }
  
  return distractors;
}

// Convert to new schema
const newQuestions = oldQuestions.map((q) => {
  const correctAnswer = q.displayAnswer || q.acceptableAnswers[0];
  const distractors = generateDistractors(correctAnswer, oldQuestions, q.id);
  
  // Build all options
  const allOptions = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
  
  return {
    id: `question_${q.id}`,
    category: q.category,
    subcategory: q.subcategory,
    type: 'mc',
    question: q.question,
    explanation: q.explanation,
    options: allOptions,
    correctAnswer: [correctAnswer]
  };
});

console.log(`Converted ${newQuestions.length} questions to new schema`);

// Create exam structure
const examData = {
  exams: {
    '220-1201': {
      name: 'Naturalization Civic Questions',
      code: 'v2025',
      description: 'Official USCIS Civics Test - 2025 Edition. All 128 questions from the official study materials.',
      questions: 128,
      timeLimit: 'no-time',
      passingScore: 12,
      domainWeights: {},
      questionBank: newQuestions
    }
  }
};

// Calculate domain weights
const categoryCount = {};
newQuestions.forEach(q => {
  categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
});

for (const [category, count] of Object.entries(categoryCount)) {
  examData.exams['220-1201'].domainWeights[category] = count / newQuestions.length;
}

// Write new schema
const outputPath = path.join(__dirname, '../docs/data/exams.json');
fs.writeFileSync(outputPath, JSON.stringify(examData, null, 2));
console.log(`\n✓ Saved to ${outputPath}`);
console.log(`Domain weights:`, examData.exams['220-1201'].domainWeights);
