import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTerminalLogic } from './useTerminalLogic';
import './archive-terminal.css';

export const ArchiveTerminal = ({ onNavigateSection, playSound }) => {
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const outputEndRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  // Draggable terminal window state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  const {
    inputValue,
    setInputValue,
    outputLines,
    setOutputLines,
    isTyping,
    navigateHistoryUp,
    navigateHistoryDown,
    handleAutocomplete,
    executeCommand,
    clearOutput
  } = useTerminalLogic({ onNavigateSection, playSound });

  // Auto-scroll output container on new output
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [outputLines]);

  // Global Shortcut: '/' to focus terminal when user is not typing elsewhere
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/') {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = document.activeElement?.isContentEditable;
        if (activeTag !== 'input' && activeTag !== 'textarea' && !isEditable) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Window Drag Handler
  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialPosRef.current = { ...position };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      setPosition({
        x: initialPosRef.current.x + deltaX,
        y: initialPosRef.current.y + deltaY
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Handle Terminal Input Keyboard Events
  const handleKeyDown = (e) => {
    // Ctrl + L or Cmd + L: Clear terminal output
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      clearOutput();
      return;
    }

    // Ctrl + A or Cmd + A: Select input text
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isTyping) {
        executeCommand(inputValue, () => {
          inputRef.current?.blur();
        });
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistoryUp();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistoryDown();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const { match, suggestions } = handleAutocomplete();
      if (suggestions && suggestions.length > 0) {
        const suggLine = {
          id: Date.now() + '-sugg',
          type: 'system',
          text: `Matches: ${suggestions.join('   ')}`
        };
        setOutputLines(prev => [...prev, suggLine]);
      } else if (match && playSound) {
        playSound('type_char');
      }
      return;
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={terminalRef}
      className={`archive-terminal-root ${isFocused ? 'terminal-focused' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onClick={handleContainerClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      role="region"
      aria-label="Archive Mac Command Line Terminal"
    >
      {/* macOS Window Header Bar — Graspable for dragging */}
      <div
        className="mac-terminal-header"
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        title="Click and drag to move terminal"
      >
        <div className="mac-window-controls">
          <span className="mac-dot dot-close" title="Close" />
          <span className="mac-dot dot-minimize" title="Minimize" />
          <span className="mac-dot dot-expand" title="Expand" />
        </div>
        <div className="mac-terminal-title">aryan@archive — ~ — zsh</div>
      </div>

      {/* Terminal Body */}
      <div className="mac-terminal-body">
        {/* Terminal Output History */}
        {outputLines.length > 0 && (
          <div className="terminal-output-container">
            {outputLines.map((line) => (
              <div key={line.id} className={`terminal-line line-${line.type}`}>
                {line.text}
              </div>
            ))}
            <div ref={outputEndRef} />
          </div>
        )}

        {/* Input Prompt Row */}
        <div className="terminal-input-row">
          <span className="terminal-prompt">ARYAN_ARCHIVE://</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (playSound) playSound('type_char');
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            {inputValue === '' && (
              <span className={`terminal-cursor ${isFocused ? 'blinking' : 'idle'}`}>_</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
