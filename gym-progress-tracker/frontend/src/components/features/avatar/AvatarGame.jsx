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
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {avatar && !loading && (
        <div className="grid grid-cols-1 gap-6">
          {/* Character Overview */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 mx-auto bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-600">
                  <span className="text-5xl">💪</span>
                </div>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Lv. {avatar.level} Avatar</h2>
                <p className="text-gray-600 mb-4">Your game character powered by your real-world workouts</p>
                
                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center">
                      <GiLevelEndFlag className="mr-2" /> Experience
                    </span>
                    <span className="text-indigo-700 font-bold">{avatar.experience}/100 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${avatar.experience}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Level Up Mode Notice */}
                {levelUpMode && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You leveled up! Choose one stat to upgrade.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Controls */}
                {!levelUpMode && (
                  <div className="flex flex-col sm:flex-row items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-auto">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expPoints">
                        Add Experience Points
                      </label>
                      <input
                        id="expPoints"
                        type="number"
                        min="1"
                        max="100"
                        value={testExp}
                        onChange={(e) => setTestExp(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <button
                      onClick={handleAddExperience}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105"
                    >
                      Gain XP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-6 mb-4 text-center">Avatar Statistics</h3>
          {levelUpMode && (
            <p className="text-center text-gray-700 mb-6">
              Choose one stat to improve by 5 points
            </p>
          )}

          {/* Avatar Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            {renderStatCard("HP", Number(avatar.hp || 0), <FaHeart size={28} />, "red", "Health Points", "hp")}
            {renderStatCard("MP", Number(avatar.mp || 0), <FaMagic size={28} />, "blue", "Magic Points", "mp")}
            {renderStatCard("Attack", Number(avatar.attack || 0), <GiSwordWound size={28} />, "green", "Attack Power", "attack")}
            {renderStatCard("Defense", Number(avatar.defense || 0), <FaShieldAlt size={28} />, "yellow", "Damage Reduction", "defense", "%")}
            {renderStatCard("Dodge", Number(avatar.agility || 0), <FaRunning size={28} />, "purple", "Dodge Chance", "agility", "%")}
          </div>

          {/* Boss Progress */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Boss Progress</h3>
            <div className="flex justify-between mb-2">
              <span>Current Boss Level</span>
              <span className="text-indigo-700 font-bold">{avatar.boss_level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full" 
                style={{ width: `${avatar.boss_level * 10}%` }}
              ></div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              Defeat gym bosses by completing challenges and workout routines!
            </p>
          </div>

          {/* Minigame Section */}
          <Minigame playerStats={{
            hp: Number(avatar.hp || 0),
            mp: Number(avatar.mp || 0),
            attack: Number(avatar.attack || 0),
            defense: Number(avatar.defense || 0),
            magic: Number(avatar.magic || 0), // ensure correct magic value
            agility: Number(avatar.agility || 0),
            boss_level: avatar.boss_level
          }} />
        </div>
      )}
    </div>
  );
};

export default AvatarGame;
