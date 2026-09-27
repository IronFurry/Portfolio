import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IdentityReveal = ({ onIdentityComplete, playSound, isFastForward }) => {
  const [step, setStep] = useState('searching'); // 'searching' | 'found' | 'reveal_name'

  useEffect(() => {
    // 1. Play searching pulse on mount
    playSound('identity_searching');

    // 2. Transition from SEARCHING... to IDENTITY FOUND
    const timer1 = setTimeout(() => {
      setStep('found');
      playSound('identity_lock'); // Sleek high-tech biometric lock pulse sound when "IDENTITY FOUND" lights up
    }, isFastForward ? 300 : 1000);

    // 3. Reveal ARYAN KATE and play the majestic resonant "voom" chime EXACTLY together!
    const timer2 = setTimeout(() => {
      setStep('reveal_name');
      playSound('identity_found'); // "Voom" chime fires precisely as ARYAN KATE fades in!
    }, isFastForward ? 600 : 1800);

    // 4. Complete scene after name display delay
    const timer3 = setTimeout(() => {
      onIdentityComplete();
    }, isFastForward ? 1200 : 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onIdentityComplete, playSound, isFastForward]);

  return (
    <motion.div
      className="identity-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(12px)', transition: { duration: 0.7 } }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="identity-content">
        <motion.div 
          className="protocol-header"
          initial={{ opacity: 0, tracking: '0.1em' }}
          animate={{ opacity: 0.6, tracking: '0.25em' }}
          transition={{ duration: 0.8 }}
        >
          IDENTITY PROTOCOL
        </motion.div>

        {/* Searching vs Found status indicator */}
        <div className="status-indicator">
          <AnimatePresence mode="wait">
            {step === 'searching' && (
              <motion.span
                key="searching"
                className="status-text searching-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                SEARCHING...
              </motion.span>
            )}

            {(step === 'found' || step === 'reveal_name') && (
              <motion.span
                key="found"
                className="status-text found-text"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                IDENTITY FOUND
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Big Name Reveal */}
        {step === 'reveal_name' && (
          <motion.div
            className="identity-name-box"
            initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.97 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="cinematic-name">ARYAN KATE</h1>
            <motion.div 
              className="name-underline"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
