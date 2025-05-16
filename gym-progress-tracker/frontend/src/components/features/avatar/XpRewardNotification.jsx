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
    <div className="fixed top-20 right-5 z-50 flex items-center">
      <div className={`
        animate-slideInRight bg-gradient-to-r 
        ${isLevelUp 
          ? 'from-yellow-500 to-amber-500 border-yellow-300' 
          : 'from-indigo-500 to-purple-500 border-indigo-300'} 
        text-white p-4 rounded-lg shadow-lg border-2
        transform transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 translate-x-10'}
      `}>
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-2xl">{isLevelUp ? '🎖️' : '✨'}</span>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">
              {message || (isLevelUp ? 'Level Up!' : 'XP Earned!')}
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold">+{xpAmount} XP</span>
              {isLevelUp && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  LEVEL UP!
                </span>
              )}
            </div>
          </div>
        </div>
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
