# GymTracker

## 1. What is GymTracker?
GymTracker is a web application designed to help users track their training progress and stay motivated on their fitness journey. The platform incorporates gamification elements such as achievements, points, and levels, making it easier and more enjoyable for users to remain consistent with their workouts and reach their goals.

---

## 2. Environment Setup

Follow these steps to set up the local development environment for GymTracker:

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd gym-progress-tracker
   ```

2. **Install dependencies:**
   - Backend:
     ```sh
     cd backend
     npm install
     ```
   - Frontend:
     ```sh
     cd ../frontend
     npm install
     ```

3. **Set up PostgreSQL database:**
   - Ensure PostgreSQL is running locally.
   - Create a new database (e.g., `gymtracker`).
   - Run the SQL script in `database/create_script.sql` to set up the schema.

4. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the backend folder and update the values as needed (e.g., database credentials).

5. **Start the servers:**
   - Backend:
     ```sh
     cd backend
     npm start
     ```
   - Frontend:
     ```sh
     cd ../frontend
     npm run dev
     ```

---

## 3. Backend Overview

The backend is built with **Node.js** and provides a RESTful API for the frontend. It manages user authentication, workout and exercise data, and gamification features. Key aspects include:

- **Architecture:** Modular structure with controllers, middleware, and routes for different features (users, workouts, exercises, stats, etc.).
- **Database:** Interacts with a PostgreSQL database for persistent storage.
- **Authentication:** Uses middleware for authentication and authorization (e.g., JWT-based auth).
- **API Structure:** Organized by resource (users, workouts, exercises, etc.), following RESTful conventions.

---

## 4. Frontend Overview

The frontend is built with **React** and provides a modern, responsive user interface. Key aspects include:

- **Component Structure:** Components are organized by feature (e.g., authentication, exercises, workouts) and by common/shared UI elements.
- **State Management:** Uses React context and hooks for managing authentication and application state.
- **API Communication:** Communicates with the backend via HTTP requests to fetch and update data.
- **Routing:** Implements client-side routing for navigation between pages.

---

## 5. Conclusion / Personal Learnings

Working on GymTracker provided valuable experience in:

- Setting more realistic and achievable project goals
- Improving time management and planning skills
- Gaining an introduction to DevOps, including basic setup and deployment workflows
- Understanding the importance of good prompt engineering for AI-assisted development
- Building modern web applications with React
- Using JavaScript on both the frontend and backend (Node.js)