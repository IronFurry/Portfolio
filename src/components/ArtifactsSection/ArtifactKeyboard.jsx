import React from 'react';

const KEYBOARD_ROWS = [
  [
    { key: 'Escape', label: 'ESC', className: 'key-esc' },
    { key: '1', label: '1' }, { key: '2', label: '2' }, { key: '3', label: '3' },
    { key: '4', label: '4' }, { key: '5', label: '5' }, { key: '6', label: '6' },
    { key: '7', label: '7' }, { key: '8', label: '8' }, { key: '9', label: '9' },
    { key: '0', label: '0' }
  ],
  [
    { key: 'Q', label: 'Q' }, { key: 'W', label: 'W' }, { key: 'E', label: 'E' },
    { key: 'R', label: 'R' }, { key: 'T', label: 'T' }, { key: 'Y', label: 'Y' },
    { key: 'U', label: 'U' }, { key: 'I', label: 'I' }, { key: 'O', label: 'O' },
    { key: 'P', label: 'P' }
  ],
  [
    { key: 'A', label: 'A' }, { key: 'S', label: 'S' }, { key: 'D', label: 'D' },
    { key: 'F', label: 'F' }, { key: 'G', label: 'G' }, { key: 'H', label: 'H' },
    { key: 'J', label: 'J' }, { key: 'K', label: 'K' }, { key: 'L', label: 'L' },
    { key: 'Enter', label: '↵', className: 'key-enter' }
  ],
  [
    { key: 'Z', label: 'Z' }, { key: 'X', label: 'X' }, { key: 'C', label: 'C' },
    { key: 'V', label: 'V' }, { key: 'B', label: 'B' }, { key: 'N', label: 'N' },
    { key: 'M', label: 'M' }, { key: '?', label: '?' }
  ],
  [{ key: ' ', label: 'SPACE', className: 'key-space' }]
];

export const ArtifactKeyboard = ({ pressedKey, onKeyTrigger }) => {
  const normalized = String(pressedKey ?? '').toUpperCase();

  return (
    <div className="physical-keyboard">
      <div className="keyboard-top-edge">
        <span className="keyboard-brand">ARYAN / ARCHIVE</span>
        <span className="keyboard-led" />
      </div>

      <div className="key-grid">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div className={`key-row key-row-${rowIndex}`} key={rowIndex}>
            {row.map((item) => {
              const current = item.key.toUpperCase() === normalized;
              return (
                <button
                  key={`${rowIndex}-${item.key}`}
                  type="button"
                  className={`physical-key ${item.className || ''} ${current ? 'is-pressed' : ''}`}
                  onClick={() => onKeyTrigger?.(item.key)}
                  aria-label={item.key === ' ' ? 'Space' : item.label}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
