import React from 'react';
import { Box, Container, Typography, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BondedLogo from '../components/BondedLogo';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      mt: 2
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          {/* Hero Section */}
          <Box sx={{ mb: 6 }}>
            <BondedLogo size={120} src="/Bonded.png" />
            <Typography variant="h2" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
              Welcome to Bonded
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
              Your private social space for friends and memories
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
              Create exclusive groups, share moments, plan events, and stay connected with your closest friends in a secure, private environment.
            </Typography>
          </Box>

          {/* Action Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4, 
            maxWidth: 800, 
            mx: 'auto' 
          }}>
            {/* Register Group Card */}
            <Card sx={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              p: 4,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                background: 'rgba(255,255,255,0.15)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }
            }} onClick={() => navigate('/onboarding')}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                }}>
                  <GroupIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Create New Group
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  Start a new private group for your friends, family, or team. Set up credentials and invite members.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                    }
                  }}
                >
                  🚀 Get Started
                </Button>
              </Box>
            </Card>

            {/* Login Card */}
            <Card sx={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              p: 4,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                background: 'rgba(255,255,255,0.15)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }
            }} onClick={() => navigate('/login')}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)'
                }}>
                  <DashboardIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Sign In
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  Already have a group? Sign in with your credentials to access your social space.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                    }
                  }}
                >
                  🔐 Sign In
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 