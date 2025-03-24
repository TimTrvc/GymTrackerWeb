import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Seiten
import Home from './pages/Home';
import Login from './pages/Login';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Statistics from './pages/Statistics';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/workouts"
                element={
                  <PrivateRoute>
                    <Workouts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/exercises"
                element={
                  <PrivateRoute>
                    <Exercises />
                  </PrivateRoute>
                }
              />
              <Route
                path="/statistics"
                element={
                  <PrivateRoute>
                    <Statistics />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
