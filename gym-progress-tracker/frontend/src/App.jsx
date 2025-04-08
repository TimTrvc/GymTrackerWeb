import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from '@/components/routing/AppRoutes';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Main application component with primary layout structure
 * Responsible for providing context and basic application shell
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
