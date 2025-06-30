import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navigation from './Navigation';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          backgroundColor: '#f5f5f5', 
          minHeight: 'calc(100vh - 64px)' 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
