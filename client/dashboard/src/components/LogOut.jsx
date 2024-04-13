import React from "react";
import { useLogout } from "../../hooks/useLogout";

const LogoutButton = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout(); 
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
<p
  className="text-black border border-gray-300 px-4 py-2 rounded-md inline-block"
  onClick={handleLogout}
  style={{ cursor: 'auto' }}
>
  LogOut
</p>

  );
};

export default LogoutButton;
