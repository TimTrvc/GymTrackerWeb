import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import Dropdown from "@/components/layout/Dropdown.jsx";
import { FaDumbbell } from "react-icons/fa6";
import { FaChartArea } from "react-icons/fa";
import { MdSportsGymnastics, MdSpaceDashboard } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { RiBodyScanFill } from "react-icons/ri";
import { UserCircleIcon } from '@heroicons/react/24/outline';

const training_dropdown = [
  { name: 'Übungen', description: 'Schaue dir hier die Übungen an und füge deine eigenen hinzu!', href: '/exercises', icon: FaDumbbell }, // Remove the curly braces
  { name: 'Workouts', description: 'Schaue dir hier die Workouts an und füge deine eigenen hinzu!', href: '/workouts', icon: MdSportsGymnastics },
  { name: 'Dashboard', description: 'Schaue dir hier dein persönliches Dashboard an!', href: '/dashboard', icon: MdSpaceDashboard },
  { name: 'Statistiken', description: 'Schaue dir hier deine persönliche Statistiken an!', href: '/statistics', icon: FaChartArea },
];

const body_dropdown = [
  { name: 'Ernährung', description: 'Tracke hier deine Ernährung für den maximalen Trainigserfolg!', href: '/nutrition', icon: PiBowlFoodFill }, // Remove the curly braces
  { name: 'Körpermaße', description: 'Tracke hier deine Maße um deinen Erfolg zu verfolgen!', href: '/body', icon: RiBodyScanFill },
];

const Navbar = () => {
  const { isAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };
  return (
    <nav className="bg-indigo-600 text-white shadow-lg overflow-visible">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">💪</span> GymTrack
          </Link>
        </div>

        <div className="flex items-center space-x-12">
          {isAuthenticated && (
            <>
              <Dropdown dropdown_title="Training" dropdown_items={training_dropdown} />
              <Dropdown dropdown_title="Körper" dropdown_items={body_dropdown} />
              <Link to="/avatar" className="inline-flex items-center gap-x-1 text-m font-semibold text-white-900 focus:outline-none">
                Avatar
              </Link>
              <Link 
                to="/profile"
                className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
              >
                <UserCircleIcon className="h-8 w-8" />
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
