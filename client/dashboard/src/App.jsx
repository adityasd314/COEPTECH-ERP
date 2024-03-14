// import { useState } from 'react';
import './App.css';
import Navbar from './components/Chakra/Navbar';
import {Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import About from './pages/About';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, dispatch, isLoading } = useAuthContext();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
        <Navbar user={user} currentPage={window.location.pathname} />
        <Routes>
          <Route path="/" element={<Home />} />
          {user && user.roleId === 3 ? (
            <Route
              path="/dashboard"
              element={<ProtectedRoute children={<AdminDashboard />} />}
            />
          ) : user && user.roleId === 2 ? (
            <Route
              path="/dashboard"
              element={<ProtectedRoute children={<FacultyDashboard />} />}
            />
          ) : (
            user &&
            user.roleId === 1 && (
              <Route
                path="/dashboard"
                element={<ProtectedRoute children={<StudentDashboard />} />}
              />
            )
          )}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/about" element={<About />} />
        </Routes>
    </>
  );
}

export default App;
