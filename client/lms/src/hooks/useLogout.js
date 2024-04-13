import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('userP');
    localStorage.removeItem('user');
    window.location = 'http://localhost:3000/';
    // dispatch logout action
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
