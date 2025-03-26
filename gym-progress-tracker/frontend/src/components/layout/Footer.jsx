import React from 'react';
import {Link} from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">GymTrack</h4>
            <p className="text-gray-400">Dein persönlicher Fitness-Tracker für optimale Erfolge im Gym.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-gray-400">
              <Link to="/" className="hover:text-indigo-200">Home</Link>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Preise</a></li>
              <li><a href="#" className="hover:text-white">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Erhalte Fitness-Tipps und Updates.</p>
            <div className="flex">
              <input type="email" placeholder="Deine Email" className="py-2 px-4 rounded-l outline-none text-gray-800 flex-grow" />
              <button className="bg-indigo-600 py-2 px-4 rounded-r hover:bg-indigo-700">Abonnieren</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 GymTrack. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
