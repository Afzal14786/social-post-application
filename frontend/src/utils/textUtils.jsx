
import React from 'react';

/**
 * Formats text content by preserving newlines and highlighting hashtags.
 * @param {string} content - The raw text content.
 * @returns {React.ReactNode} - Formatted content with styled hashtags and paragraph breaks.
 */
export const formatContent = (content) => {
  if (!content) return null;

  return content.split('\n').map((line, index) => (
    <div key={index} style={{ minHeight: line.trim() === '' ? '1em' : 'auto' }}>
      {line.split(' ').map((word, wIndex) => {
        if (word.startsWith('#') && word.length > 1) {
          return (
            <span key={wIndex} style={{ color: '#1d9bf0', fontWeight: 'bold' }}>
              {word}{' '}
            </span>
          );
        }
        return <span key={wIndex}>{word} </span>;
      })}
    </div>
  ));
};
