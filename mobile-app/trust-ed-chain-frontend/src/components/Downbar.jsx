import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import PersonIcon from '@mui/icons-material/Person';

const DownBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Retrieved token from localStorage:", token); // Debug Step 1

    if (token) {
      fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user profile data:", data); // Debug Step 2
          setUserRole(data?.role || 'lender'); // default to 'lender'
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err); // Debug Step 3
          setLoading(false);
        });
    } else {
      console.warn("No token found in localStorage."); // Debug Step 4
      setLoading(false);
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  if (loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        backgroundColor: '#3836bd',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        zIndex: 1000,
        borderRadius: '20px',
      }}
    >
      <IconButton
        sx={{ color: isActive('/dashboard') ? '#f47500' : 'white' }}
        onClick={() => navigate('/dashboard')}
      >
        <HomeIcon />
      </IconButton>

      <IconButton
        sx={{
          color: isActive('/my-loans') || isActive('/my-investments') ? '#f47500' : 'white',
        }}
        onClick={() => {
          console.log("User role from API state:", userRole); // Debug Step 5

          if (userRole === 'lender') {
            console.log("Navigating to /my-investments"); // Debug Step 6
            navigate('/my-investments');
          } else {
            console.log("Navigating to /my-loans"); // Debug Step 7
            navigate('/my-loans');
          }
        }}
      >
        <DashboardIcon />
      </IconButton>

      <IconButton
        sx={{ color: isActive('/chat') ? '#f47500' : 'white' }}
        onClick={() => navigate('/chat')}
      >
        <ExtensionIcon />
      </IconButton>

      <IconButton
        sx={{ color: isActive('/about') ? '#f47500' : 'white' }}
        onClick={() => navigate('/about')}
      >
        <PersonIcon />
      </IconButton>
    </Box>
  );
};

export default DownBar;
