import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aryan_archive_terminal_history';
const MAX_HISTORY = 50;

export const VALID_COMMANDS = [
  'help',
  'home',
  'clear',
  'cd about',
  'cd artifacts',
  'cd lab',
  'cd future',
  'cd contact'
];

export const HELP_TEXT = `AVAILABLE COMMANDS

cd about       Open identity / about
cd artifacts   Explore projects / artifacts
cd lab         Enter experiments
cd future      View future / roadmap
cd contact     Establish connection
home           Return to archive entry
clear          Clear terminal`;

export const COMMAND_RESPONSES = {
  'cd about': [
    '> navigating to /about...',
    '> loading identity record...',
    '> connection established.'
  ],
  'cd artifacts': [
    '> navigating to /artifacts...',
    '> loading artifact archive...',
    '> connection established.'
  ],
  'cd lab': [
    '> navigating to /lab...',
    '> initializing laboratory...',
    '> connection established.'
  ],
  'cd future': [
    '> navigating to /future...',
    '> accessing future projection...',
    '> connection established.'
  ],
  'cd contact': [
    '> navigating to /contact...',
    '> establishing communication channel...',
    '> connection established.'
  ],
  'home': [
    '> returning to archive entry...'
  ]
};

export function useTerminalLogic({ onNavigateSection, playSound }) {
  const [history, setHistory] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftInput, setDraftInput] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (e) {
      // ignore storage error
    }
  }, [history]);

  // History Navigation: Up arrow
  const navigateHistoryUp = useCallback(() => {
    if (history.length === 0) return;
    if (historyIndex === -1) {
      setDraftInput(inputValue);
      const nextIndex = history.length - 1;
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex]);
    } else if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex]);
    }
  }, [history, historyIndex, inputValue]);

  // History Navigation: Down arrow
  const navigateHistoryDown = useCallback(() => {
    if (historyIndex === -1) return;
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex]);
    } else {
      setHistoryIndex(-1);
      setInputValue(draftInput);
    }
  }, [history, historyIndex, draftInput]);

  // Tab Autocomplete
  const handleAutocomplete = useCallback(() => {
    const raw = inputValue.trim().toLowerCase();
    if (!raw) return { match: null, suggestions: [] };

    const matches = VALID_COMMANDS.filter(cmd => cmd.startsWith(raw));

    if (matches.length === 1) {
      setInputValue(matches[0]);
      return { match: matches[0], suggestions: [] };
    } else if (matches.length > 1) {
      return { match: null, suggestions: matches };
    }
    return { match: null, suggestions: [] };
  }, [inputValue]);

  // Command Execution
  const executeCommand = useCallback((rawCommand, blurInputCallback) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Save to history if non-empty and non-consecutive duplicate
    setHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1] === trimmed) {
        return prev;
      }
      const updated = [...prev, trimmed];
      if (updated.length > MAX_HISTORY) {
        return updated.slice(updated.length - MAX_HISTORY);
      }
      return updated;
    });

    setHistoryIndex(-1);
    setDraftInput('');
    setInputValue('');

    const cmdLower = trimmed.toLowerCase();

    // User command line in output
    const userLine = {
      id: Date.now() + '-user-' + Math.random(),
      type: 'user',
      text: `ARYAN_ARCHIVE:// ${trimmed}`
    };

    if (cmdLower === 'clear') {
      setOutputLines([]);
      return;
    }

    if (cmdLower === 'help') {
      const helpLines = HELP_TEXT.split('\n').map((line, idx) => ({
        id: Date.now() + '-help-' + idx,
        type: 'system',
        text: line
      }));
      setOutputLines(prev => [...prev, userLine, ...helpLines]);
      return;
    }

    if (COMMAND_RESPONSES[cmdLower]) {
      const responseLines = COMMAND_RESPONSES[cmdLower];
      const sectionId = cmdLower.startsWith('cd ')
        ? cmdLower.slice(3)
        : cmdLower === 'home'
          ? 'home'
          : null;

      // Check prefers-reduced-motion
      const prefersReduced = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        const respObjs = responseLines.map((lineText, idx) => ({
          id: Date.now() + '-resp-' + idx,
          type: 'response',
          text: lineText
        }));
        setOutputLines(prev => [...prev, userLine, ...respObjs]);
        if (sectionId && onNavigateSection) {
          onNavigateSection(sectionId);
        }
        if (blurInputCallback) {
          blurInputCallback();
        }
        return;
      }

      setIsTyping(true);
      let lineIndex = 0;

      setOutputLines(prev => [...prev, userLine]);

      const interval = setInterval(() => {
        if (lineIndex < responseLines.length) {
          const lineText = responseLines[lineIndex];
          setOutputLines(prev => [
            ...prev,
            { id: Date.now() + '-resp-' + lineIndex, type: 'response', text: lineText }
          ]);
          if (playSound) playSound('type_char');
          lineIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);

          setTimeout(() => {
            if (sectionId && onNavigateSection) {
              if (playSound) playSound('boot_ok');
              onNavigateSection(sectionId);
            }
            if (blurInputCallback) {
              blurInputCallback();
            }
          }, 320);
        }
      }, 80);

      return;
    }

    // Unknown command
    const unknownLines = [
      {
        id: Date.now() + '-err1',
        type: 'error',
        text: `command not found: ${trimmed}`
      },
      {
        id: Date.now() + '-err2',
        type: 'system',
        text: "Type 'help' for available commands."
      }
    ];

    setOutputLines(prev => [...prev, userLine, ...unknownLines]);
  }, [onNavigateSection, playSound]);

  const clearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  return {
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
  };
}
