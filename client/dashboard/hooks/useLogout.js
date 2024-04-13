export const useLogout = () => {

  const logout = () => {
   
 
      localStorage.removeItem('user');
    
 }

  return { logout }
}