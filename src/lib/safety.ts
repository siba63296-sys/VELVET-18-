import { SafetyCheckResult } from '../types';

/**
 * Strict Ethical & Legal Safety Filter
 * Velvet AI prohibits any generation involving minors, non-consensual behavior,
 * extreme violence, or real-world non-consensual likeness.
 */
const UNDERAGE_PATTERNS = [
  /\b(child|children|minor|underage|teen|teenager|toddler|baby|infant|kid|kindergarten|elementary|pedophile|pedo|lolita|shota|middle\s*school|high\s*school)\b/i,
  /\b(young\s*girl|young\s*boy|little\s*girl|little\s*boy|school\s*girl|school\s*boy|prepubescent|adolescent)\b/i,
  /\b(1[0-7]\s*years?\s*old|age\s*1[0-7]|aged\s*1[0-7])\b/i
];

const NON_CONSENSUAL_PATTERNS = [
  /\b(rape|raped|raping|non-consensual|nonconsensual|forced|blackmail|revenge\s*porn|stealthing|unconscious|drugged|intoxicated\s*forced|assault)\b/i,
  /\b(coerced|coercion|traffick|trafficking)\b/i
];

const VIOLENCE_PATTERNS = [
  /\b(snuff|mutilation|gore|beheading|decapitat|torture|corpse|necrophilia|dismember)\b/i,
  /\b(bloody\s*death|suicide|self-harm)\b/i
];

const REAL_PERSON_PATTERNS = [
  /\b(deepfake\s*of|face\s*swap\s*of|leaked\s*photo\s*of)\b/i
];

export function validatePromptSafety(prompt: string): SafetyCheckResult {
  const cleanPrompt = prompt.trim().toLowerCase();

  // 1. Minors / Underage protection (Zero Tolerance)
  for (const pattern of UNDERAGE_PATTERNS) {
    if (pattern.test(cleanPrompt)) {
      const match = cleanPrompt.match(pattern);
      return {
        allowed: false,
        violationCategory: 'underage',
        explanation: 'Prompt violates our absolute Zero-Tolerance policy regarding depictions of minors or ageplay. Accounts attempting to generate underage content are subject to immediate termination and legal reporting.',
        flaggedKeywords: match ? [match[0]] : ['underage indicator']
      };
    }
  }

  // 2. Non-consensual protection
  for (const pattern of NON_CONSENSUAL_PATTERNS) {
    if (pattern.test(cleanPrompt)) {
      const match = cleanPrompt.match(pattern);
      return {
        allowed: false,
        violationCategory: 'non_consensual',
        explanation: 'Prompt contains themes of non-consensual sexual content, violence, or coercion, strictly forbidden by our 18+ Ethics Charter and international law.',
        flaggedKeywords: match ? [match[0]] : ['non-consensual indicator']
      };
    }
  }

  // 3. Extreme Violence & Snuff
  for (const pattern of VIOLENCE_PATTERNS) {
    if (pattern.test(cleanPrompt)) {
      const match = cleanPrompt.match(pattern);
      return {
        allowed: false,
        violationCategory: 'violence',
        explanation: 'Prompt references gore, bodily mutilation, or extreme non-consensual violence which is prohibited on this platform.',
        flaggedKeywords: match ? [match[0]] : ['violence indicator']
      };
    }
  }

  // 4. Real person non-consensual deepfakes
  for (const pattern of REAL_PERSON_PATTERNS) {
    if (pattern.test(cleanPrompt)) {
      const match = cleanPrompt.match(pattern);
      return {
        allowed: false,
        violationCategory: 'real_person',
        explanation: 'Generating non-consensual deepfakes of real living individuals is strictly prohibited under our privacy and impersonation guidelines.',
        flaggedKeywords: match ? [match[0]] : ['deepfake indicator']
      };
    }
  }

  return { allowed: true };
}

export interface ModerationLog {
  id: string;
  userId: string;
  timestamp: string;
  promptSnippet: string;
  category?: string;
  blocked: boolean;
}

export function logModerationEvent(userId: string, prompt: string, result: SafetyCheckResult): ModerationLog {
  const log: ModerationLog = {
    id: 'mod_' + Math.random().toString(36).substring(2, 9),
    userId,
    timestamp: new Date().toISOString(),
    promptSnippet: prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt,
    category: result.violationCategory,
    blocked: !result.allowed
  };

  try {
    const existingStr = localStorage.getItem('velvet_moderation_logs');
    const existing: ModerationLog[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(log);
    // Keep last 50 logs
    localStorage.setItem('velvet_moderation_logs', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save moderation log', e);
  }

  return log;
}
