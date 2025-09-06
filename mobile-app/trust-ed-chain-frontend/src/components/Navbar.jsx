import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List,
  ListItem, ListItemText, Box, Button, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in (you can replace this with a more secure method)
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(user?.isLoggedIn || false); // Assuming user data is stored in localStorage
  }, []);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Verify', path: '/verify' },
  ];

  const authItems = [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from local storage
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: '#3836bd', height: '80px', boxShadow: '0' }}
        className="z-50"
      >
        <Toolbar className="flex justify-between h-full px-3">
          {/* Logo + Brand Name */}
          <Box className="flex items-center space-x-4 mt-3 mx-3">
            <img
              src="/logo.png" // adjust path based on where your logo is placed
              alt="logo"
              className="h-10 w-10 object-contain"
            />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{ fontWeight: '700' }}
              className="text-secondary font-circle text-2xl"
            >
              T.E.C
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton edge="end" sx={{ color: "#f47500", paddingRight: "30px" }} onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="flex items-center gap-6">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{ color: "#ffffff", fontWeight: "500" }}
                  className={`text-white hover:text-700 transition-all duration-200 ${
                    isActive(item.path) ? 'text-secondary font-bold' : ''
                  }`}
                >
                  {item.label}
                </Button>
              ))}
              {/* Conditionally render Login/Logout */}
              {isLoggedIn ? (
                <Button
                  sx={{ color: "#ffffff", fontWeight: "500" }}
                  onClick={handleLogout}
                  className="text-white hover:text-700 transition-all duration-200"
                >
                  Logout
                </Button>
              ) : (
                authItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{ color: "#ffffff", fontWeight: "500" }}
                    className="text-white hover:text-700 transition-all duration-200"
                  >
                    {item.label}
                  </Button>
                ))
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Offset for fixed Navbar */}
      <div className="h-5" />

      {/* Drawer for Mobile View */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box className="w-64 h-full bg-primary flex flex-col justify-center">
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemText
                  primary={item.label}
                  className={`text-white ${isActive(item.path) ? 'text-[#C8791D] font-bold' : ''}`}
                />
              </ListItem>
            ))}
            {/* Conditionally render Login/Logout in the mobile drawer */}
            {isLoggedIn ? (
              <ListItem button onClick={handleLogout}>
                <ListItemText
                  primary="Logout"
                  className="text-white font-bold"
                />
              </ListItem>
            ) : (
              authItems.map((item) => (
                <ListItem
                  button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemText
                    primary={item.label}
                    className="text-white font-bold"
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
