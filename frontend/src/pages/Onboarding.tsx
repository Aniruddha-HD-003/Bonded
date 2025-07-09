import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress, CardContent, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import { Fade } from '@mui/material';

function Onboarding() {
  const [groupName, setGroupName] = useState('');
  const [numPeople, setNumPeople] = useState(2);
  const [credentials, setCredentials] = useState<{ username: string; password: string }[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/users/register-group/', {
        group_name: groupName,
        num_people: numPeople,
      });
      setCredentials(res.data.credentials);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ 
        maxWidth: 600, 
        width: '100%',
        background: 'rgba(26, 26, 58, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0, 255, 136, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box sx={{ 
          background: 'rgba(0, 255, 136, 0.1)',
          p: 4, 
          position: 'relative'
        }}>
          {/* Back to Home Button - Fixed position with dedicated space */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16, 
            zIndex: 1
          }}>
            <Button 
              onClick={() => navigate('/')}
              sx={{ 
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                fontFamily: 'Orbitron, monospace',
                '&:hover': { 
                  background: 'rgba(0, 255, 136, 0.1)',
                  borderColor: '#00ff88'
                }
              }}
            >
              ← Back to Home
            </Button>
          </Box>
          
          {/* Main content with left margin to avoid overlap */}
          <Box sx={{ 
            textAlign: 'center',
            ml: 8, // Add left margin to avoid overlap with back button
            mr: 2  // Add right margin for balance
          }}>
            <Typography variant="h4" sx={{ 
              fontFamily: 'Orbitron, monospace',
              fontWeight: 700,
              color: '#ffffff',
              mb: 2
            }}>
              🚀 Create Your Quantum Group
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              opacity: 0.9,
              color: '#c0c0c0',
              fontFamily: 'Orbitron, monospace'
            }}>
              Set up your private quantum social space for friends and memories
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {credentials ? (
            <Fade in={true} timeout={1000}>
              <Box>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold">🎉 Group Successfully Created!</Typography>
                  <Typography variant="body2">Share these credentials with your group members:</Typography>
                </Alert>
                <List sx={{ mb: 3 }}>
                  {credentials.map((cred, idx) => (
                    <Card key={idx} sx={{ 
                      mb: 2, 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Typography variant="h6" fontWeight="bold" color="white">
                              {cred.username}
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Password: {cred.password}
                            </Typography>
                          } 
                        />
                        <Chip label={`Member ${idx + 1}`} sx={{ 
                          background: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 'bold'
                        }} />
                      </ListItem>
                    </Card>
                  ))}
                </List>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                    borderRadius: 3,
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
                  Proceed to Login
                </Button>
              </Box>
            </Fade>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                fullWidth
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0, 255, 136, 0.05)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(0, 255, 136, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
              />
              <TextField
                label="Number of People"
                type="number"
                value={numPeople}
                onChange={e => setNumPeople(Number(e.target.value))}
                fullWidth
                required
                inputProps={{ min: 2, max: 50 }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0, 255, 136, 0.05)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(0, 255, 136, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                disabled={loading}
                sx={{ 
                  background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#0a0a1a',
                  borderRadius: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                    boxShadow: '0 6px 20px rgba(0, 255, 136, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? 'Creating Quantum Group...' : '🚀 Create Quantum Group'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Onboarding; 