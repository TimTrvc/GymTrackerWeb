# Gym Progress Tracker

## Overview
The Gym Progress Tracker is a web application designed to help users track their gym progress over time. Users can log their workouts, monitor their progress, and make adjustments to their fitness routines based on their performance.

## Features
- Add new workout progress entries
- View historical progress data
- Update existing progress entries
- User-friendly interface

## Project Structure
```
gym-progress-tracker/
├── backend/
│   ├── controllers/
│   │   ├── exercises/
│   │   │   ├── exerciseCategoriesController.js
│   │   │   ├── exercisePerformanceController.js
│   │   │   ├── exercisesController.js
│   │   │   └── templateExercisesController.js
│   │   ├── stats/
│   │   │   ├── activityStatsController.js
│   │   │   ├── bodyMeasurementsController.js
│   │   │   ├── goalsController.js
│   │   │   ├── nutritionLogsController.js
│   │   │   ├── personalRecordsController.js
│   │   │   └── trainingSessionsController.js
│   │   ├── user/
│   │   │   ├── userConnectionsController.js
│   │   │   ├── userController.js
│   │   │   └── userWeightLogsController.js
│   │   ├── workouts/
│   │       ├── workoutController.js
│   │       ├── workoutExercisesController.js
│   │       └── workoutTemplatesController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── exercises/
│   │   │   ├── exerciseCategoriesRoutes.js
│   │   │   ├── exercisePerformanceRoutes.js
│   │   │   ├── exerciseRoutes.js
│   │   │   └── templateExercisesRoutes.js
│   │   ├── stats/
│   │   │   ├── activityStatsRoutes.js
│   │   │   ├── bodyMeasurementRoutes.js
│   │   │   ├── goalsRoutes.js
│   │   │   ├── nutritionLogsRoutes.js
│   │   │   ├── personalRecordsRoutes.js
│   │   │   └── trainingSessionsRoutes.js
│   │   ├── user/
│   │   │   ├── userConnectionsRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── userWeightLogsRoutes.js
│   │   ├── workouts/
│   │       ├── workoutExercisesRoutes.js
│   │       ├── workoutRoutes.js
│   │       └── workoutTemplateRoutes.js
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── render.yaml
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthTab.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── exercises/
│   │   │   │   ├── ExerciseCategoryCard.jsx
│   │   │   │   └── ExercisesCategories.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── workouts/
│   │   │       ├── WorkoutCreate.jsx
│   │   │       ├── WorkoutEdit.jsx
│   │   │       ├── WorkoutNav.jsx
│   │   │       ├── WorkoutTabs.jsx
│   │   │       └── WorkoutView.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Exercises.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Workouts.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── exerciseCategoriesService.js
│   │   │   ├── exercisesService.js
│   │   │   └── workoutService.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
└── README.md

```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd gym-progress-tracker
   ```
3. Install dependencies for both frontend and backend:
   ```
   npm install
   ```

## Usage
1. Start the backend server:
   ```
   node server.js in gym-progress-tracker/backend
   ```
2. Run npm/pnpm run dev in gym-progress-tracker/frontend

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- React with TailwindCSS for frontend

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.
