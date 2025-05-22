/**
 * XpRewardNotification Component
 * Shows an animated notification when a user earns XP
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const XpRewardNotification = ({ 
  xpAmount = 0, 
  message = '', 
  isLevelUp = false, 
  onAnimationComplete = () => {},
  duration = 3000
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onAnimationComplete, 300); // Give time for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!visible) return null;
  
  return (
    <div className="fixed top-20 right-5 z-50 select-none">
      <div className={`animate-slideInRight bg-white border-4 rainbow-border px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 min-w-[220px] ${visible ? 'opacity-100 scale-105' : 'opacity-0 translate-x-10'} transition-all duration-300`}> 
        <span className="text-3xl">✨</span>
        <span className="font-bold text-lg text-gray-800">{message}</span>
      </div>
      <style>{`
        .rainbow-border {
          border-image: linear-gradient(90deg, #ff5ec4, #fffb00, #00e0ff, #ff5ec4) 1;
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(100px) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) scale(1.05); }
        }
        .animate-slideInRight { animation: slideInRight 0.5s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  );
};

XpRewardNotification.propTypes = {
  xpAmount: PropTypes.number,
  message: PropTypes.string,
  isLevelUp: PropTypes.bool,
  onAnimationComplete: PropTypes.func,
  duration: PropTypes.number
};

export default XpRewardNotification;
