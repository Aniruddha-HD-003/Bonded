import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';

const Onboarding = () => {
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
            <Button onClick={() => navigate('/')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
              ← Back to Home
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', ml: 8, mr: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              🚀 Create Your Group
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Set up your private social space for friends and memories
            </Typography>
          </Box>
          <Box mt={4}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                margin="normal"
                required
                sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Number of People"
                type="number"
                value={numPeople}
                onChange={e => setNumPeople(Number(e.target.value))}
                margin="normal"
                required
                inputProps={{ min: 2, max: 20 }}
                sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold' }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Group'}
              </Button>
            </form>
          </Box>
          {credentials && (
            <Box mt={4} sx={{ background: 'rgba(255,255,255,0.15)', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Group Credentials</Typography>
              {credentials.map((cred, idx) => (
                <Typography key={idx} sx={{ mb: 1 }}>
                  <strong>{cred.username}</strong>: {cred.password}
                </Typography>
              ))}
              <Button variant="outlined" sx={{ mt: 2, color: 'white', borderColor: 'white' }} onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Onboarding; 