export const useLogout = () => {

  const logout = () => {
   
 
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    
 }

  return { logout }
}