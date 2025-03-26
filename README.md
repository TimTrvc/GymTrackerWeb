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
gym-progress-tracker
├── backend
│   ├── app.js
│   ├── controllers
│   │   └── progressController.js
│   ├── models
│   │   └── progressModel.js
│   ├── routes
│   │   └── progressRoutes.js
│   └── utils
│       └── db.js
├── frontend
│   ├── index.html
│   ├── styles
│   │   └── styles.css
│   └── scripts
│       └── app.js
├── package.json
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
