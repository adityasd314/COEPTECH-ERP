// import { useState } from 'react';
import './App.css';
import Navbar from './components/Chakra/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './Home';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import About from './About';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, dispatch, isLoading } = useAuthContext();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Router>
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
      </Router>
    </>
  );
}

export default App;
