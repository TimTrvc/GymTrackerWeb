import React, { useState, useEffect, useRef } from "react";
import useAvatar from '@/hooks/useAvatar';
import { GiBatteredAxe } from "react-icons/gi"

// Calculate boss stats with compounded increases per level
function getBossStats(level = 1) {
  // Boss base stats
  let hp = 50;
  let attack = 5;
  let defense = 1; // percent
  let crit = 2; // percent
  if (level > 1) {
    // HP and attack scale exponentially
    hp = +(hp * Math.pow(1.15, level - 1)).toFixed(2);
    attack = +(attack * Math.pow(1.12, level - 1)).toFixed(2);
    // Defense scales: each level, defense += 1 + 0.1 * defense (recursive)
    let def = 1;
    let critChance = 2;
    for (let i = 2; i <= level; i++) {
      def = def + 1 + 0.1 * def;
      critChance = critChance + 1 + 0.05 * critChance;
      if (def > 90) { def = 90; }
      if (critChance > 100) { critChance = 100; }
    }
    defense = +Math.min(90, def).toFixed(2);
    crit = Math.min(100, critChance);
  }
  return {
    name: "Gym Boss",
    hp: +hp.toFixed(2),
    attack: +attack.toFixed(2),
    defense: +defense.toFixed(2),
    crit: +crit.toFixed(2),
  };
}

// Utility to calculate damage
function calculateDamage(attack, defensePercent) {
  // defensePercent is 0-90, e.g. 10 means 10% reduction
  const cappedDefense = Math.min(90, defensePercent || 0);
  return Math.max(1, Math.round(attack * (1 - cappedDefense / 100)));
}

// Utility to calculate ability damage
function calculateAbilityDamage(mp, defensePercent) {
  const cappedDefense = Math.min(90, defensePercent || 0);
  return Math.max(2, Math.round(mp * 2 * (1 - cappedDefense / 100)));
}

// Utility to determine dodge
function didDodge(dodgeChance) {
  // Cap dodge at 90%
  return Math.random() < Math.min(0.9, (dodgeChance || 0) / 100);
}

const Minigame = ({ playerStats }) => {
  const { updateBossLevel, refreshAvatar } = useAvatar();
  const [mode, setMode] = useState('preview'); // 'preview', 'fight', 'result'
  const [player, setPlayer] = useState({
    hp: Number(playerStats.hp || 10),
    attack: Number(playerStats.attack || 5),
    mp: Number(playerStats.mp || 5),
    defense: Number(playerStats.defense || 0), // Default to 0% defense
    agility: Number(playerStats.agility || 0), // Default to 0% dodge
    currentHp: Number(playerStats.hp || 10),
  });
  const [boss, setBoss] = useState(() => {
    const stats = getBossStats(playerStats.boss_level || 1);
    return { ...stats, currentHp: stats.hp };
  });
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [canUseAbility, setCanUseAbility] = useState(true); // Start with ability available
  const [bossLevelUpMsg, setBossLevelUpMsg] = useState("");  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [abilityCooldown, setAbilityCooldown] = useState(0); // Start with no cooldown
  const [attackAnim, setAttackAnim] = useState(false);
  const [abilityAnim, setAbilityAnim] = useState(false);
  const [critAnim, setCritAnim] = useState(false);
  const [dodgeAnim, setDodgeAnim] = useState(false);
  const [showPlayerDmg, setShowPlayerDmg] = useState(0);
  const [showBossDmg, setShowBossDmg] = useState(0);
  const [waitingForPlayerAction, setWaitingForPlayerAction] = useState(true);
  const [bossAttackMessage, setBossAttackMessage] = useState('');
  
  const logRef = useRef(null);
  const logEndRef = useRef(null);

  const logPush = (entry) => {
    setLog(prev => [...prev, entry]);
  };
  
  useEffect(() => {
    // Scroll to bottom of log when updated
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  // Always update boss stats when playerStats.boss_level changes
  React.useEffect(() => {
    const stats = getBossStats(playerStats.boss_level || 1);
    setBoss({ ...stats, currentHp: stats.hp });
  }, [playerStats.boss_level]);

  // Always update player when playerStats changes
  React.useEffect(() => {
    setPlayer({
      hp: Number(playerStats.hp || 10),
      attack: Number(playerStats.attack || 5),
      mp: Number(playerStats.mp || 5),
      defense: Number(playerStats.defense || 0),
      agility: Number(playerStats.agility || 0),
      currentHp: Number(playerStats.hp || 10),
    });
  }, [playerStats.hp, playerStats.mp, playerStats.attack, playerStats.defense, playerStats.mp, playerStats.agility]);

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const handleBossDefeat = async () => {
    setLog((l) => [...l, "You defeated the boss!"]);
    setGameOver(true);
    setResult('win');
    // Increment boss level in DB and show message
    const newLevel = (playerStats.boss_level || 1) + 1;
    await updateBossLevel(newLevel);
    setBossLevelUpMsg(`Boss Level Up! You are now at Boss Level ${newLevel}`);
    await refreshAvatar && refreshAvatar();
    setMode('result');
    setTimeout(() => window.location.reload(), 500); // Force reload to get fresh props
  };

  const handlePlayerDefeat = () => {
    setLog((l) => [...l, "You were defeated by the boss!"]);
    setGameOver(true);
    setResult('lose');
    setMode('result');
  };  const handleAttack = () => {
    if (gameOver || !waitingForPlayerAction) return;
    setWaitingForPlayerAction(false);
    setAttackAnim(true);
    setTimeout(() => setAttackAnim(false), 700);
    
    const dmg = calculateDamage(player.attack, boss.defense);
    setShowPlayerDmg(dmg);
    setTimeout(() => setShowPlayerDmg(0), 1500);
    
    const newBossHp = Math.max(0, boss.currentHp - dmg);
    setBoss((b) => ({ ...b, currentHp: newBossHp }));
    setLog((l) => [
      ...l,
      `Player attacks for ${dmg} damage! Boss HP: ${newBossHp.toFixed(2)}/${boss.hp.toFixed(2)}`,
    ]);
    
    // Reduce cooldown counter if on cooldown
    if (abilityCooldown > 0) {
      const newCooldown = abilityCooldown - 1;
      setAbilityCooldown(newCooldown);
      
      // If cooldown reaches 0, enable ability again
      if (newCooldown === 0) {
        setCanUseAbility(true);
      }
    }
    
    if (newBossHp <= 0) {
      handleBossDefeat();
      return;
    }
    
    setTimeout(bossTurn, 1200);
    setTurn((t) => t + 1);
  };
  
  const handleAbility = () => {
    if (gameOver || !canUseAbility || !waitingForPlayerAction) return;
    setWaitingForPlayerAction(false);
    setAbilityAnim(true);
    setTimeout(() => setAbilityAnim(false), 900);
    
    const dmg = calculateAbilityDamage(player.mp, boss.defense);
    setShowPlayerDmg(dmg);
    setTimeout(() => setShowPlayerDmg(0), 1500);
    
    const newBossHp = Math.max(0, boss.currentHp - dmg);
    setBoss((b) => ({ ...b, currentHp: newBossHp }));
    
    // Set cooldown to 2 rounds and disable ability usage
    setAbilityCooldown(2);
    setCanUseAbility(false);
    
    setLog((l) => [
      ...l,
      `Player uses ability for ${dmg} damage! Boss HP: ${newBossHp.toFixed(2)}/${boss.hp.toFixed(2)}`,
    ]);
    
    if (newBossHp <= 0) {
      handleBossDefeat();
      return;
    }
    
    setTimeout(bossTurn, 1200);
    setTurn((t) => t + 1);  };
  
  const bossTurn = () => {
    if (gameOver) return;
    
    setWaitingForPlayerAction(false);
    
    // Boss crit logic
    const isCrit = Math.random() < (boss.crit || 0) / 100;
    let dmg = calculateDamage(boss.attack, player.defense);
    
    if (isCrit) {
      dmg = Math.round(dmg * 1.5);
      setCritAnim(true);
      setTimeout(() => setCritAnim(false), 1000);
      setBossAttackMessage(`Boss lands a CRITICAL HIT! (${boss.crit.toFixed(1)}% chance)`);
      setLog((l) => [...l, `Boss lands a CRITICAL HIT! (${boss.crit.toFixed(1)}% chance)`]);
    } else {
      setBossAttackMessage('Boss prepares to attack!');
    }
    
    if (didDodge(player.agility)) {
      setDodgeAnim(true);
      setTimeout(() => setDodgeAnim(false), 800);
      setBossAttackMessage("You dodged the boss's attack!");
      setLog((l) => [...l, "You dodged the boss's attack!"]);
      setTimeout(() => {
        setBossAttackMessage('');
        setWaitingForPlayerAction(true);
      }, 2000);
    } else {
      setTimeout(() => {
        setShowBossDmg(dmg);
        setTimeout(() => setShowBossDmg(0), 1500);
        
        const newPlayerHp = Math.max(0, player.currentHp - dmg);
        setPlayer((p) => ({ ...p, currentHp: newPlayerHp }));
        setBossAttackMessage(`Boss attacks for ${dmg} damage!`);
        setLog((l) => [
          ...l,
          `Boss attacks for ${dmg} damage! Player HP: ${newPlayerHp.toFixed(2)}/${player.hp.toFixed(2)}`,
        ]);
        
        if (newPlayerHp <= 0) {
          handlePlayerDefeat();
          return;
        }
        
        // Return control to player
        setTimeout(() => {
          setBossAttackMessage('');
          setWaitingForPlayerAction(true);
        }, 1500);
      }, 1000);
    }
  };
  
  const handleRestart = async () => {
    await refreshAvatar && refreshAvatar();
    setPlayer({
      hp: Number(playerStats.hp || 10),
      attack: Number(playerStats.attack || 5),
      mp: Number(playerStats.mp || 5),
      defense: Number(playerStats.defense || 0),
      agility: Number(playerStats.agility || 0),
      currentHp: Number(playerStats.hp || 10),
    });
    const stats = getBossStats(playerStats.boss_level || 1);
    setBoss({ ...stats, currentHp: stats.hp });
    setTurn(1);
    setLog([]);
    setGameOver(false);
    setCanUseAbility(true); // Reset ability to be available
    setAbilityCooldown(0);  // Reset cooldown
    setBossLevelUpMsg("");
    setResult(null);
    setWaitingForPlayerAction(true);
    setBossAttackMessage('');
    setMode('preview');
    setTimeout(() => window.location.reload(), 100); // Force reload to get fresh props
  };
  // --- UI ---  
  if (mode === 'preview') {
    const bossStats = getBossStats(playerStats.boss_level || 1);
    return (
      <div className="bg-gradient-to-br from-indigo-200 to-purple-300 rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto flex flex-col items-center border-4 border-indigo-400">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 tracking-wide drop-shadow-lg">Boss Battle Preview</h2>
        
        <div className="w-full flex justify-around items-center mb-12 relative">
          {/* Player Character */}
          <div className="character-container">
            <div className="character-model player-model flex justify-center items-center text-8xl">
              🦸
              <span className="sword absolute right-25 bottom-15 text-5xl transform rotate-90">🗡️   </span>
            </div>
            <div className="hp-bar mt-4 w-48">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">❤️ HP:</span>
                <span className="text-green-800 font-bold">{playerStats.hp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          {/* VS Badge */}
          <div className="bg-red-600 text-white font-extrabold text-2xl p-4 rounded-full shadow-lg">
            VS
          </div>
          
          {/* Boss Character */}
          <div className="character-container">
            <div className="character-model boss-model flex justify-center items-center text-8xl">
              👹
              <span className="sword absolute left-25 bottom-13 text-5xl transform rotate-180">🗡️</span>
            </div>
            <div className="hp-bar mt-4 w-48">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">❤️ HP:</span>
                <span className="text-red-800 font-bold">{bossStats.hp.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-red-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <details className="w-full mb-8">
          <summary className="cursor-pointer font-bold text-gray-700 mb-3 text-lg">Show Character Stats</summary>
          <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex-1 min-w-[300px] border-2 border-green-300">
              <h3 className="text-xl font-bold text-green-700 mb-3 text-center">Your Stats</h3>
              <div className="space-y-2 text-base">
                <div><b>🔮 MP:</b> <span className="text-blue-700 font-bold">{playerStats.mp}</span></div>
                <div><b>⚔️ Attack:</b> <span className="text-red-700 font-bold">{playerStats.attack}</span></div>
                <div><b>🛡️ Defense:</b> <span className="text-yellow-700 font-bold">{playerStats.defense}%</span></div>
                <div><b>💨 Dodge:</b> <span className="text-purple-700 font-bold">{playerStats.agility}%</span></div>
              </div>
            </div>
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex-1 min-w-[300px] border-2 border-red-300">
              <h3 className="text-xl font-bold text-red-700 mb-3 text-center">Boss (Lv. {playerStats.boss_level || 1})</h3>
              <div className="space-y-2 text-base">
                <div><b>⚔️ Attack:</b> <span className="text-red-700 font-bold">{bossStats.attack.toFixed(2)}</span></div>
                <div><b>🛡️ Defense:</b> <span className="text-yellow-700 font-bold">{bossStats.defense.toFixed(2)}%</span></div>
                <div><b>💥 Crit Chance:</b> <span className="text-pink-700 font-bold">{bossStats.crit ? bossStats.crit.toFixed(1) : 0}%</span></div>
              </div>
            </div>
          </div>
        </details>

        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-xl transition mb-2 mt-4 drop-shadow-lg"
          onClick={() => setMode('fight')}
        >
          Fight Boss
        </button>
      </div>
    );
  }
  if (mode === 'result') {
    return (
      <div className="bg-gradient-to-br from-green-100 to-purple-200 rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto flex flex-col items-center border-4 border-green-400">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 tracking-wide drop-shadow-lg">
          {result === 'win' ? '🏆 Victory! 🏆' : '😵 Defeat! 😵'}
        </h2>
        
        {/* Character display */}
        <div className="character-container mb-6">
          <div className="character-model flex justify-center items-center text-9xl">
            {result === 'win' ? '🦸' : '👻'}
          </div>
        </div>
        
        {bossLevelUpMsg && result === 'win' && (
          <div className="mb-6 text-center text-green-700 font-bold text-2xl animate-bounce p-4 bg-white/80 rounded-xl shadow-md">
            {bossLevelUpMsg}
          </div>
        )}
        
        <div className="mb-8 text-center text-gray-700 text-lg p-5 bg-white/70 rounded-xl max-w-xl shadow-md">
          {result === 'win' 
            ? 'You have defeated the boss and advanced to the next level! Your avatar becomes stronger with each victory.'
            : 'You were defeated by the boss. Train hard, upgrade your stats, and try again!'}
        </div>
        
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-xl transition drop-shadow-lg"
          onClick={handleRestart}
        >
          Return to Avatar
        </button>
      </div>
    );
  }

  // Fight screen
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl shadow-2xl p-8 mt-8 max-w-6xl mx-auto border-4 border-indigo-400 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-900 tracking-wide drop-shadow-lg flex items-center gap-3">⚔️ Minigame: Boss Battle 🏆</h2>
        {/* Battle Arena with Characters */}
      <div className="w-full flex justify-around items-center mb-12 relative">
        {/* Player Character with HP bar */}
        <div className="character-container relative">
          <div className="hp-bar absolute -top-12 w-48 left-1/2 transform -translate-x-1/2">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-white text-shadow">❤️ {player.currentHp.toFixed(0)}/{player.hp.toFixed(0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, (player.currentHp / player.hp) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className={`relative ${dodgeAnim ? 'animate-dodge' : ''}`}>
            <div className="character-model player-model flex justify-center items-center text-8xl">
              🦸
              <span className={`sword absolute -right-2 bottom-0 text-5xl transform rotate-180 ${attackAnim ? 'animate-player-attack' : ''}`}>🗡️</span>
            </div>
            {showBossDmg > 0 && (
              <div className="damage-number text-red-600 font-extrabold text-3xl animate-float-up absolute -top-6 left-0 right-0 text-center">
                -{showBossDmg}
              </div>
            )}
          </div>
        </div>
        
        {/* Center Battle Animations */}
        <div className="battle-fx absolute left-0 right-0 flex justify-center items-center pointer-events-none z-10">
          {attackAnim && <div className="attack-fx text-6xl animate-sword-slash">⚔️</div>}
          {abilityAnim && <div className="ability-fx text-6xl animate-ability-orb">✨</div>}
        </div>
        
        {/* Boss Character with HP bar */}
        <div className="character-container relative">
          <div className="hp-bar absolute -top-12 w-48 left-1/2 transform -translate-x-1/2">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-white text-shadow">❤️ {boss.currentHp.toFixed(0)}/{boss.hp.toFixed(0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, (boss.currentHp / boss.hp) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className={`relative ${critAnim ? 'animate-crit-attack' : ''}`}>
            <div className="character-model boss-model flex justify-center items-center text-8xl">
              👹
              <span className="sword absolute -left-6 bottom-0 text-5xl transform rotate-90">🗡️</span>
            </div>
            {showPlayerDmg > 0 && (
              <div className="damage-number text-red-600 font-extrabold text-3xl animate-float-up absolute -top-6 left-0 right-0 text-center">
                -{showPlayerDmg}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Battle message area */}
      {bossAttackMessage && (
        <div className="battle-message bg-gray-800/80 text-white p-4 rounded-xl mb-6 text-xl font-bold animate-pulse">
          {bossAttackMessage}
        </div>
      )}
      
      {/* Only show stats in collapsible section */}
      <details className="w-full mb-6">
        <summary className="cursor-pointer font-bold text-gray-700 mb-3 text-lg">Show Character Stats</summary>
        <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
          <div className="bg-white/90 rounded-2xl shadow-xl p-5 flex-1 border-2 border-green-300">
            <h3 className="font-bold text-green-700 text-xl mb-3 flex items-center gap-2">🧑‍🎤 Player</h3>
            <div className="space-y-2 text-base">
              <div><b>🔮 MP:</b> <span className="text-blue-700 font-bold">{playerStats.mp}</span></div>
              <div><b>⚔️ Attack:</b> <span className="text-red-700 font-bold">{player.attack}</span></div>
              <div><b>🛡️ Defense:</b> <span className="text-yellow-700 font-bold">{player.defense}%</span></div>
              <div><b>💨 Dodge:</b> <span className="text-purple-700 font-bold">{player.agility}%</span></div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-5 flex-1 border-2 border-red-300">
            <h3 className="font-bold text-red-700 text-xl mb-3 flex items-center gap-2">👹 Boss (Lv. {playerStats.boss_level || 1})</h3>
            <div className="space-y-2 text-base">
              <div><b>⚔️ Attack:</b> <span className="text-red-700 font-bold">{boss.attack.toFixed(2)}</span></div>
              <div><b>🛡️ Defense:</b> <span className="text-yellow-700 font-bold">{boss.defense.toFixed(2)}%</span></div>
              <div><b>💥 Crit:</b> <span className="text-pink-700 font-bold">{boss.crit ? boss.crit.toFixed(1) : 0}%</span></div>
            </div>
          </div>
        </div>
      </details>
      
      <div className="flex flex-wrap gap-4 justify-center w-full mb-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-xl font-extrabold shadow-lg disabled:opacity-50 transition flex items-center gap-2"
          onClick={handleAttack}
          disabled={gameOver || !waitingForPlayerAction}
        >
          🗡️ Attack
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-xl font-extrabold shadow-lg disabled:opacity-50 transition flex items-center gap-2"
          onClick={handleAbility}
          disabled={gameOver || !canUseAbility || !waitingForPlayerAction}
        >
          {abilityCooldown > 0 ? `⏳ Cooldown (${abilityCooldown})` : '✨ Use Ability'}
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 rounded-xl text-xl font-extrabold shadow-lg transition flex items-center gap-2"
          onClick={handleRestart}
        >
          🔄 Return
        </button>
      </div>
        {/* Battle Animations CSS */}
      <style>{`
        @keyframes player-attack {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(30deg) translateX(-5px); }
          50% { transform: rotate(-90deg) translateX(30px); }
          100% { transform: rotate(0deg); }
        }
        @keyframes sword-slash {
          0% { opacity: 0; transform: scale(0.5); }
          10% { opacity: 1; }
          90% { opacity: 1; transform: scale(1.5) rotate(30deg); }
          100% { opacity: 0; transform: scale(1.8) rotate(45deg); }
        }
        @keyframes ability-orb {
          0% { opacity: 0; transform: scale(0) translateX(-150px); }
          20% { opacity: 1; transform: scale(1) translateX(-120px); }
          80% { opacity: 1; transform: scale(1.5) translateX(120px); }
          100% { opacity: 0; transform: scale(0) translateX(150px); }
        }
        @keyframes crit-attack {
          0% { transform: translateX(0); }
          10% { transform: translateX(-15px) rotate(-5deg); }
          30% { transform: translateX(20px) rotate(5deg); }
          50% { transform: translateX(-15px); }
          70% { transform: translateX(15px); }
          100% { transform: translateX(0); }
        }
        @keyframes dodge {
          0% { transform: translateX(0); }
          30% { transform: translateX(-40px) rotate(-15deg); }
          70% { transform: translateX(-30px) rotate(5deg); }
          100% { transform: translateX(0) rotate(0); }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; }
          80% { opacity: 1; transform: translateY(-30px); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
        .animate-player-attack {
          animation: player-attack 0.6s ease-in-out;
        }
        .animate-sword-slash {
          animation: sword-slash 0.6s ease-in-out;
        }
        .animate-ability-orb {
          animation: ability-orb 1s ease-in-out;
        }
        .animate-crit-attack {
          animation: crit-attack 0.6s ease-in-out;
        }
        .animate-dodge {
          animation: dodge 0.8s ease-in-out;
        }
        .animate-float-up {
          animation: float-up 1.8s ease-out forwards;
        }
        .character-model {
          position: relative;
          font-size: 6rem;
          filter: drop-shadow(0 0 10px rgba(0,0,0,0.4));
          transition: all 0.3s ease;
        }
        .character-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
        }
        .sword {
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
        }        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }
      `}</style>
    </div>
  );
};

export default Minigame;
