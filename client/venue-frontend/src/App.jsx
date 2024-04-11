import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Navbar from "./components/Navbar";
import About from "./components/About";

import { useAuthContext } from "./hooks/useAuthContext.js";

function App() {
  const { user } = useAuthContext();

  const checkRoleAndNavigate = (allowedRoles, component) => {
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;
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
          <Route path="/admin" element={checkRoleAndNavigate(["admin"], <AdminDashboard isManager={true}/>)} />
          <Route path="/faculty" element={checkRoleAndNavigate(["faculty", "admin"], <AdminDashboard/>)} />
          <Route path="/employee" element={checkRoleAndNavigate(["professor", "hod", "admin"], <EmployeeDashboard />)}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
