// import { useState } from 'react';
import './App.css';
import Navbar from './components/Chakra/Navbar';
import { Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import StudentDashboard from './pages/StudentDashboard';
import HODDashboard from './pages/HODDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import About from './pages/About';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  let userP;
  userP = urlParams.get('user');
  if (userP) {
    localStorage.setItem('user', userP);
    window.location.href = '/';
  }
  userP = localStorage.getItem('user');
  if (!userP) {
    window.location.href = 'http://localhost:3000/';
  }

  const { user, dispatch, isLoading } = useAuthContext();
  if (isLoading) return <div>Loading...</div>;
  console.log('user', user);
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
                  user.role === 'student' ? (
                    <StudentDashboard user={user} />
                  ) : user.role === 'teacher' ? (
                    <TeacherDashboard user={user} />
                  ) : (
                    user.role === 'hod' && <HODDashboard user={user} />
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
