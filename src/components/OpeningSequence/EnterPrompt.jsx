import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EnterPrompt = ({ onConfirmEnter, playSound }) => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [grantStep, setGrantStep] = useState(0); // 0: prompt, 1: access request, 2: connection established, 3: welcome

  const triggerEnter = useCallback(() => {
    if (inputDisabled) return;

    setInputDisabled(true);
    playSound('access_requested');
    setGrantStep(1); // ACCESS REQUEST RECEIVED

    setTimeout(() => {
      setGrantStep(2); // CONNECTION ESTABLISHED
    }, 600);

    setTimeout(() => {
      setGrantStep(3); // WELCOME.
      playSound('access_granted');
    }, 1300);

    setTimeout(() => {
      playSound('archive_enter');
      onConfirmEnter();
    }, 2200);
  }, [inputDisabled, playSound, onConfirmEnter]);

  // Keyboard Enter listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        triggerEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEnter]);

  return (
    <div className="enter-prompt-container">
      <AnimatePresence mode="wait">
        {grantStep === 0 && (
          <motion.div
            key="prompt"
            className="prompt-interactive-area"
            onClick={triggerEnter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            role="button"
            tabIndex={0}
            aria-label="Press enter to access archive"
          >
            {/* Desktop prompt */}
            <div className="desktop-prompt breathing-text">
              <span className="prompt-symbol">&gt;</span> PRESS ENTER TO ENTER
              <span className="blinking-cursor">█</span>
            </div>

            {/* Mobile / Touch responsive hint */}
            <div className="mobile-prompt-hint">
              <span className="mobile-tap-badge">[ TAP TO ENTER ]</span>
            </div>
          </motion.div>
        )}

        {grantStep === 1 && (
          <motion.div
            key="step1"
            className="grant-status-line"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="prompt-symbol">&gt;</span> ACCESS REQUEST RECEIVED
            <span className="status-loader">...</span>
          </motion.div>
        )}

        {grantStep === 2 && (
          <motion.div
            key="step2"
            className="grant-status-line highlight"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="prompt-symbol">&gt;</span> CONNECTION ESTABLISHED
          </motion.div>
        )}

        {grantStep === 3 && (
          <motion.div
            key="step3"
            className="grant-status-line welcome-text"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="prompt-symbol">&gt;</span> WELCOME.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
