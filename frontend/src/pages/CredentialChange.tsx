import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress, CardContent, Alert } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import apiClient from '../config/api';
import { useAuth } from '../contexts/AuthContext';

function CredentialChange() {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | string[]>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const pendingGroup = sessionStorage.getItem('pending_group') || '';
  const pendingUsername = sessionStorage.getItem('pending_username') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/users/change-credentials/', {
        group: pendingGroup,
        username: pendingUsername,
        new_username: newUsername,
        new_password: newPassword,
      });
      setSuccess(true);
      sessionStorage.removeItem('pending_group');
      sessionStorage.removeItem('pending_username');
      sessionStorage.removeItem('pending_password');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      // Collect all error messages
      const data = err.response?.data;
      if (typeof data === 'string') {
        setError(data);
      } else if (data) {
        const messages: string[] = [];
        if (data.error) messages.push(data.error);
        Object.entries(data).forEach(([field, value]) => {
          if (Array.isArray(value)) {
            value.forEach((msg: string) => messages.push(`${field}: ${msg}`));
          }
        });
        setError(messages.length ? messages : 'Credential change failed.');
      } else {
        setError('Credential change failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!pendingGroup || !pendingUsername) {
    return <Navigate to="/login" />;
  }

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
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              fontFamily: 'Orbitron, monospace',
              fontWeight: 700,
              color: '#ffffff',
              mb: 2
            }}>
              🔐 Quantum Credentials
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              opacity: 0.9,
              color: '#c0c0c0',
              fontFamily: 'Orbitron, monospace'
            }}>
              Set your quantum username & password
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {success ? (
            <Alert severity="success" sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              color: '#00ff88'
            }}>
              Quantum credentials updated! Redirecting to login...
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="New Username"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
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
                label="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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
                Array.isArray(error) ? error.map((msg, idx) => (
                  <Alert severity="error" sx={{ 
                    mb: 1, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)'
                  }} key={idx}>{msg}</Alert>
                )) : <Alert severity="error" sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}>{error}</Alert>
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
                {loading ? 'Updating Quantum Credentials...' : '🚀 Update Quantum Credentials'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default CredentialChange; 