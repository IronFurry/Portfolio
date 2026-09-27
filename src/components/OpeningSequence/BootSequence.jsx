import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BOOT_LINES = [
  { text: '> CONNECTION REQUEST RECEIVED', hasOk: false, delayAfter: 350 },
  { text: '> INITIALIZING ARCHIVE...', hasOk: false, delayAfter: 450 },
  { text: '> ESTABLISHING SECURE CONNECTION...', hasOk: true, delayAfter: 400 },
  { text: '> LOADING VISUAL CORE...', hasOk: true, delayAfter: 400 },
  { text: '> SYNCHRONIZING MEMORY...', hasOk: true, delayAfter: 450 },
  { text: '> CONNECTING IDENTITY DATABASE...', hasOk: true, delayAfter: 600 }
];

export const BootSequence = ({ onBootComplete, playSound, isFastForward }) => {
  const [completedLines, setCompletedLines] = useState([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [showOk, setShowOk] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    // Start after ~500ms initial pause
    const startTimeout = setTimeout(() => {
      startTypingLine(0);
    }, isFastForward ? 100 : 500);

    return () => clearTimeout(startTimeout);
  }, [isFastForward]);

  const startTypingLine = (lineIdx) => {
    if (lineIdx >= BOOT_LINES.length) {
      // Boot complete! Pause ~700ms before transition to identity
      timerRef.current = setTimeout(() => {
        onBootComplete();
      }, isFastForward ? 200 : 700);
      return;
    }

    setCurrentLineIdx(lineIdx);
    setCurrentLineText('');
    setShowOk(false);

    const targetLine = BOOT_LINES[lineIdx];
    const fullText = targetLine.text;
    let charIdx = 0;

    const typeNextChar = () => {
      if (charIdx < fullText.length) {
        charIdx++;
        const nextSub = fullText.slice(0, charIdx);
        setCurrentLineText(nextSub);

        // Sound effect on typing
        if (charIdx % 3 === 0) {
          playSound('type_char');
        }

        const charSpeed = isFastForward ? 5 : Math.floor(Math.random() * 15) + 18;
        timerRef.current = setTimeout(typeNextChar, charSpeed);
      } else {
        // Line text finished typing
        if (targetLine.hasOk) {
          timerRef.current = setTimeout(() => {
            setShowOk(true);
            playSound('boot_ok');
            
            // Finish line after OK display delay
            timerRef.current = setTimeout(() => {
              setCompletedLines((prev) => [
                ...prev,
                { text: targetLine.text, ok: true }
              ]);
              setCurrentLineText('');
              setShowOk(false);
              startTypingLine(lineIdx + 1);
            }, isFastForward ? 50 : targetLine.delayAfter);
          }, isFastForward ? 30 : 180);
        } else {
          timerRef.current = setTimeout(() => {
            setCompletedLines((prev) => [
              ...prev,
              { text: targetLine.text, ok: false }
            ]);
            setCurrentLineText('');
            startTypingLine(lineIdx + 1);
          }, isFastForward ? 50 : targetLine.delayAfter);
        }
      }
    };

    typeNextChar();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      className="boot-sequence-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.6 } }}
      transition={{ duration: 0.4 }}
    >
      <div className="terminal-screen">
        {/* Previously completed lines */}
        {completedLines.map((line, idx) => (
          <div key={idx} className="terminal-line completed">
            <span className="line-prefix">{line.text}</span>
            {line.ok && <span className="line-status">OK</span>}
          </div>
        ))}

        {/* Currently active line being typed */}
        {currentLineIdx < BOOT_LINES.length && (
          <div className="terminal-line active">
            <span className="line-prefix">{currentLineText}</span>
            {showOk && <span className="line-status ok-pulse">OK</span>}
            {!showOk && <span className="terminal-cursor blinking-cursor">█</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};
