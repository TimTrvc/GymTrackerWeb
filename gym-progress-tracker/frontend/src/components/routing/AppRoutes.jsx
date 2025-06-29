import React from 'react';
import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Workouts from '@/pages/Workouts';
import Exercises from '@/pages/Exercises';
import Contact from '@/pages/Contact';
import Prices from '@/pages/Prices';
import Nutrition from '@/pages/Nutrition';
import Body from '@/pages/Body';
import Avatar from '@/pages/Avatar';
import Profile from '@/pages/Profile';
import Statistics from '@/pages/Statistics';
import Privacy from '@/pages/Privacy';
import { withPrivateRoute } from '@/components/features/auth/withPrivateRoute';

/**
 * AppRoutes component responsible for defining all application routes
 * Follows Single Responsibility Principle by focusing only on routing
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/workouts" element={withPrivateRoute(Workouts)} />      
      <Route path="/exercises" element={withPrivateRoute(Exercises)} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/prices" element={<Prices/>} />
      <Route path="/nutrition" element={withPrivateRoute(Nutrition)} />      
      <Route path="/body" element={withPrivateRoute(Body)} />
      <Route path="/avatar" element={withPrivateRoute(Avatar)} />
      <Route path="/profile" element={withPrivateRoute(Profile)} />
      <Route path="/statistics" element={withPrivateRoute(Statistics)} />
      <Route path="/privacy" element={<Privacy/>} />
    </Routes>
  );
};

export default AppRoutes;
