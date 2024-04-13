import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Navbar from "./components/Navbar";
import About from "./components/About";
import { useAuthContext } from "./hooks/useAuthContext.js";
import Chatbot from "./components/Chatbot.jsx";
import axios from "axios";
import { backendURL } from "./config/config.js";

function App() {
  const { user } = useAuthContext();
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    getVenues();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  const checkRoleAndNavigate = (allowedRoles, component) => {
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;
    if (userRole && allowedRoles.includes(userRole)) {
      return component;
    } else {
      console.log(user)
      return <Navigate to="/" />;
    }
  };

  const getVenues = async () => {
    try {
      const response = await axios.get(`${backendURL}/venue/getVenues`);
      console.log(response.data.allVenues); 
      setVenues(response.data.allVenues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  }

  return (
    <>
    <Router>
      <div className="bg-white text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={checkRoleAndNavigate(["admin"], <AdminDashboard isManager={true}/>)} />
          <Route path="/faculty" element={checkRoleAndNavigate(["faculty", "admin"], <AdminDashboard/>)} />
          <Route path="/employee" element={checkRoleAndNavigate(["professor", "hod", "admin"], <EmployeeDashboard />)}/>
        </Routes>
      </div>
    </Router>
    <Chatbot mess={"Hello, I am COEP's Venue Booking Systems Assistant. How may I help you?"} initialPrompt={"'Act as a COEP's Venue Booking Systems Assistan and respond to this query: '"} data={venues}/>
    </>
  );
}

export default App;
