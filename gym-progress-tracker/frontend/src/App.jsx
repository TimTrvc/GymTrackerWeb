import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';

// Seiten
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Workouts from '@/pages/Workouts';
import Exercises from '@/pages/Exercises';
import Statistics from '@/pages/Statistics';
import Dashboard from '@/pages/Dashboard';
import Contact from '@/pages/Contact';
import Prices from '@/pages/Prices';
import Features from '@/pages/Features';
import Nutrition from '@/pages/Nutrition';
import Body from '@/pages/Body';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PrivateRoute from '@/components/features/auth/PrivateRoute';

const privateRoute = (Component) => (
  <PrivateRoute>
    <Component />
  </PrivateRoute>
);

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
              <Route path="/workouts" element={privateRoute(Workouts)} />
              <Route path="/exercises" element={privateRoute(Exercises)} />
              <Route path="/dashboard" element={privateRoute(Dashboard)} />
              <Route path="/statistics" element={privateRoute(Statistics)} />
              <Route path="/contact" element={privateRoute(Contact)} />
              <Route path="/prices" element={privateRoute(Prices)} />
              <Route path="/features" element={privateRoute(Features)} />
              <Route path="/nutrition" element={privateRoute(Nutrition)} />
              <Route path="/body" element={privateRoute(Body)} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
