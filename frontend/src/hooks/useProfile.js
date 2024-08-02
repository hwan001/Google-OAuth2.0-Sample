import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useGoogleLogin } from '@react-oauth/google';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await axios.post(`${BASE_URL}/auth/google`, {
          code: codeResponse.code,
        }, { withCredentials: true });

        if (response.data.message === 'Logged in') {
            setProfile(response.data.profile);
            
            //console.log('Profile data assigned:');
            console.log("Logged in", response.data.profile);
        } else {
            console.error('Failed to set JWT token in cookie');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setError(error);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, { withCredentials: true });
      setProfile(response.data);
      
      // console.log('Profile data assigned:', response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('User is not authenticated');
        setError(null);
      } else {
        console.error('Failed to fetch profile', err);
        setError(err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, login, error, setProfile };
}