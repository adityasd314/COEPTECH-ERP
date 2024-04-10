// import { useState } from 'react';
import './App.css';
import Navbar from './components/Chakra/Navbar';
import { Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
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
        <Route
          path="/"
          element={
            user ? (
              <ProtectedRoute
                children={
                  user.role === 'STUDENT' ? (
                    <StudentDashboard />
                  ) : user.role === 'TEACHER' ? (
                    <FacultyDashboard />
                  ) : (
                    user.role === 'ADMIN' && <AdminDashboard />
                  )
                }
              />
            ) : (
              <LoginForm />
            )
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;