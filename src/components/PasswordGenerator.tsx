import { useState, useEffect } from 'react';
import { PasswordOptions } from '../types/password';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordGenerator';
import { AnimatedNumber } from './AnimatedNumber';
import { useConfetti } from '../hooks/useConfetti';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [copied, setCopied] = useState(false);
  const { triggerConfetti } = useConfetti();

  // Generate password whenever options change
  useEffect(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
  }, [options]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Function to handle all option changes
  const handleOptionChange = (optionName: keyof PasswordOptions, value: boolean | number, event?: React.MouseEvent) => {
    setOptions(prev => ({ ...prev, [optionName]: value }));
    
    // Trigger confetti for toggle switches
    if (event && typeof value === 'boolean') {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      triggerConfetti(rect.x + rect.width / 2, rect.y + rect.height / 2);
    }
  };

  const strength = calculatePasswordStrength(password);
  const strengthMessages = {
    weak: 'Weak: Add more characters and variety',
    moderate: 'Moderate: Not bad, but not Fort Knox either',
    strong: 'Strong: This password means business!'
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
      <h1 className="text-2xl font-bold text-slate-800 text-center">Password generator</h1>
      <p className="text-slate-600 text-center mb-6">Adjust options to generate passwords</p>
      
      <div className="mb-6">
        <div className="relative flex items-center gap-2 bg-white/95 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full bg-transparent outline-none text-xl font-mono text-slate-800 font-bold tracking-wide"
            placeholder="Adjust options below"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
            )}
          </button>
        </div>
        {password && (
          <div className={`mt-2 p-2 text-sm rounded-md ${
            strength === 'weak' ? 'bg-red-50 text-red-800 border border-red-200' :
            strength === 'moderate' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {strengthMessages[strength]}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-700">Password length</label>
            <AnimatedNumber value={options.length} />
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="1"
            value={options.length}
            onChange={(e) => handleOptionChange('length', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Include Uppercase Letters</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => handleOptionChange('includeUppercase', e.target.checked, e.nativeEvent as unknown as React.MouseEvent)}
              />
              <span className="slider"></span>
            </label>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700">Include Lowercase Letters</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => handleOptionChange('includeLowercase', e.target.checked, e.nativeEvent as unknown as React.MouseEvent)}
              />
              <span className="slider"></span>
            </label>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700">Include Numbers</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => handleOptionChange('includeNumbers', e.target.checked, e.nativeEvent as unknown as React.MouseEvent)}
              />
              <span className="slider"></span>
            </label>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700">Include Symbols</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => handleOptionChange('includeSymbols', e.target.checked, e.nativeEvent as unknown as React.MouseEvent)}
              />
              <span className="slider"></span>
            </label>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator; 