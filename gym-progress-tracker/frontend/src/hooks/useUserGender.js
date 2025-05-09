import { useState, useEffect } from 'react';
import { getUserDetails } from '@/services/userService';

/**
 * Hook to fetch the user's gender information
 * @returns {Object} Object containing gender and loading state
 */
const useUserGender = () => {
  const [gender, setGender] = useState('m'); // Default to male
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
        if (!userId) {
          throw new Error('User ID not found');
        }
        const profileData = await getUserDetails(userId);
        if (profileData && profileData.gender) {
          setGender(profileData.gender);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user gender information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { gender, loading, error };
};

export default useUserGender;