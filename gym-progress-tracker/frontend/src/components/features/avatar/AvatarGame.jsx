/**
 * Avatar Component
 * Displays the user's game avatar with level system, stats, and upgrade options
 */
import React, { useState } from 'react';
import { FaShieldAlt, FaRunning, FaHeart, FaMagic } from 'react-icons/fa';
import { GiSwordWound, GiLevelEndFlag } from 'react-icons/gi';
import useAvatar from '@/hooks/useAvatar';
import Minigame from './Minigame.jsx';

const AvatarGame = () => {
  const { 
    avatar, 
    loading, 
    error, 
    levelUpMode,
    addExperience, 
    upgradeStat 
  } = useAvatar();
  
  const [testExp, setTestExp] = useState(25); // Default experience points to add for testing
  const [animateStat, setAnimateStat] = useState(null);
  
  // Function to add test experience points
  const handleAddExperience = async () => {
    const didLevelUp = await addExperience(parseInt(testExp));
    if (didLevelUp) {
      // Show level up notification or animation
      console.log('Level up!');
    }
  };
  // Function to handle stat upgrade with animation
  const handleUpgradeStat = (statType) => {
    console.log(`Upgrading stat: ${statType}`, { 
      currentValue: avatar[statType],
      avatar
    });
    
    setAnimateStat(statType);
    upgradeStat(statType);
    
    // Add this to check if avatar is updated after upgrade
    setTimeout(() => {
      console.log(`Stat ${statType} after upgrade timeout:`, avatar[statType]);
    }, 2000);
    
    setTimeout(() => setAnimateStat(null), 1000);
  };

  // Update renderStatCard for new design
  const renderStatCard = (title, value, icon, color, description, statKey, unit = "") => {
    const isAnimating = animateStat === statKey;
    const colorClasses = {
      red: {
        text: "text-red-500",
        textBold: "text-red-700",
        button: "bg-red-500 hover:bg-red-600",
      },
      blue: {
        text: "text-blue-500",
        textBold: "text-blue-700",
        button: "bg-blue-500 hover:bg-blue-600",
      },
      green: {
        text: "text-green-500",
        textBold: "text-green-700",
        button: "bg-green-500 hover:bg-green-600",
      },
      yellow: {
        text: "text-yellow-500",
        textBold: "text-yellow-700",
        button: "bg-yellow-500 hover:bg-yellow-600",
      },
      purple: {
        text: "text-purple-500",
        textBold: "text-purple-700",
        button: "bg-purple-500 hover:bg-purple-600",
      },
    };
    const classes = colorClasses[color] || colorClasses.red;
    // Disable upgrade if defense/agility at 90
    const isMaxed = (statKey === 'defense' || statKey === 'agility') && value >= 90;
    return (
      <div className={`bg-white p-6 rounded-xl shadow-md flex flex-col items-center ${isAnimating ? 'animate-pulse' : ''}`}> 
        <div className={`mb-2 text-3xl ${classes.text}`}>{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <span className={`${classes.textBold} font-bold text-xl mb-1`}>{value}{unit}</span>
        <span className="text-gray-500 text-xs mb-2">{description}</span>
        {levelUpMode && (
          <button 
            onClick={() => handleUpgradeStat(statKey)}
            className={`mt-2 w-full ${classes.button} text-white py-2 rounded-md transition-colors disabled:opacity-50`}
            data-stat-type={statKey}
            disabled={isMaxed}
          >
            {isMaxed ? `Maxed` : `Upgrade ${title}`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center py-10 px-2">
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8 shadow-lg w-full max-w-2xl text-center">
          {error}
        </div>
      )}
      {avatar && !loading && (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 items-center">
          {/* Top section: Avatar card, XP, Stats, and Boss Progress */}
          <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between border-4 border-indigo-300 px-10 py-10 gap-10">
            {/* Avatar and XP */}
            <div className="flex flex-col items-center justify-center min-w-[260px]">
              <div className="w-36 h-36 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center border-8 border-indigo-500 shadow-xl mb-4">
                <span className="text-6xl">💪</span>
              </div>
              <h2 className="text-3xl font-extrabold text-indigo-900 mb-1 tracking-wide drop-shadow-lg">Lv. {avatar.level} Avatar</h2>
              <p className="text-gray-600 text-lg mb-4 text-center">Your game character powered by your real-world workouts</p>
              {/* Experience Bar INSIDE the card */}
              <div className="w-full max-w-xs mb-2">
                <div className="flex justify-between mb-1 text-base font-semibold">
                  <span className="flex items-center text-indigo-700"><GiLevelEndFlag className="mr-2" /> Experience</span>
                  <span className="text-indigo-800 font-bold">{avatar.experience}/100 XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${avatar.experience}%` }}
                  ></div>
                </div>
              </div>
              {/* Test Controls */}
              {!levelUpMode && (
                <div className="flex flex-col sm:flex-row items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                  <input
                    id="expPoints"
                    type="number"
                    min="1"
                    max="100"
                    value={testExp}
                    onChange={(e) => setTestExp(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-24 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                  />
                  <button
                    onClick={handleAddExperience}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl text-lg shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105"
                  >
                    Gain XP
                  </button>
                </div>
              )}
              {levelUpMode && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4 rounded-xl flex items-center shadow-md w-full">
                  <svg className="h-7 w-7 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg text-yellow-700 font-semibold">You leveled up! Choose one stat to upgrade.</span>
                </div>
              )}
            </div>
            {/* Stats and Boss Progress */}
            <div className="flex-1 flex flex-col items-center w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 w-full items-center justify-center mb-6">
                {renderStatCard("HP", Number(avatar.hp || 0).toFixed(2), <FaHeart size={32} />, "red", "Health Points", "hp")}
                {renderStatCard("MP", Number(avatar.mp || 0).toFixed(2), <FaMagic size={32} />, "blue", "Magic Points", "mp")}
                {renderStatCard("Attack", Number(avatar.attack || 0).toFixed(2), <GiSwordWound size={32} />, "green", "Attack Power", "attack")}
                {renderStatCard("Defense", Number(avatar.defense || 0).toFixed(2), <FaShieldAlt size={32} />, "yellow", "Damage Reduction", "defense", "%")}
                {renderStatCard("Dodge", Number(avatar.agility || 0).toFixed(2), <FaRunning size={32} />, "purple", "Dodge Chance", "agility", "%")}
              </div>
              {/* Boss Progress moved here */}
              <div className="w-full flex flex-col items-center justify-center mt-2">
                <h3 className="text-2xl font-bold mb-2 text-gray-800 text-center">Boss Progress</h3>
                <span className="text-lg font-semibold mb-1">Current Boss Level</span>
                <span className="text-indigo-700 font-extrabold text-3xl bg-indigo-100 px-6 py-2 rounded-full border-2 border-indigo-400 shadow-md mb-2">{avatar.boss_level}</span>
                <p className="mt-2 text-gray-600 text-base text-center max-w-xl">
                  Defeat gym bosses by completing challenges and workout routines!
                </p>
              </div>
            </div>
          </div>
          {/* Minigame Section - make it much larger and more visually engaging */}
          <div className="w-full max-w-6xl flex flex-col items-center justify-center mt-2">
            <Minigame playerStats={{
              hp: Number(avatar.hp || 0),
              mp: Number(avatar.mp || 0),
              attack: Number(avatar.attack || 0),
              defense: Number(avatar.defense || 0),
              magic: Number(avatar.magic || 0),
              agility: Number(avatar.agility || 0),
              boss_level: avatar.boss_level
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGame;
