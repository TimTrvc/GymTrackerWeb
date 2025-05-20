/**
 * HomeAvatarWidget
 * A simplified avatar widget for display on the home dashboard
 */
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { GiSwordWound,GiCheckedShield,GiBoltSpellCast } from 'react-icons/gi';
import { LiaRunningSolid } from "react-icons/lia";
import useAvatar from '@/hooks/useAvatar';

const HomeAvatarWidget = () => {
  const { avatar, loading } = useAvatar();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!avatar) {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-600 mb-4">
          <span className="text-3xl">💪</span>
        </div>
        <p className="text-gray-600 text-center">Dein Avatar wird geladen...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-600">
          <span className="text-3xl">💪</span>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-lg font-bold text-indigo-700">Level {avatar.level}</span>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ width: `${avatar.experience}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{avatar.experience}/100 XP</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <FaHeart className="text-red-500 mr-2" /> HP
            </span>
            <span className="text-indigo-700">{avatar.hp}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <GiBoltSpellCast className="text-blue-500 mr-2" /> MP
            </span>
            <span className="text-indigo-700">{avatar.mp}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <GiSwordWound className="text-orange-500 mr-2" /> Attack
            </span>
            <span className="text-indigo-700">{avatar.attack}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <GiCheckedShield className="text-brown-500 mr-2" /> Defense
            </span>
            <span className="text-indigo-700">{avatar.agility}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <LiaRunningSolid className="text-purple-500 mr-2" /> Agility
            </span>
            <span className="text-indigo-700">{avatar.agility}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAvatarWidget;
