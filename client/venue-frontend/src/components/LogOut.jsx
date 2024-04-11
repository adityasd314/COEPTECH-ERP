import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { CiLogout } from "react-icons/ci";
import { Icon } from "@chakra-ui/react";
import axios from "axios"; // Don't forget to import Axios
import { useAuthContext } from "../hooks/useAuthContext";
import { backendURL } from "../config/config";

const LogoutButton = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = async () => {
    try {
      logout();
     
      const postlogout = await axios.post(
        backendURL + "/employee/postlogout",{employeeID:user._id}); 
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div onClick={handleLogout} className="font-bold mt-2">
      <Icon as={CiLogout} boxSize={7} />
    </div>
  );
};

export default LogoutButton;
