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
    <div className="fixed top-20 right-5 z-50 flex items-center select-none">
      <div className={`
        animate-slideInRight bg-gradient-to-r 
        ${isLevelUp 
          ? 'from-yellow-400 via-yellow-200 to-amber-400 border-yellow-300' 
          : 'from-indigo-500 via-purple-400 to-pink-400 border-indigo-300'} 
        text-white p-6 rounded-2xl shadow-2xl border-4
        transform transition-all duration-300 ${visible ? 'opacity-100 scale-105' : 'opacity-0 translate-x-10'}
        flex flex-col items-center min-w-[280px]
      `}>
        <div className="flex flex-col items-center">
          <div className="mb-2 animate-bounce text-4xl drop-shadow-lg">
            {isLevelUp ? '🏆' : '✨'}
          </div>
          <div className="text-lg font-bold mb-1 tracking-wide drop-shadow-sm">
            {isLevelUp ? 'LEVEL UP!' : 'XP erhalten!'}
          </div>
          <div className="text-base font-medium mb-2 text-center opacity-90">
            {message}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-yellow-300 drop-shadow-glow animate-pop">+{xpAmount}</span>
            <span className="text-lg font-semibold text-white/80">XP</span>
          </div>
          {isLevelUp && (
            <span className="mt-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow">LEVEL UP!</span>
          )}
        </div>
        <div className="mt-2 text-xs text-white/70 italic animate-fadeIn">Stark! Weiter so! 🚀</div>
      </div>
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
