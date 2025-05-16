/**
 * Avatar Service
 * Handles all API calls related to the user's avatar functionality
 */

import BaseService from './BaseService';

/**
 * Service for managing the user avatar
 * @extends BaseService
 */
class AvatarService extends BaseService {
  /**
   * Constructor for the Avatar Service
   */
  constructor() {
    super('/api/avatar');
  }

  /**
   * Get the current user's avatar or create a new one if it doesn't exist
   * @returns {Promise<Object>} The avatar data
   */
  async getUserAvatar() {
    const response = await this.get();
    return response;
  }
  /**
   * Update the avatar's stats (HP, MP, Attack, Defense, Agility)
   * @param {Object} stats - The stats to update
   * @param {number} stats.hp - Health points
   * @param {number} stats.mp - Magic points
   * @param {number} stats.attack - Attack value
   * @param {number} stats.defense - Defense value
   * @param {number} stats.agility - Agility value
   * @returns {Promise<Object>} The updated avatar data
   */
  async updateAvatarStats(stats) {
    console.log('Sending stats to backend:', stats);
    
    // Make sure we're sending the correct stats object with all required properties
    const statsToSend = {
      hp: stats.hp,
      mp: stats.mp,
      attack: stats.attack,
      defense: stats.defense,
      agility: stats.agility
    };
    
    const response = await this.put('stats', statsToSend);
    console.log('Response from updateAvatarStats:', response);
    return response.avatar;
  }

  /**
   * Add experience points to the avatar with automatic level-up at 100 XP
   * @param {number} experiencePoints - Amount of XP to add
   * @returns {Promise<Object>} Object containing updated avatar and leveledUp flag
   */
  async addExperience(experiencePoints) {
    const response = await this.post('experience', { experiencePoints });
    return {
      avatar: response.avatar,
      leveledUp: response.leveledUp
    };
  }

  /**
   * Update the avatar's boss level
   * @param {number} bossLevel - The new boss level
   * @returns {Promise<Object>} The updated avatar data
   */
  async updateBossLevel(bossLevel) {
    const response = await this.put('boss-level', { bossLevel });
    return response.avatar;
  }
}

export default new AvatarService();
