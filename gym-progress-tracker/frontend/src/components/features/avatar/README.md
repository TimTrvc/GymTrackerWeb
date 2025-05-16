# Avatar Gamification System

The Avatar Gamification System adds RPG-like progression to the GymTracker app, allowing users to level up by completing workouts and exercises.

## Overview

This system allows users to:
- Gain XP by completing workouts and exercises
- Level up when reaching 100 XP
- Upgrade their avatar stats (HP, MP, Attack, Defense, Agility)
- Face progressively harder "boss battles" (to be implemented)

## Components

### Backend

- `avatarController.js`: Contains API endpoints for managing avatar data
- `avatarRoutes.js`: Routes for the avatar API endpoints

### Frontend

- `avatarService.js`: Communicates with the backend API
- `useAvatar.js`: Custom hook to manage avatar state and operations
- `useActivityTracker.js`: Tracks user activities and awards XP
- `AvatarGame.jsx`: Main avatar UI component
- `HomeAvatarWidget.jsx`: Simplified avatar display for the home page
- `XpRewardNotification.jsx`: Notification component for XP rewards

## XP Rewards

Users can earn XP through various activities:

1. **Workout Completion**: 25 XP + 2 XP per exercise (max 10 exercises)
   ```javascript
   // Example: Track a workout completion
   const { trackWorkoutCompletion } = useActivityTracker();
   await trackWorkoutCompletion(workoutObject, numberOfExercises);
   ```

2. **Exercise Sets**: 5 XP per set (max 10 sets)
   ```javascript
   // Example: Track exercise sets completion
   const { trackExerciseSets } = useActivityTracker();
   await trackExerciseSets(exerciseObject, numberOfSets);
   ```

3. **Personal Records**: 20 XP
   ```javascript
   // Example: Track a personal record
   const { trackPersonalRecord } = useActivityTracker();
   await trackPersonalRecord(exerciseObject);
   ```

## Avatar Stats

When users level up, they can choose one stat to upgrade:

1. **HP (Health Points)**: Determines how much damage users can take in battles
2. **MP (Magic Points)**: Used for special abilities
3. **Attack**: Determines damage dealt to enemies
4. **Defense**: Reduces damage taken
5. **Agility**: Gives chance to dodge attacks

## Integration Guide

### Adding XP Rewards to a New Feature

1. Import the activity tracker hook:
   ```javascript
   import useActivityTracker from '@/hooks/useActivityTracker';
   ```

2. Use the hook in your component:
   ```javascript
   const { xpReward, trackWorkoutCompletion, trackExerciseSets } = useActivityTracker();
   ```

3. Add the XP notification component:
   ```jsx
   {xpReward && (
     <XpRewardNotification
       xpAmount={xpReward.amount}
       message={xpReward.message}
       isLevelUp={xpReward.isLevelUp}
       onAnimationComplete={clearXpReward}
     />
   )}
   ```

4. Call the appropriate tracking method when the user completes an activity:
   ```javascript
   const handleExerciseCompletion = async () => {
     await trackExerciseSets(exerciseData, numberOfSets);
   };
   ```

## Future Enhancements

- Boss battle system
- Equipment and items
- Achievements and rewards
- Multiplayer challenges
