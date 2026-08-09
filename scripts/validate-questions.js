#!/usr/bin/env node
/**
 * Validate civics questions schema and data integrity
 * Run: node scripts/validate-questions.js
 */

const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../dist/data/questions.js');
const dynamicPath = path.join(__dirname, '../dist/data/dynamicAnswers.json');

let errors = [];
let warnings = [];

// Read questions.js
let questionCode = fs.readFileSync(questionsPath, 'utf-8');
// Extract array from const civicsQuestions = [...]
const arrayMatch = questionCode.match(/const civicsQuestions = \[([\s\S]*)\];/);
if (!arrayMatch) {
  console.error('❌ Could not parse civicsQuestions array');
  process.exit(1);
}

let questions;
try {
  questions = eval(`[${arrayMatch[1]}]`);
} catch (e) {
  console.error('❌ JSON parse error:', e.message);
  process.exit(1);
}

// Read dynamicAnswers.json
let dynamicData;
try {
  dynamicData = JSON.parse(fs.readFileSync(dynamicPath, 'utf-8'));
} catch (e) {
  console.error('❌ Could not read dynamicAnswers.json:', e.message);
  process.exit(1);
}

console.log(`📋 Validating ${questions.length} questions...\n`);

// Check 1: All IDs unique and 1-128
const ids = questions.map(q => q.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== 128) {
  errors.push(`❌ Expected 128 unique IDs, got ${uniqueIds.size}`);
}
for (let i = 1; i <= 128; i++) {
  if (!ids.includes(i)) {
    errors.push(`❌ Missing question ID ${i}`);
  }
}

// Check 2: Fixed questions have non-empty answers
questions.forEach(q => {
  if (q.answerType === 'fixed') {
    if (!q.displayAnswer || q.displayAnswer.trim() === '') {
      errors.push(`❌ Q${q.id}: Fixed question missing displayAnswer`);
    }
    if (!q.acceptableAnswers || q.acceptableAnswers.length === 0) {
      errors.push(`❌ Q${q.id}: Fixed question missing acceptableAnswers`);
    }
  }
});

// Check 3: Dynamic questions have empty answers and dynamicKey
const dynamicQs = [62, 65, 66, 70, 92];
dynamicQs.forEach(id => {
  const q = questions.find(qq => qq.id === id);
  if (!q) {
    errors.push(`❌ Missing dynamic question ID ${id}`);
    return;
  }
  if (q.answerType === 'fixed') {
    errors.push(`❌ Q${id}: Should be dynamic but answerType is 'fixed'`);
  }
  if (q.displayAnswer && q.displayAnswer.trim() !== '') {
    warnings.push(`⚠️  Q${id}: Dynamic question has displayAnswer set (should be empty)`);
  }
  if (!q.dynamicKey) {
    errors.push(`❌ Q${id}: Dynamic question missing dynamicKey`);
  }
});

// Check 4: All questions have required fields
questions.forEach(q => {
  const required = ['id', 'category', 'subcategory', 'question', 'explanation', 'answerType', 'answerFormat'];
  required.forEach(field => {
    if (!(field in q)) {
      errors.push(`❌ Q${q.id}: Missing field '${field}'`);
    }
  });
});

// Check 5: Dynamic data is current
const lastUpdated = new Date(dynamicData.lastUpdated);
const daysSinceUpdate = Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60 * 24));
if (daysSinceUpdate > 90) {
  warnings.push(`⚠️  dynamicAnswers.json last updated ${daysSinceUpdate} days ago (>90 day warning)`);
}

// Check 6: All national dynamic questions have data
['currentPresident', 'currentVicePresident', 'currentSpeaker'].forEach(key => {
  if (!dynamicData.national[key]) {
    errors.push(`❌ Missing national dynamic data for '${key}'`);
  } else if (!dynamicData.national[key].displayAnswer) {
    errors.push(`❌ National '${key}' has no displayAnswer`);
  }
});

// Check 7: Check 65/20 subset has enough questions
const pool65_20 = questions.filter(q => q.is65_20 === true);
if (pool65_20.length < 20) {
  errors.push(`❌ 65/20 pool has only ${pool65_20.length} questions, need at least 20`);
}

// Check 8: Warn about freeform answers (may have poor MC distractors)
const freeformCount = questions.filter(q => q.answerFormat === 'freeform').length;
if (freeformCount > 50) {
  warnings.push(`⚠️  ${freeformCount} questions are 'freeform' — may have lower-quality MC distractors`);
}

// Check 9: Warn about obvious format mismatches
const formatIssues = {
  63: 'political parties should be concept not place',
  113: 'branch count should be number not place',
  101: 'government type should be concept not place'
};
Object.entries(formatIssues).forEach(([id, issue]) => {
  const q = questions.find(qq => qq.id === parseInt(id));
  if (q) {
    warnings.push(`⚠️  Q${id}: ${issue} (current: ${q.answerFormat})`);
  }
});

// Output
console.log('\n═══════════════════════════════════════');
console.log('VALIDATION RESULTS');
console.log('═══════════════════════════════════════\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed!\n');
  console.log(`   • ${questions.length} questions, IDs 1-128 unique`);
  console.log(`   • Fixed questions have answers`);
  console.log(`   • Dynamic questions properly structured`);
  console.log(`   • 65/20 pool: ${pool65_20.length} questions`);
  console.log(`   • National officials: current`);
  console.log(`   • dynamicAnswers.json: up to date\n`);
  process.exit(0);
}

if (errors.length > 0) {
  console.log('❌ ERRORS (ship-blocking):\n');
  errors.forEach(e => console.log(`   ${e}`));
  console.log();
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (recommended fixes):\n');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log();
}

if (errors.length > 0) {
  console.log('Fix errors before shipping.\n');
  process.exit(1);
} else {
  console.log('Warnings are optional improvements.\n');
  process.exit(0);
}
