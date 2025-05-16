/**
 * Activity Tracker Service
 * Handles tracking user activities and rewarding experience points for avatar progression
 */

import BaseService from './BaseService';
import avatarService from './avatarService';

class ActivityTrackerService extends BaseService {
  /**
   * Track a completed workout and reward XP
   * @param {number} workoutId - ID of the completed workout
   * @param {number} exerciseCount - Number of exercises in the workout
   * @returns {Promise<Object>} The result of the XP addition
   */
  async trackWorkoutCompletion(workoutId, exerciseCount = 1) {
    try {
      // Base XP for completing any workout
      const baseXp = 25;
      
      // Bonus XP based on number of exercises (capped at a reasonable amount)
      const exerciseBonus = Math.min(exerciseCount, 10) * 2;
      
      // Total XP to award
      const totalXp = baseXp + exerciseBonus;
      
      // Add experience points to the avatar
      const result = await avatarService.addExperience(totalXp);
      
      // Log this activity 
      this.logActivity('workout_completion', {
        workoutId,
        exerciseCount,
        xpAwarded: totalXp,
        leveledUp: result.leveledUp
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking workout completion:', error);
      throw error;
    }
  }
  
  /**
   * Track completed exercise sets and reward XP
   * @param {number} exerciseId - ID of the exercise
   * @param {number} sets - Number of sets completed
   * @returns {Promise<Object>} The result of the XP addition
   */
  async trackExerciseSets(exerciseId, sets = 1) {
    try {
      // XP per set
      const xpPerSet = 5;
      
      // Calculate total XP (cap at a reasonable maximum)
      const totalXp = Math.min(sets, 10) * xpPerSet;
      
      // Add experience points to the avatar
      const result = await avatarService.addExperience(totalXp);
      
      // Log this activity
      this.logActivity('exercise_completion', {
        exerciseId,
        sets,
        xpAwarded: totalXp,
        leveledUp: result.leveledUp
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking exercise completion:', error);
      throw error;
    }
  }
  
  /**
   * Track a new personal record and reward XP
   * @param {number} exerciseId - ID of the exercise
   * @returns {Promise<Object>} The result of the XP addition
   */
  async trackPersonalRecord(exerciseId) {
    try {
      // XP for achieving a personal record
      const prXp = 20;
      
      // Add experience points to the avatar
      const result = await avatarService.addExperience(prXp);
      
      // Log this activity
      this.logActivity('personal_record', {
        exerciseId,
        xpAwarded: prXp,
        leveledUp: result.leveledUp
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking personal record:', error);
      throw error;
    }
  }
  
  /**
   * Track completion of a training session and reward XP
   * @param {Object} sessionData - Training session data
   * @returns {Promise<Object>} The result of the XP addition
   */
  async trackTrainingSession(sessionData) {
    try {
      // Base XP for a training session
      const baseXp = 15;
      
      // Duration bonus - 1 XP per minute, max 30
      const durationMinutes = sessionData.duration || 0;
      const durationBonus = Math.min(durationMinutes, 30);
      
      // Calculate total XP
      const totalXp = baseXp + durationBonus;
      
      // Add experience points to the avatar
      const result = await avatarService.addExperience(totalXp);
      
      // Log this activity
      this.logActivity('training_session', {
        sessionData,
        xpAwarded: totalXp,
        leveledUp: result.leveledUp
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking training session:', error);
      throw error;
    }
  }
  
  /**
   * Log user activity (internal method)
   * @private
   * @param {string} activityType - Type of activity
   * @param {Object} details - Activity details
   */
  logActivity(activityType, details) {
    // For now, just log to console
    // In a full implementation, this could save to a database
    console.log(`[ActivityTracker] ${activityType}:`, details);
  }
}

export default new ActivityTrackerService();
