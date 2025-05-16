import React, { useState } from "react";
import useAvatar from '@/hooks/useAvatar';

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
    defense: Number(playerStats.defense || 0),
    agility: Number(playerStats.agility || 0),
    currentHp: Number(playerStats.hp || 10),
  });
  const [boss, setBoss] = useState(() => {
    const stats = getBossStats(playerStats.boss_level || 1);
    return { ...stats, currentHp: stats.hp };
  });
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [canUseAbility, setCanUseAbility] = useState(false);
  const [bossLevelUpMsg, setBossLevelUpMsg] = useState("");
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [abilityCooldown, setAbilityCooldown] = useState(0);

  const logRef = React.useRef(null);

  React.useEffect(() => {
    setCanUseAbility(turn % 2 === 0 && abilityCooldown === 0);
  }, [turn, abilityCooldown]);

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
  };

  const handleAttack = () => {
    if (gameOver) return;
    const dmg = calculateDamage(player.attack, boss.defense);
    const newBossHp = Math.max(0, boss.currentHp - dmg);
    setBoss((b) => ({ ...b, currentHp: newBossHp }));
    setLog((l) => [
      ...l,
      `Player attacks for ${dmg} damage! Boss HP: ${newBossHp.toFixed(2)}/${boss.hp.toFixed(2)}`,
    ]);
    if (abilityCooldown > 0) setAbilityCooldown(abilityCooldown - 1); // reduce cooldown
    if (newBossHp <= 0) {
      handleBossDefeat();
      return;
    }
    setTimeout(bossTurn, 500);
    setTurn((t) => t + 1);
  };

  const handleAbility = () => {
    if (gameOver || !canUseAbility) return;
    const dmg = calculateAbilityDamage(player.mp, boss.defense);
    const newBossHp = Math.max(0, boss.currentHp - dmg);
    setBoss((b) => ({ ...b, currentHp: newBossHp }));
    setAbilityCooldown(1); // set cooldown for 1 turn
    setLog((l) => [
      ...l,
      `Player uses ability for ${dmg} damage! Boss HP: ${newBossHp.toFixed(2)}/${boss.hp.toFixed(2)}`,
    ]);
    if (newBossHp <= 0) {
      handleBossDefeat();
      return;
    }
    setTimeout(bossTurn, 500);
    setTurn((t) => t + 1);
  };

  const bossTurn = () => {
    if (gameOver) return;
    // Boss crit logic
    const isCrit = Math.random() < (boss.crit || 0) / 100;
    let dmg = calculateDamage(boss.attack, player.defense);
    if (isCrit) {
      dmg = Math.round(dmg * 1.5);
      setLog((l) => [...l, `Boss lands a CRITICAL HIT! (${boss.crit.toFixed(1)}% chance)`]);
    }
    if (didDodge(player.agility)) {
      setLog((l) => [...l, "You dodged the boss's attack!"]);
    } else {
      const newPlayerHp = Math.max(0, player.currentHp - dmg);
      setPlayer((p) => ({ ...p, currentHp: newPlayerHp }));
      setLog((l) => [
        ...l,
        `Boss attacks for ${dmg} damage! Player HP: ${newPlayerHp.toFixed(2)}/${player.hp.toFixed(2)}`,
      ]);
      if (newPlayerHp <= 0) {
        handlePlayerDefeat();
        return;
      }
    }
  };

  const handleRestart = async () => {
    await refreshAvatar && refreshAvatar();
    setPlayer({ ...playerStats, currentHp: playerStats.hp });
    const stats = getBossStats(playerStats.boss_level || 1);
    setBoss({ ...stats, currentHp: stats.hp });
    setTurn(1);
    setLog([]);
    setGameOver(false);
    setCanUseAbility(false);
    setBossLevelUpMsg("");
    setResult(null);
    setMode('preview');
    setTimeout(() => window.location.reload(), 100); // Force reload to get fresh props
  };

  // --- UI ---
  if (mode === 'preview') {
    const bossStats = getBossStats(playerStats.boss_level || 1);
    return (
      <div className="bg-gradient-to-br from-indigo-200 to-purple-300 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto flex flex-col items-center border-4 border-indigo-400">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 tracking-wide drop-shadow-lg">Boss Battle Preview</h2>
        <div className="flex flex-col md:flex-row gap-10 w-full justify-center mb-8">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex-1 min-w-[180px] border-2 border-green-300">
            <h3 className="text-xl font-bold text-green-700 mb-3 text-center">Your Stats</h3>
            <div className="space-y-2 text-base">
              <div><b>HP:</b> <span className="text-green-800 font-bold">{playerStats.hp}</span></div>
              <div><b>MP:</b> <span className="text-blue-700 font-bold">{playerStats.mp}</span></div>
              <div><b>Attack:</b> <span className="text-red-700 font-bold">{playerStats.attack}</span></div>
              <div><b>Defense:</b> <span className="text-yellow-700 font-bold">{playerStats.defense}%</span></div>
              <div><b>Dodge:</b> <span className="text-purple-700 font-bold">{playerStats.agility}%</span></div>
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex-1 min-w-[180px] border-2 border-red-300">
            <h3 className="text-xl font-bold text-red-700 mb-3 text-center">Boss (Lv. {playerStats.boss_level || 1})</h3>
            <div className="space-y-2 text-base">
              <div><b>HP:</b> <span className="text-green-800 font-bold">{bossStats.hp.toFixed(2)}</span></div>
              <div><b>Attack:</b> <span className="text-red-700 font-bold">{bossStats.attack.toFixed(2)}</span></div>
              <div><b>Defense:</b> <span className="text-yellow-700 font-bold">{bossStats.defense.toFixed(2)}%</span></div>
              <div><b>Crit Chance:</b> <span className="text-pink-700 font-bold">{bossStats.crit ? bossStats.crit.toFixed(1) : 0}%</span></div>
            </div>
          </div>
        </div>
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
      <div className="bg-gradient-to-br from-green-100 to-purple-200 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto flex flex-col items-center border-4 border-green-400">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 tracking-wide drop-shadow-lg">{result === 'win' ? 'Victory!' : 'Defeat!'}</h2>
        {bossLevelUpMsg && result === 'win' && (
          <div className="mb-6 text-center text-green-700 font-bold text-xl animate-bounce">{bossLevelUpMsg}</div>
        )}
        <div className="mb-8 text-center text-gray-700 text-lg">
          {result === 'win' ? 'You have defeated the boss and advanced to the next level!' : 'You were defeated by the boss. Try again!'}
        </div>
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-xl transition drop-shadow-lg"
          onClick={handleRestart}
        >
          Return
        </button>
      </div>
    );
  }

  // Fight screen
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl shadow-2xl p-8 mt-8 max-w-3xl mx-auto border-4 border-indigo-400 flex flex-col items-center justify-center min-h-[600px]">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-900 tracking-wide drop-shadow-lg flex items-center gap-3">⚔️ Minigame: Boss Battle 🏆</h2>
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-8 w-full items-center">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex-1 border-2 border-green-300 flex flex-col items-center min-w-[320px]">
          <h3 className="font-bold text-green-700 text-2xl mb-4 flex items-center gap-2">🧑‍🎤 Player</h3>
          <div className="space-y-3 text-xl w-full">
            <div>❤️ HP: <span className="text-green-800 font-extrabold">{player.currentHp.toFixed(2)} / {player.hp.toFixed(2)}</span></div>
            <div>🔮 MP: <span className="text-blue-700 font-extrabold">{player.mp}</span></div>
            <div>⚔️ Attack: <span className="text-red-700 font-extrabold">{player.attack}</span></div>
            <div>🛡️ Defense: <span className="text-yellow-700 font-extrabold">{player.defense}%</span></div>
            <div>💨 Dodge: <span className="text-purple-700 font-extrabold">{player.agility}%</span></div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex-1 border-2 border-red-300 flex flex-col items-center min-w-[320px]">
          <h3 className="font-bold text-red-700 text-2xl mb-4 flex items-center gap-2">👹 Boss (Lv. {playerStats.boss_level || 1})</h3>
          <div className="space-y-3 text-xl w-full">
            <div>❤️ HP: <span className="text-green-800 font-extrabold">{boss.currentHp.toFixed(2)} / {boss.hp.toFixed(2)}</span></div>
            <div>⚔️ Attack: <span className="text-red-700 font-extrabold">{boss.attack.toFixed(2)}</span></div>
            <div>🛡️ Defense: <span className="text-yellow-700 font-extrabold">{boss.defense.toFixed(2)}%</span></div>
            <div>💥 Crit: <span className="text-pink-700 font-extrabold">{boss.crit ? boss.crit.toFixed(1) : 0}%</span></div>
          </div>
        </div>
      </div>
      <div className="flex gap-8 mb-8 justify-center w-full">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl text-2xl font-extrabold shadow-xl disabled:opacity-50 transition flex items-center gap-2"
          onClick={handleAttack}
          disabled={gameOver}
        >
          🗡️ Attack
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-2xl font-extrabold shadow-xl disabled:opacity-50 transition flex items-center gap-2"
          onClick={handleAbility}
          disabled={gameOver || !canUseAbility}
        >
          {abilityCooldown > 0 ? `⏳ Ability Cooldown (${abilityCooldown})` : '✨ Use Ability'}
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-10 py-5 rounded-2xl text-2xl font-extrabold shadow-xl transition flex items-center gap-2"
          onClick={handleRestart}
        >
          🔄 Return
        </button>
      </div>
      <div ref={logRef} className="bg-gray-100 rounded-2xl p-4 h-64 overflow-y-auto text-xl shadow-inner border border-gray-300 mt-2 w-full max-w-2xl">
        {log.map((entry, idx) => (
          entry.includes('CRITICAL HIT') ? (
            <div key={idx} className="text-red-700 font-extrabold animate-pulse drop-shadow-lg flex items-center gap-2">💥 {entry}</div>
          ) : entry.includes('dodged') ? (
            <div key={idx} className="text-purple-700 font-bold flex items-center gap-2">💨 {entry}</div>
          ) : entry.includes('defeated the boss') ? (
            <div key={idx} className="text-green-700 font-extrabold flex items-center gap-2">🏆 {entry}</div>
          ) : entry.includes('were defeated') ? (
            <div key={idx} className="text-red-700 font-extrabold flex items-center gap-2">💀 {entry}</div>
          ) : entry.includes('uses ability') ? (
            <div key={idx} className="text-blue-700 font-bold flex items-center gap-2">✨ {entry}</div>
          ) : entry.includes('attacks for') ? (
            <div key={idx} className="text-gray-800 font-semibold flex items-center gap-2">⚔️ {entry}</div>
          ) : (
            <div key={idx}>{entry}</div>
          )
        ))}
      </div>
    </div>
  );
};

export default Minigame;
