import React from 'react';
import { motion } from 'framer-motion';
import './fullscreen-transition.css';

export const FullscreenTransition = ({ message = "VISITING ABOUT SECTION...", subtext = "INITIALIZING IDENTITY RECORD // 001" }) => {
  return (
    <motion.div
      className="fullscreen-transition-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="transition-center-box">
        <div className="transition-square-pulse">■</div>
        <div className="transition-main-message">&gt; {message}</div>
        <div className="transition-subtext">{subtext}</div>
      </div>
    </motion.div>
  );
};
