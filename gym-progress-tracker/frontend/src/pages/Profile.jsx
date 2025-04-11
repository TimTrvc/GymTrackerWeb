import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '@/context/AuthContext';
import HeroSection from '@/components/layout/HeroSection';
import { getUserDetails, updateUserDetails } from '@/services/userService';

const Profile = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserDetails(user?.id);
        console.log('Fetched user data:', data);
        if (data) {
          setUserData(data);
        } else {
          setError('No user data received');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.id) {
      fetchUserData();
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Since the backend now returns a correctly formatted string (YYYY-MM-DD),
    // we can simply return it for the date input
    return dateString;
  };
  
  // filepath: c:\Users\luigeig\Desktop\DHBW\WebEngineering\GymTrackerWeb\gym-progress-tracker\frontend\src\pages\Profile.jsx
  const displayDate = (dateString) => {
    if (!dateString) return '';
    // Parse the date string into a Date object
    const date = new Date(dateString);
    // Ensure the date is valid
    if (isNaN(date)) {
      console.error("Invalid date string:", dateString);
      return '-'; // Or some other placeholder
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  


const getGenderDisplay = (gender) => {
  if (gender === 'm') return 'Männlich';
  if (gender === 'f') return 'Weiblich';
  if (gender === 'd') return 'Divers';
  return gender || '';
};

const handleSave = async () => {
  try {
    console.log("Saving user data:", userData);
    
    const response = await updateUserDetails(user.id, {
      username: userData.username,
      email: userData.email,
      height: userData.height,
      first_name: userData.first_name,
      last_name: userData.last_name,
      date_of_birth: userData.date_of_birth,
      gender: userData.gender
    });
    
    console.log("Response from server:", response);
    
    if (response && response.user) {
      // Create a new user data object from the response
      const updatedUserData = {...response.user};
      
      // Apply the same date formatting used in fetchUserData to ensure consistency
      if (updatedUserData.date_of_birth) {
        // No need to modify the date, as we'll use our display functions when showing it
        // This ensures consistent date handling throughout the application
      }
      
      // Update the state with the corrected data
      setUserData(updatedUserData);
      setSuccess('Profil erfolgreich aktualisiert!');
      setIsEditing(false);
    } else {
      setError('Fehler beim Aktualisieren des Profils: Ungültige Serverantwort');
    }
  } catch (err) {
    console.error('Error updating user details:', err);
    setError(`Fehler beim Aktualisieren des Profils: ${err.message || 'Unbekannter Fehler'}`);
  }
};

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userData) {
    return <p className="text-red-500">User data could not be loaded.</p>;
  }

  return (
    <>
      <HeroSection title="Profil" subtitle="Verwalte dein Profil" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profil Einstellungen</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Benutzername</p>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={userData.username || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{userData.username}</p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{userData.email}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Vorname</p>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{userData.first_name || '-'}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Nachname</p>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{userData.last_name || '-'}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Geburtsdatum</p>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={formatDate(userData.date_of_birth)}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{displayDate(userData.date_of_birth) || '-'}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Geschlecht</p>
              {isEditing ? (
                <select
                  name="gender"
                  value={userData.gender || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Bitte wählen</option>
                  <option value="m">Männlich</option>
                  <option value="f">Weiblich</option>
                  <option value="d">Divers</option>
                </select>
              ) : (
                <p className="font-semibold">{getGenderDisplay(userData.gender)}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Größe (cm)</p>
              {isEditing ? (
                <input
                  type="number"
                  name="height"
                  value={userData.height || ''}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="font-semibold">{userData.height || '-'}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Speichern
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;