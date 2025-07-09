import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';

function Login() {
  const [group, setGroup] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setMemberships } = useGroup();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/users/group-login/', {
        group,
        username,
        password,
      });
      if (res.data.must_change_credentials) {
        console.log('Login: Must change credentials, redirecting to change-credentials');
        sessionStorage.setItem('pending_group', group);
        sessionStorage.setItem('pending_username', username);
        sessionStorage.setItem('pending_password', password);
        navigate('/change-credentials');
      } else if (res.data.access) {
        console.log('Login: Success! Storing tokens and redirecting to dashboard');
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('memberships', JSON.stringify(res.data.memberships));
        setMemberships(res.data.memberships);
        login(); // Update authentication state
        console.log('Login: Stored memberships:', res.data.memberships);
        navigate('/dashboard');
      } else {
        console.log('Login: Unknown response:', res.data);
        setError('Unknown response from server.');
      }
    } catch (err: any) {
      const mustChange = err.response?.data?.must_change_credentials;
      if (mustChange) {
        sessionStorage.setItem('pending_group', group);
        sessionStorage.setItem('pending_username', username);
        sessionStorage.setItem('pending_password', password);
        navigate('/change-credentials');
        return;
      }
      setError(err.response?.data?.detail || err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ 
        maxWidth: 500, 
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
              🔐 Quantum Login
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              opacity: 0.9,
              color: '#c0c0c0',
              fontFamily: 'Orbitron, monospace'
            }}>
              Sign in to your quantum group space
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Group Name"
              value={group}
              onChange={e => setGroup(e.target.value)}
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
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
              {loading ? 'Quantum Signing In...' : '🚀 Quantum Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login; 