import React, { useState } from "react";
import useAvatar from '@/hooks/useAvatar';

// Calculate boss stats with compounded increases per level
function getBossStats(level = 1) {
  // Boss base stats
  let hp = 50;
  let attack = 5;
  let defense = 1; // percent
  if (level > 1) {
    // HP and attack scale exponentially
    hp = Math.round(hp * Math.pow(1.15, level - 1));
    attack = Math.round(attack * Math.pow(1.12, level - 1));
    // Defense scales: each level, defense += 1 + 0.1 * defense (recursive)
    let def = 1;
    for (let i = 2; i <= level; i++) {
      def = def + 1 + 0.1 * def;
      if (def > 90) { def = 90; break; }
    }
    defense = Math.min(90, def);
  }
  return {
    name: "Gym Boss",
    hp,
    attack,
    defense: Math.min(90, defense),
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
    currentMp: Number(playerStats.mp || 5),
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

  React.useEffect(() => {
    setCanUseAbility(turn % 2 === 0);
  }, [turn]);

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
      currentMp: Number(playerStats.mp || 5),
    });
  }, [playerStats.hp, playerStats.mp, playerStats.attack, playerStats.defense, playerStats.mp, playerStats.agility]);

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
      `Player attacks for ${dmg} damage! Boss HP: ${newBossHp}/${boss.hp}`,
    ]);
    if (newBossHp <= 0) {
      handleBossDefeat();
      return;
    }
    setTimeout(bossTurn, 500);
    setTurn((t) => t + 1);
  };

  const handleAbility = () => {
    if (gameOver || !canUseAbility || player.currentMp < 5) return;
    const dmg = calculateAbilityDamage(player.mp, boss.defense);
    const newBossHp = Math.max(0, boss.currentHp - dmg);
    setBoss((b) => ({ ...b, currentHp: newBossHp }));
    setPlayer((p) => ({ ...p, currentMp: p.currentMp - 5 }));
    setLog((l) => [
      ...l,
      `Player uses ability for ${dmg} damage! Boss HP: ${newBossHp}/${boss.hp}`,
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
    if (didDodge(player.agility)) {
      setLog((l) => [...l, "You dodged the boss's attack!"]);
    } else {
      const dmg = calculateDamage(boss.attack, player.defense);
      const newPlayerHp = Math.max(0, player.currentHp - dmg);
      setPlayer((p) => ({ ...p, currentHp: newPlayerHp }));
      setLog((l) => [
        ...l,
        `Boss attacks for ${dmg} damage! Player HP: ${newPlayerHp}/${player.hp}`,
      ]);
      if (newPlayerHp <= 0) {
        handlePlayerDefeat();
        return;
      }
    }
  };

  const handleRestart = async () => {
    await refreshAvatar && refreshAvatar();
    setPlayer({ ...playerStats, currentHp: playerStats.hp, currentMp: playerStats.mp });
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
  // Preview screen before fight
  if (mode === 'preview') {
    const bossStats = getBossStats(playerStats.boss_level || 1);
    return (
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-lg p-8 max-w-xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Boss Battle Preview</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex-1 min-w-[150px]">
            <h3 className="text-lg font-bold text-green-700 mb-2 text-center">Your Stats</h3>
            <div className="space-y-1 text-sm">
              <div><b>HP:</b> {playerStats.hp}</div>
              <div><b>MP:</b> {playerStats.mp}</div>
              <div><b>Attack:</b> {playerStats.attack}</div>
              <div><b>Defense:</b> {playerStats.defense}%</div>
              <div><b>Magic:</b> {playerStats.mp}</div>
              <div><b>Dodge:</b> {playerStats.agility}%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex-1 min-w-[150px]">
            <h3 className="text-lg font-bold text-red-700 mb-2 text-center">Boss (Lv. {playerStats.boss_level || 1})</h3>
            <div className="space-y-1 text-sm">
              <div><b>HP:</b> {bossStats.hp}</div>
              <div><b>Attack:</b> {bossStats.attack}</div>
              <div><b>Defense:</b> {bossStats.defense}</div>
            </div>
          </div>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition mb-2"
          onClick={() => setMode('fight')}
        >
          Fight Boss
        </button>
      </div>
    );
  }

  // Result screen after win/lose
  if (mode === 'result') {
    return (
      <div className="bg-gradient-to-br from-green-100 to-purple-100 rounded-xl shadow-lg p-8 max-w-xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">{result === 'win' ? 'Victory!' : 'Defeat!'}</h2>
        {bossLevelUpMsg && result === 'win' && (
          <div className="mb-4 text-center text-green-700 font-bold">{bossLevelUpMsg}</div>
        )}
        <div className="mb-6 text-center text-gray-700">
          {result === 'win' ? 'You have defeated the boss and advanced to the next level!' : 'You were defeated by the boss. Try again!'}
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition"
          onClick={handleRestart}
        >
          Return
        </button>
      </div>
    );
  }

  // Fight screen
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Minigame: Boss Battle</h2>
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold">Player</h3>
          <div>HP: {player.currentHp} / {player.hp}</div>
          <div>MP: {player.currentMp} / {player.mp}</div>
          <div>Attack: {player.attack}</div>
          <div>Defense: {player.defense}%</div>
          <div>Magic: {player.mp}</div>
          <div>Dodge: {player.agility}%</div>
        </div>
        <div>
          <h3 className="font-bold">Boss (Lv. {playerStats.boss_level || 1})</h3>
          <div>HP: {boss.currentHp} / {boss.hp}</div>
          <div>Attack: {boss.attack}</div>
          <div>Defense: {boss.defense}</div>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAttack}
          disabled={gameOver}
        >
          Attack
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAbility}
          disabled={gameOver || !canUseAbility || player.currentMp < 5}
        >
          Use Ability
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={handleRestart}
        >
          Return
        </button>
      </div>
      <div className="bg-gray-100 rounded p-2 h-40 overflow-y-auto text-sm">
        {log.map((entry, idx) => (
          <div key={idx}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default Minigame;
