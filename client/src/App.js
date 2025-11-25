import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import REITList from './pages/REITList';
import REITDetails from './pages/REITDetails';
import Portfolio from './pages/Portfolio';
import Compare from './pages/Compare';
import Community from './pages/Community';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    socket.on('price_update', (data) => {
      setNotification(data.message);
      setTimeout(() => setNotification(''), 3000);
    });

    return () => socket.off('price_update');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="navbar">
        <h1>REIT Investment Platform</h1>
        <nav>
          {user ? (
            <>
              <Link to="/reits">REITs</Link>
              <Link to="/portfolio">Portfolio</Link>
              <Link to="/compare">Compare</Link>
              <Link to="/community">Community</Link>
              <span style={{ marginLeft: '2rem' }}>Balance: ₹{user.balance ? Number(user.balance).toFixed(2) : '0.00'}</span>
              <button onClick={handleLogout} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>

      {notification && (
        <div className="notification">{notification}</div>
      )}

      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/reits" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/reits" />} />
        <Route path="/reits" element={user ? <REITList /> : <Navigate to="/login" />} />
        <Route path="/reits/:id" element={user ? <REITDetails user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/portfolio" element={user ? <Portfolio user={user} /> : <Navigate to="/login" />} />
        <Route path="/compare" element={user ? <Compare /> : <Navigate to="/login" />} />
        <Route path="/community" element={user ? <Community user={user} socket={socket} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/reits" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
