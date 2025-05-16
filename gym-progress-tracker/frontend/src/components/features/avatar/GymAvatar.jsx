import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAvatar from '@/hooks/useAvatar';
import { FaShieldAlt, FaRunning, FaHeart, FaMagic } from 'react-icons/fa';
import { GiSwordWound, GiLevelEndFlag } from 'react-icons/gi';

const GymAvatar = () => {
    const { 
        avatar, 
        loading, 
        error, 
        levelUpMode, 
        setLevelUpMode, 
        addExperience, 
        upgradeStat 
    } = useAvatar();
    
    const [animateAvatar, setAnimateAvatar] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [testExp, setTestExp] = useState(25); // Default experience to add for testing
    
    const calculateAvatarProps = (avatarData) => {
        if (!avatarData) return {
            HP: 0,
            MP: 0,
            Attack: 0,
            Defense: 0,
            Agility: 0
        };
        
        return {
            HP: avatarData.hp,
            MP: avatarData.mp,
            Attack: avatarData.attack,
            Defense: avatarData.defense,
            Agility: avatarData.agility
        };
    };

    const avatarProps = avatar ? calculateAvatarProps(avatar) : calculateAvatarProps(null);
    
    // Function to handle gaining experience
    const handleAddExperience = async () => {
        setAnimateAvatar(true);
        const didLevelUp = await addExperience(parseInt(testExp));
        
        if (didLevelUp) {
            // Show level up celebration
            setShowAction(true);
            setTimeout(() => setShowAction(false), 3000);
        }
        
        setTimeout(() => setAnimateAvatar(false), 2000);
    };
      // Function to handle stat upgrade
    const handleUpgradeStat = async (statType) => {
        try {
            console.log(`Upgrading stat: ${statType}, current value:`, avatar ? avatar[statType] : 'unknown');
            await upgradeStat(statType);
            setAnimateAvatar(true);
            setTimeout(() => setAnimateAvatar(false), 2000);
        } catch (err) {
            console.error(`Error upgrading ${statType}:`, err);
        }
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (avatar) {
                setAnimateAvatar(true);
                setTimeout(() => setAnimateAvatar(false), 2000);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [avatar]);
    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 bg-opacity-90 rounded-xl shadow-lg text-white border-2 border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8 text-yellow-300 uppercase tracking-wider">Dein RPG Held</h2>
            
            {/* Error State */}
            {error && (
                <div className="bg-red-900 bg-opacity-50 border border-red-600 p-4 rounded-md mb-6">
                    <p className="text-red-200">Fehler beim Laden des Avatars: {error}</p>
                </div>
            )}
            
            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-300"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            className={`w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 ${animateAvatar ? "animate-pulse" : ""}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-4xl">🛡️</span>
                        </motion.div>
                        
                        {/* XP Testing Controls */}
                        {!levelUpMode && (
                            <div className="mt-4 flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="100" 
                                    value={testExp}
                                    onChange={(e) => setTestExp(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md p-1 w-16"
                                />
                                <button
                                    onClick={handleAddExperience}
                                    className="bg-gradient-to-r from-green-600 to-green-500 px-3 py-1 text-sm rounded-md hover:from-green-500 hover:to-green-400 transition-all"
                                >
                                    XP hinzufügen
                                </button>
                            </div>
                        )}
                        
                        {/* Level Up Mode Notice */}
                        {levelUpMode && (
                            <div className="mt-4 bg-yellow-900 bg-opacity-50 border border-yellow-600 p-3 rounded-md text-center">
                                <p className="text-yellow-300 text-sm">
                                    Level Up! Wähle einen Stat zum Verbessern.
                                </p>
                            </div>
                        )}
                        
                        {/* Show Action Animation */}
                        {showAction && (
                            <motion.div
                                className="absolute top-1/4 text-6xl"
                                initial={{ scale: 0, opacity: 0, y: 10 }}
                                animate={{ scale: 1.5, opacity: 1, y: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                ⭐ LEVEL UP! ⭐
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-2/3">
                            <h3 className="text-xl font-semibold mb-4 text-yellow-300 border-b border-gray-600 pb-2">Charakterwerte</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">Level</span>
                                        <span className="text-yellow-200">{avatar ? avatar.level : 0}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">HP (Ausdauer)</span>
                                        <span className="text-yellow-200">{avatarProps.HP}/100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-700 rounded h-4 overflow-hidden border border-gray-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-red-700 to-red-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avatarProps.HP}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">MP (Magie)</span>
                                        <span className="text-yellow-200">{avatarProps.MP}/100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-700 rounded h-4 overflow-hidden border border-gray-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-700 to-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avatarProps.MP}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">Attack</span>
                                        <span className="text-yellow-200">{avatarProps.Attack}/100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-700 rounded h-4 overflow-hidden border border-gray-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-700 to-green-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avatarProps.Attack}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">Defense</span>
                                        <span className="text-yellow-200">{avatarProps.Defense}/100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-700 rounded h-4 overflow-hidden border border-gray-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-gray-500 to-gray-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avatarProps.Defense}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span className="flex items-center">Agility</span>
                                        <span className="text-yellow-200">{avatarProps.Agility}/100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-700 rounded h-4 overflow-hidden border border-gray-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-700 to-purple-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avatarProps.Agility}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mt-8 mb-4 text-yellow-300 border-b border-gray-600 pb-2">Errungene Trophäen</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Placeholder achievements until we implement an achievements system */}
                                {['5 Schlachten gewonnen', 'Kritischer Treffer erzielt', 'Epischen Boss bezwungen'].map((achievement, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded shadow-md flex items-center border border-gray-600"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03, boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mr-3 border border-yellow-400">
                                            <span className="text-yellow-100 text-lg">🏆</span>
                                        </div>
                                        <span className="text-yellow-100">{achievement}</span>
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded shadow-md flex items-center border border-gray-700 opacity-70"
                                    whileHover={{ scale: 1.03, opacity: 0.9 }}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mr-3 border border-gray-600">
                                        <span className="text-yellow-500 text-lg">?</span>
                                    </div>
                                    <span className="text-yellow-500">Nächste Herausforderung</span>
                                </motion.div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mt-8 mb-4 text-yellow-300 border-b border-gray-600 pb-2">Heldenstatistiken</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded shadow-md border border-gray-600">
                                    <div className="text-3xl font-bold text-yellow-300">{avatar ? avatar.level * 3 : 0}</div>
                                    <div className="text-sm text-yellow-200">Schlachten gewonnen</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded shadow-md border border-gray-600">
                                    <div className="text-3xl font-bold text-yellow-300">3</div>
                                    <div className="text-sm text-yellow-200">Schlachten diese Woche</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded shadow-md border border-gray-600">
                                    <div className="text-3xl font-bold text-yellow-300">{avatar ? avatar.boss_level : 0}</div>
                                    <div className="text-sm text-yellow-200">Bossgegner besiegt</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Level up mode section - add skill points */}
                        {levelUpMode && (
                            <div className="w-full md:w-1/3 bg-gray-700 p-4 rounded-lg border border-gray-600 mt-6 md:mt-0">
                                <h3 className="text-xl font-semibold mb-4 text-yellow-300 border-b border-gray-600 pb-2">Verbessere deine Stats</h3>
                                <p className="text-sm mb-4">Du bist aufgestiegen! Wähle einen Stat zum Verbessern:</p>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => handleUpgradeStat('hp')}
                                        className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 p-2 rounded flex items-center justify-between"
                                    >
                                        <span className="flex items-center"><FaHeart className="mr-2" /> HP erhöhen</span>
                                        <span>+5</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleUpgradeStat('mp')}
                                        className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 p-2 rounded flex items-center justify-between"
                                    >
                                        <span className="flex items-center"><FaMagic className="mr-2" /> MP erhöhen</span>
                                        <span>+5</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleUpgradeStat('attack')}
                                        className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 p-2 rounded flex items-center justify-between"
                                    >
                                        <span className="flex items-center"><GiSwordWound className="mr-2" /> Angriff erhöhen</span>
                                        <span>+5</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleUpgradeStat('defense')}
                                        className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 p-2 rounded flex items-center justify-between"
                                    >
                                        <span className="flex items-center"><FaShieldAlt className="mr-2" /> Verteidigung erhöhen</span>
                                        <span>+5</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleUpgradeStat('agility')}
                                        className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 p-2 rounded flex items-center justify-between"
                                    >
                                        <span className="flex items-center"><FaRunning className="mr-2" /> Agilität erhöhen</span>
                                        <span>+5</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GymAvatar;