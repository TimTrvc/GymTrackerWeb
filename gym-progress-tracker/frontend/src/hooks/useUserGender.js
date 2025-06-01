import { useState, useEffect } from 'react';
import { getUserDetails } from '@/services/userService';


/**
 * React hook to fetch the user's gender information from the user service.
 *
 * @returns {Object} Object containing gender, loading, and error state.
 */
const useUserGender = () => {
  const [gender, setGender] = useState('m'); // Default to male
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the user profile and updates gender state.
     * @returns {Promise<void>}
     */
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
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