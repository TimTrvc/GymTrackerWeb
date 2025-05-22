// Alle Imports müssen am Dateianfang stehen!
import { useState, useCallback } from 'react';
import activityTrackerService from '@/services/activityTrackerService';

const useActivityTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [xpReward, setXpReward] = useState(null);

  // Track custom XP and show reward popup
  // @param {number} xpAmount - XP to award
  // @param {string} message - Message to show
  const trackCustomXp = useCallback(async (xpAmount, message = '') => {
    try {
      setIsTracking(true);
      // Avatar XP vergeben
      const avatarService = (await import('@/services/avatarService')).default;
      const result = await avatarService.addExperience(xpAmount);
      setXpReward({
        amount: xpAmount,
        message: message || `+${xpAmount} XP erhalten!`,
        isLevelUp: result?.leveledUp,
        type: 'custom'
      });
      return result;
    } catch (error) {
      console.error('Error tracking custom XP:', error);
      return { success: false, error };
    } finally {
      setIsTracking(false);
    }
  }, []);
  
  /**
   * Track a workout completion and award XP
   * @param {Object} workout - The workout object
   * @param {number} exerciseCount - Number of exercises in the workout
   */
  const trackWorkoutCompletion = useCallback(async (workout, exerciseCount = 1) => {
    try {
      setIsTracking(true);
      const result = await activityTrackerService.trackWorkoutCompletion(
        workout.workout_id, 
        exerciseCount
      );
      
      setXpReward({
        amount: 25 + Math.min(exerciseCount, 10) * 2,
        message: `Workout "${workout.name}" abgeschlossen!`,
        isLevelUp: result.leveledUp,
        type: 'workout'
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking workout:', error);
      return { success: false, error };
    } finally {
      setIsTracking(false);
    }
  }, []);
  
  /**
   * Track completed exercise sets and award XP
   * @param {Object} exercise - The exercise object
   * @param {number} sets - Number of sets completed
   */
  const trackExerciseSets = useCallback(async (exercise, sets = 1) => {
    try {
      setIsTracking(true);
      const result = await activityTrackerService.trackExerciseSets(exercise.exercise_id, sets);
      
      setXpReward({
        amount: Math.min(sets, 10) * 5,
        message: `${sets} Sätze von "${exercise.name}" abgeschlossen!`,
        isLevelUp: result.leveledUp,
        type: 'exercise'
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking exercise sets:', error);
      return { success: false, error };
    } finally {
      setIsTracking(false);
    }
  }, []);
  
  /**
   * Track a personal record and award XP
   * @param {Object} exercise - The exercise object
   */
  const trackPersonalRecord = useCallback(async (exercise) => {
    try {
      setIsTracking(true);
      const result = await activityTrackerService.trackPersonalRecord(exercise.exercise_id);
      
      setXpReward({
        amount: 20,
        message: `Neuer persönlicher Rekord bei "${exercise.name}"!`,
        isLevelUp: result.leveledUp,
        type: 'record'
      });
      
      return result;
    } catch (error) {
      console.error('Error tracking personal record:', error);
      return { success: false, error };
    } finally {
      setIsTracking(false);
    }
  }, []);
  
  /**
   * Clear the current XP reward notification
   */
  const clearXpReward = useCallback(() => {
    setXpReward(null);
  }, []);
  
  return {
    xpReward,
    isTracking,
    trackWorkoutCompletion,
    trackExerciseSets,
    trackPersonalRecord,
    trackCustomXp,
    clearXpReward
  };
};

export default useActivityTracker;
