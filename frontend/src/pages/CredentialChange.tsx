import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const CredentialChange = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await apiClient.post('/users/change-credentials/', {
        username,
        password,
      });
      setSuccess('Credentials updated. Please log in again.');
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credential change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      <Card sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          p: 4, 
          position: 'relative'
        }}>
          {/* Back to Home Button */}
          <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
            <Button onClick={() => navigate('/dashboard')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
              ← Back to Dashboard
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', ml: 8, mr: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              🔑 Change Credentials
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Update your username and password
            </Typography>
          </Box>
          <Box mt={4}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                margin="normal"
                required
                sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold' }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Credentials'}
              </Button>
            </form>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CredentialChange; 