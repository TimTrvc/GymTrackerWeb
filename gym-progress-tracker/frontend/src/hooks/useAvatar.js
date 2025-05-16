import { useState, useEffect } from 'react';
import avatarService from '../services/avatarService';

/**
 * Custom hook for handling avatar data and operations
 * @returns {Object} Avatar data, loading state, and functions
 */
const useAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelUpMode, setLevelUpMode] = useState(false);

  /**
   * Fetch avatar data from the server
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
   * Add experience points to the avatar
   * @param {number} points - The amount of experience to add
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
   * Update a specific avatar stat
   * @param {string} statType - The stat to upgrade (hp, mp, attack, defense, agility)
   */
  const upgradeStat = async (statType) => {
    try {
      if (!avatar) return;
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
   * Update the boss level
   * @param {number} level - The new boss level
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
    refreshAvatar: fetchAvatar
  };
};

export default useAvatar;
