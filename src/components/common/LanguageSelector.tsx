import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../locales/types';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'mobile';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = languages.find((l) => l.code === language) || languages[0];

  if (variant === 'mobile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-light-gray)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={14} />
          <span>भाषा चुनें / Select Language:</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              style={{
                padding: '0.55rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: language === lang.code ? '2px solid var(--color-milk-blue)' : '1px solid var(--color-border)',
                backgroundColor: language === lang.code ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                color: language === lang.code ? 'var(--color-dark-blue)' : 'var(--color-dark-gray)',
                fontWeight: language === lang.code ? 700 : 500,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{lang.nativeLabel}</span>
              {language === lang.code && <Check size={14} color="var(--color-milk-blue)" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.75rem',
          backgroundColor: isOpen ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
          border: '1px solid var(--color-border-dark)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-dark-blue)',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        id="language-selector-button"
      >
        <Globe size={16} color="var(--color-milk-blue)" />
        <span>{activeOption.nativeLabel}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            padding: '0.35rem',
            minWidth: '150px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
          role="menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none',
                background: language === lang.code ? 'var(--color-milk-blue-light)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                color: language === lang.code ? 'var(--color-dark-blue)' : 'var(--color-dark-gray)',
                fontWeight: language === lang.code ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              id={`lang-opt-${lang.code}`}
            >
              <span>{lang.nativeLabel}</span>
              {language === lang.code && <Check size={14} color="var(--color-milk-blue)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
