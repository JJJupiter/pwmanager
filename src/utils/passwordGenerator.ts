import { PasswordOptions, PasswordStrength } from '../types/password';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
} as const;

export const generatePassword = (options: PasswordOptions): string => {
  let chars = '';
  if (options.includeLowercase) chars += CHAR_SETS.lowercase;
  if (options.includeUppercase) chars += CHAR_SETS.uppercase;
  if (options.includeNumbers) chars += CHAR_SETS.numbers;
  if (options.includeSymbols) chars += CHAR_SETS.symbols;

  // Fallback to lowercase if no character sets are selected
  if (!chars) chars = CHAR_SETS.lowercase;

  let generatedPassword = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    generatedPassword += chars[randomIndex];
  }

  return generatedPassword;
};

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};:,.<>?]/.test(password);
  
  const varietyScore = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (password.length < 8) return 'weak';
  if (password.length >= 12 && varietyScore >= 3) return 'strong';
  return 'moderate';
}; 