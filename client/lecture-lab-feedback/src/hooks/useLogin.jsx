import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import roles from '../constants/roles';
const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(API_ENDPOINT + '/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const user = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(user.error);
    }
    if (response.ok) {
      // set the user role
      user.role = roles[user.roleId];

      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(user));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: user });

      // update loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
