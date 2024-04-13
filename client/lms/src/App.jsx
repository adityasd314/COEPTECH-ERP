import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Navbar from "./components/Navbar";
import About from "./components/About";
import axios from "axios";

import { useAuthContext } from "./hooks/useAuthContext.js";

function App() {

  const urlParams = new URLSearchParams(window.location.search);
  let userP;
  userP = urlParams.get('user');

  if ((userP != null || userP!="null") && userP?.length>=20) {
    localStorage.setItem('userP', userP);
    console.log(">>", userP);
  }
  userP = localStorage.getItem('userP');

  if ((userP == null || userP=="null") && userP?.length< 20) {
     alert("Login !!")
    window.location.href = 'http://localhost:3000';
    return
  }

  console.log({userP})

  const login = async () => { 
    const token = JSON.parse(userP).token;
    if (token) {
      try {
        console.log("Passing : ", token);
        const response = await axios.post("http://localhost:5001/user/loginToken", { token });
        const { user } = response.data;
        console.log("Login response:", user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      console.log("No token found");
    }
  };

  React.useEffect(() => {
    login();  
  }, [userP]);

  const { user } = useAuthContext();

  const checkRoleAndNavigate = (allowedRoles, component) => {
    const userString = localStorage.getItem("user")
    console.log({userString})
    if(!userString){
      return <Navigate to="/login" />;
    }
    const userRole = JSON.parse(userString)?.role;
    if (userRole && allowedRoles.includes(userRole)) {
      return component;
    } else {
      console.log(user)
      return <Navigate to="/" />;
    }
  };
  

  return (
    <Router>
      <div className="bg-white text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={checkRoleAndNavigate(["admin"], <AdminDashboard />)} />
          <Route path="/manager" element={checkRoleAndNavigate(["hod"], <AdminDashboard isManager={true} />)}/>
          <Route path="/employee" element={checkRoleAndNavigate(["teacher", "hod"], <EmployeeDashboard />)}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
