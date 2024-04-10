import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogin } from '../hooks/useLogin';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  const { isLoading } = useLogin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!localStorage.getItem('user') || !user) {
    return <Navigate to="/" />;
  }

  // if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default ProtectedRoute;
