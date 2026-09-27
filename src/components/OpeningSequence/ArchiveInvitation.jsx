import React from 'react';
import { motion } from 'framer-motion';
import { EnterPrompt } from './EnterPrompt';

export const ArchiveInvitation = ({ onConfirmEnter, playSound }) => {
  return (
    <motion.div
      className="invitation-container"
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(16px)', transition: { duration: 0.8 } }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="invitation-card">
        {/* Top Header Tag */}
        <motion.div
          className="invitation-meta-top"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="archive-badge">PERSONAL ARCHIVE</span>
        </motion.div>

        {/* Identity Name */}
        <motion.h1
          className="invitation-title"
          initial={{ opacity: 0, tracking: '0.1em' }}
          animate={{ opacity: 1, tracking: '0.18em' }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          ARYAN KATE
        </motion.h1>

        {/* Status Pills */}
        <motion.div
          className="invitation-status-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="status-item">
            <span className="status-label">ACCESS LEVEL:</span>
            <span className="status-value highlight-cyan">PUBLIC</span>
          </div>
          <div className="status-divider">•</div>
          <div className="status-item">
            <span className="status-label">ARCHIVE STATUS:</span>
            <span className="status-value highlight-green">
              <span className="online-dot" /> ONLINE
            </span>
          </div>
        </motion.div>

        {/* Short Description */}
        <motion.p
          className="invitation-description"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          “An interactive record of things I’ve built, broken, learned and imagined.”
        </motion.p>

        {/* Separator Line */}
        <motion.div
          className="invitation-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Interactive Enter Prompt */}
        <motion.div
          className="invitation-prompt-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <EnterPrompt onConfirmEnter={onConfirmEnter} playSound={playSound} />
        </motion.div>
      </div>
    </motion.div>
  );
};
