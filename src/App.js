import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import QRCodeDisplay from './pages/QRCodeDisplayPage';
import InfoDisplay from './pages/InfoDisplayPage';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/qr/:id" element={
              <PrivateRoute>
                <QRCodeDisplay />
              </PrivateRoute>
            } />
            <Route path="/info/:id" element={<InfoDisplay />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;