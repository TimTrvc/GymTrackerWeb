import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mockUserStats = {
    level: 8,
    experience: 780,
    nextLevelExp: 1000,
    strength: 65,
    endurance: 42,
    flexibility: 28,
    achievements: ['5 Schlachten gewonnen', 'Kritischer Treffer erzielt', 'Epischen Boss bezwungen'],
    streak: 12,
    totalWorkouts: 56,
    characterClass: 'Krieger',
    attackPower: 72,
    defense: 58,
    resistances: 45,
    criticalHit: 25
};

const GymAvatar = ({ userId }) => {
    const [stats, setStats] = useState(mockUserStats);
    const [animateAvatar, setAnimateAvatar] = useState(false);
    const [showAction, setShowAction] = useState(false);

    const calculateAvatarProps = (stats) => {
        return {
            HP: Math.min(100, stats.endurance * 2),
            MP: Math.min(100, stats.flexibility * 3),
            Attack: Math.min(100, stats.strength),
            Defense: Math.min(100, stats.defense),
            Agility: Math.min(100, stats.flexibility * 2)
        };
    };

    const avatarProps = calculateAvatarProps(stats);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateAvatar(true);
            setTimeout(() => setAnimateAvatar(false), 2000);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const actionInterval = setInterval(() => {
            setShowAction(true);
            setTimeout(() => setShowAction(false), 1000);
        }, 7000);
        return () => clearInterval(actionInterval);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 bg-opacity-90 rounded-xl shadow-lg text-white border-2 border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8 text-yellow-300 uppercase tracking-wider">Dein RPG Held</h2>
            {/* Avatar-Bereich hinzugefügt */}
            <div className="flex justify-center mb-8">
                <motion.div
                    className={`w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 ${animateAvatar ? "animate-pulse" : ""}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-4xl">🛡️</span>
                </motion.div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-300 border-b border-gray-600 pb-2">Charakterwerte</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between">
                                <span className="flex items-center">Level</span>
                                <span className="text-yellow-200">{stats.level}</span>
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
                        {stats.achievements.map((achievement, index) => (
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
                            <div className="text-3xl font-bold text-yellow-300">{stats.totalWorkouts}</div>
                            <div className="text-sm text-yellow-200">Schlachten gewonnen</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded shadow-md border border-gray-600">
                            <div className="text-3xl font-bold text-yellow-300">3</div>
                            <div className="text-sm text-yellow-200">Schlachten diese Woche</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded shadow-md border border-gray-600">
                            <div className="text-3xl font-bold text-yellow-300">12</div>
                            <div className="text-sm text-yellow-200">Bossgegner besiegt</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GymAvatar;