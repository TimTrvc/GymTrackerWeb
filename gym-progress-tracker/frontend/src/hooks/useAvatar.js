import { useState, useEffect } from 'react';
import avatarService from '../services/avatarService';

/**
 * React hook for handling avatar data and operations, including experience, stats, and boss level.
 *
 * @returns {Object} Avatar data, loading state, error, and avatar operation functions.
 */
const useAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelUpMode, setLevelUpMode] = useState(false);

  /**
   * Fetches avatar data from the server and updates state.
   * @returns {Promise<void>}
   */
  const fetchAvatar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await avatarService.getUserAvatar();
      setAvatar(data);
    } catch (err) {
      console.error('Error fetching avatar:', err);
      setError('Failed to load avatar data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds experience points to the avatar and handles level up state.
   * @param {number} points - The amount of experience to add.
   * @returns {Promise<boolean>} True if avatar leveled up, false otherwise.
   */
  const addExperience = async (points) => {
    try {
      setLoading(true);
      const { avatar: updatedAvatar, leveledUp } = await avatarService.addExperience(points);
      setAvatar(updatedAvatar);
      
      if (leveledUp) {
        setLevelUpMode(true);
        return true; // Return true if leveled up
      }
      return false; // Return false if not leveled up
    } catch (err) {
      console.error('Error adding experience:', err);
      setError('Failed to add experience points');
      return false;
    } finally {
      setLoading(false);
    }
  };
  /**
   * Upgrades a specific avatar stat (hp, mp, attack, defense, agility, _xp_only).
   * @param {string} statType - The stat to upgrade.
   * @returns {Promise<void>}
   */
  const upgradeStat = async (statType) => {
    try {
      if (!avatar) return;
      // Special case: only handle level-up UI, no XP deduction here
      if (statType === '_xp_only') {
        setLoading(true);
        // Update local level up mode state directly, no XP deduction here
        // to avoid double deduction (backend already handles XP deduction)
        setLevelUpMode(true);
        setLoading(false);
        return;
      }
      const updatedStats = { ...avatar };
      if (statType === 'hp') {
        updatedStats.hp = (updatedStats.hp || 10) * 1.2;
      } else if (statType === 'mp') {
        updatedStats.mp = (updatedStats.mp || 5) * 1.1;
      } else if (statType === 'attack') {
        updatedStats.attack = (updatedStats.attack || 5) * 1.1;
      } else if (statType === 'defense') {
        updatedStats.defense = Math.min(90, (updatedStats.defense || 0) + 2);
      } else if (statType === 'agility') {
        updatedStats.agility = Math.min(90, (updatedStats.agility || 0) + 1);
      }
      // Cap defense and agility at 90% before sending to backend
      updatedStats.defense = Math.min(90, updatedStats.defense || 0);
      updatedStats.agility = Math.min(90, updatedStats.agility || 0);
      setLoading(true);
      const updatedAvatar = await avatarService.updateAvatarStats(updatedStats);
      setAvatar(updatedAvatar);
      setLevelUpMode(false);
    } catch (err) {
      console.error('Error upgrading stat:', err);
      setError('Failed to upgrade avatar stat');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the boss level for the avatar.
   * @param {number} level - The new boss level.
   * @returns {Promise<void>}
   */
  const updateBossLevel = async (level) => {
    try {
      setLoading(true);
      const updatedAvatar = await avatarService.updateBossLevel(level);
      setAvatar(updatedAvatar);
    } catch (err) {
      console.error('Error updating boss level:', err);
      setError('Failed to update boss level');
    } finally {
      setLoading(false);
    }
  };
  /**
   * Processes all available level-ups if XP > 100. User must upgrade a stat after each level up.
   * @returns {Promise<boolean>} True if a level up was processed, false otherwise.
   */
  const processLevelUps = async () => {
    if (!avatar) return;
    let leveledUp = false;
    
    // If XP is already over 100, we can just set level up mode directly
    if (avatar.experience >= 100) {
      setLoading(true);
      try {
        // Backend expects XP to be added, so add 0 to trigger level up logic
        const { avatar: updatedAvatar, leveledUp: didLevelUp } = await avatarService.addExperience(0);
        setAvatar(updatedAvatar);
        
        // Regardless of what the backend says, if XP is over 100, we should show level up mode
        if (didLevelUp || updatedAvatar.experience >= 100) {
          setLevelUpMode(true);
          leveledUp = true;
        }
      } catch (err) {
        console.error('Failed to process level up:', err);
        setError('Failed to process level up');
      } finally {
        setLoading(false);
      }
    }
    
    return leveledUp;
  };

  // Fetch avatar data on component mount
  useEffect(() => {
    fetchAvatar();
  }, []);

  return {
    avatar,
    loading,
    error,
    levelUpMode,
    setLevelUpMode,
    addExperience,
    upgradeStat,
    updateBossLevel,
    refreshAvatar: fetchAvatar,
    processLevelUps // Expose the new function
  };
};

export default useAvatar;
