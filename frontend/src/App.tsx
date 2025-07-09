import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  CssBaseline, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Alert,
  Card,
  CardContent,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  LinearProgress,
  MenuItem,
  Checkbox,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Logout as LogoutIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  EmojiEvents as EmojiEventsIcon,
  Leaderboard as LeaderboardIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Poll as PollIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  Memory as MemoryIcon,
  Link as LinkIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CompareArrows as CompareArrowsIcon,
  Create as CreateIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  Cake as CakeIcon,
  Favorite as FavoriteIcon,
  Celebration as CelebrationIcon,
  VolunteerActivism as VolunteerActivismIcon
} from '@mui/icons-material';
import apiClient from './config/api';
import BondedLogo from './components/BondedLogo';
import BirthdayCelebrations from './components/BirthdayCelebrations';
import AnniversaryCelebrations from './components/AnniversaryCelebrations';
import HolidayGames from './components/HolidayGames';
import RandomActsOfKindness from './components/RandomActsOfKindness';
import QuantumKitten from './components/QuantumKitten';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';


// Group context to provide memberships and selected group
type Membership = {
  group_id: number;
  group_name: string;
  username: string;
  role: string;
};
const GroupContext = createContext<any>(null);

// Auth context to manage authentication state
const AuthContext = createContext<any>(null);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>(() => {
    const m = localStorage.getItem('memberships');
    return m ? JSON.parse(m) : [];
  });
  // Auto-select group if only one membership exists
  const [selectedGroup, setSelectedGroup] = useState<Membership | null>(() => {
    const sg = localStorage.getItem('selectedGroup');
    if (sg) return JSON.parse(sg);
    const m = localStorage.getItem('memberships');
    if (m) {
      const memberships = JSON.parse(m);
      if (memberships.length === 1) return memberships[0];
    }
    return null;
  });

  useEffect(() => {
    if (memberships.length > 0) {
      localStorage.setItem('memberships', JSON.stringify(memberships));
      // If only one group, auto-select it
      if (memberships.length === 1) {
        setSelectedGroup(memberships[0]);
        localStorage.setItem('selectedGroup', JSON.stringify(memberships[0]));
      }
    }
  }, [memberships]);

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem('selectedGroup', JSON.stringify(selectedGroup));
    }
  }, [selectedGroup]);

  return (
    <GroupContext.Provider value={{ memberships, setMemberships, selectedGroup, setSelectedGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsAuthenticated(!!token);
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}



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



function Games() {
  const { selectedGroup } = useGroup();
  const [activeTab, setActiveTab] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [streaks, setStreaks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    challenge_type: 'daily',
    category: 'post',
    target_count: 1,
    points_reward: 10,
    start_date: '',
    end_date: ''
  });
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<any>(null);
  const [polls, setPolls] = useState<any[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: [{ text: '' }, { text: '' }],
    allow_multiple: false
  });
  const [pollVoteLoading, setPollVoteLoading] = useState(false);
  const [pollVoteError, setPollVoteError] = useState('');
  const [pollCreateError, setPollCreateError] = useState('');
  
  // Social Icebreakers state
  const [twoTruthsLieGames, setTwoTruthsLieGames] = useState<any[]>([]);
  const [showCreateTwoTruthsLie, setShowCreateTwoTruthsLie] = useState(false);
  const [newTwoTruthsLie, setNewTwoTruthsLie] = useState({
    statement1: '',
    statement2: '',
    statement3: '',
    lie_statement: 1
  });
  
  const [wouldYouRatherPolls, setWouldYouRatherPolls] = useState<any[]>([]);
  const [showCreateWouldYouRather, setShowCreateWouldYouRather] = useState(false);
  const [newWouldYouRather, setNewWouldYouRather] = useState({
    question: '',
    option_a: '',
    option_b: ''
  });
  
  const [thisOrThatPolls, setThisOrThatPolls] = useState<any[]>([]);
  const [showCreateThisOrThat, setShowCreateThisOrThat] = useState(false);
  const [newThisOrThat, setNewThisOrThat] = useState({
    question: '',
    option_a: '',
    option_b: ''
  });
  
  const [fillInBlankGames, setFillInBlankGames] = useState<any[]>([]);
  const [showCreateFillInBlank, setShowCreateFillInBlank] = useState(false);
  const [newFillInBlank, setNewFillInBlank] = useState({
    template: ''
  });
  
  // Engagement Games state
  const [spotDifferenceGames, setSpotDifferenceGames] = useState<any[]>([]);
  const [showCreateSpotDifference, setShowCreateSpotDifference] = useState(false);
  const [newSpotDifference, setNewSpotDifference] = useState({
    title: '',
    description: '',
    original_image: '',
    modified_image: '',
    difficulty: 'medium',
    differences_count: 5,
    time_limit: 60,
    points_reward: 10
  });
  
  const [guessWhoGames, setGuessWhoGames] = useState<any[]>([]);
  const [showCreateGuessWho, setShowCreateGuessWho] = useState(false);
  const [newGuessWho, setNewGuessWho] = useState({
    title: '',
    description: '',
    mystery_image: '',
    correct_answer: '',
    hints: ['', '', ''],
    time_limit: 120,
    points_reward: 15
  });
  
  const [wordCloudData, setWordCloudData] = useState<any>(null);
  const [wordCloudPeriod, setWordCloudPeriod] = useState('daily');
  const [wordCloudLoading, setWordCloudLoading] = useState(false);
  
  const [reactionRaceGames, setReactionRaceGames] = useState<any[]>([]);
  const [showCreateReactionRace, setShowCreateReactionRace] = useState(false);
  const [newReactionRace, setNewReactionRace] = useState({
    title: '',
    description: '',
    target_post_id: '',
    duration: 300,
    points_reward: 20
  });

  // New: State placeholders for special events

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchGamesData = () => {
    if (!selectedGroup) return;
    setLoading(true);
    // Fetch challenges
    apiClient.get(`/games/challenges/?group=${selectedGroup.group_id}`)
      .then((res: any) => setChallenges(res.data))
      .catch(() => setChallenges([]));
    // Fetch streaks
    apiClient.get(`/games/streaks/?group=${selectedGroup.group_id}`)
      .then((res: any) => setStreaks(res.data))
      .catch(() => setStreaks([]));
    // Fetch leaderboard
    apiClient.get(`/games/leaderboard-entries/?group=${selectedGroup.group_id}`)
      .then((res: any) => setLeaderboard(res.data))
      .catch(() => setLeaderboard([]));
    // Fetch user stats
    apiClient.get(`/games/user-stats/?group=${selectedGroup.group_id}`)
      .then((res: any) => setUserStats(res.data))
      .catch(() => setUserStats(null))
      .finally(() => setLoading(false));
  };

  const fetchPolls = useCallback(() => {
    if (!selectedGroup) return;
    apiClient.get(`/games/polls/?group=${selectedGroup.group_id}`)
      .then((res: any) => setPolls(res.data))
      .catch(() => setPolls([]));
  }, [selectedGroup]);

  const fetchSocialIcebreakers = useCallback(() => {
    if (!selectedGroup) return;
    
    // Fetch Two Truths and Lie games
    apiClient.get(`/games/two-truths-lie/?group=${selectedGroup.group_id}`)
      .then((res: any) => setTwoTruthsLieGames(res.data))
      .catch(() => setTwoTruthsLieGames([]));
    
    // Fetch Would You Rather polls
    apiClient.get(`/games/would-you-rather/?group=${selectedGroup.group_id}`)
      .then((res: any) => setWouldYouRatherPolls(res.data))
      .catch(() => setWouldYouRatherPolls([]));
    
    // Fetch This or That polls
    apiClient.get(`/games/this-or-that/?group=${selectedGroup.group_id}`)
      .then((res: any) => setThisOrThatPolls(res.data))
      .catch(() => setThisOrThatPolls([]));
    
    // Fetch Fill in the Blank games
    apiClient.get(`/games/fill-in-blank/?group=${selectedGroup.group_id}`)
      .then((res: any) => setFillInBlankGames(res.data))
      .catch(() => setFillInBlankGames([]));
  }, [selectedGroup]);

  const fetchEngagementGames = useCallback(() => {
    if (!selectedGroup) return;
    
    // Fetch Spot the Difference games
    apiClient.get(`/games/spot-difference/?group=${selectedGroup.group_id}`)
      .then((res: any) => setSpotDifferenceGames(res.data))
      .catch(() => setSpotDifferenceGames([]));
    
    // Fetch Guess Who games
    apiClient.get(`/games/guess-who/?group=${selectedGroup.group_id}`)
      .then((res: any) => setGuessWhoGames(res.data))
      .catch(() => setGuessWhoGames([]));
    
    // Fetch Reaction Race games
    apiClient.get(`/games/reaction-race/?group=${selectedGroup.group_id}`)
      .then((res: any) => setReactionRaceGames(res.data))
      .catch(() => setReactionRaceGames([]));
  }, [selectedGroup]);

  const fetchWordCloud = useCallback(async (period: string = 'daily') => {
    if (!selectedGroup) return;
    
    setWordCloudLoading(true);
    try {
      const response = await apiClient.get(`/games/word-cloud/${selectedGroup.group_id}/?period=${period}`);
      setWordCloudData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch word cloud:', err);
      setWordCloudData(null);
    } finally {
      setWordCloudLoading(false);
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchGamesData();
    fetchPolls();
    fetchSocialIcebreakers();
    fetchEngagementGames();
    fetchWordCloud(wordCloudPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/games/challenges/', {
        ...newChallenge,
        group: selectedGroup.group_id
      });
      setNewChallenge({
        title: '',
        description: '',
        challenge_type: 'daily',
        category: 'post',
        target_count: 1,
        points_reward: 10,
        start_date: '',
        end_date: ''
      });
      setShowCreateChallenge(false);
      fetchGamesData();
    } catch (err: any) {
      console.error('Failed to create challenge:', err);
    }
  };

  const calculateLeaderboard = async () => {
    try {
      await apiClient.post('/games/leaderboards/calculate/', {
        group: selectedGroup.group_id,
        period: 'all_time'
      });
      fetchGamesData();
    } catch (err: any) {
      console.error('Failed to calculate leaderboard:', err);
    }
  };

  // Delete challenge logic
  const handleDeleteChallenge = (challenge: any) => {
    setChallengeToDelete(challenge);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    try {
      await apiClient.delete(`/games/challenges/${challengeToDelete.id}/`);
      setDeleteDialogOpen(false);
      setChallengeToDelete(null);
      fetchGamesData();
    } catch (err: any) {
      setDeleteDialogOpen(false);
      setChallengeToDelete(null);
      console.error('Failed to delete challenge:', err);
    }
  };
  const cancelDeleteChallenge = () => {
    setDeleteDialogOpen(false);
    setChallengeToDelete(null);
  };

  // Filter out expired challenges (optional, for UX)
  const now = new Date();
  const filteredChallenges = challenges.filter((c: any) => {
    if (!c.end_date) return true;
    return new Date(c.end_date) >= now;
  });

  // Poll creation logic
  const handleAddPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, { text: '' }] });
  };
  const handleRemovePollOption = (idx: number) => {
    if (newPoll.options.length <= 2) return;
    setNewPoll({ ...newPoll, options: newPoll.options.filter((_, i) => i !== idx) });
  };
  const handlePollOptionChange = (idx: number, value: string) => {
    const options = [...newPoll.options];
    options[idx].text = value;
    setNewPoll({ ...newPoll, options });
  };
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setPollCreateError('');
    try {
      await apiClient.post('/games/polls/', {
        group: selectedGroup.group_id,
        question: newPoll.question,
        allow_multiple: newPoll.allow_multiple,
        options: newPoll.options.filter(opt => opt.text.trim() !== '')
      });
      setShowCreatePoll(false);
      setNewPoll({ question: '', options: [{ text: '' }, { text: '' }], allow_multiple: false });
      fetchPolls();
    } catch (err: any) {
      if (err.response && err.response.data) {
        setPollCreateError(
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
        );
      } else {
        setPollCreateError('Failed to create poll.');
      }
    }
  };

  // Poll voting logic
  const handleVote = async (poll: any, selectedOptionIds: number[]) => {
    setPollVoteLoading(true);
    setPollVoteError('');
    try {
      await apiClient.post(`/games/polls/${poll.id}/vote/`, { option_ids: selectedOptionIds });
      fetchPolls();
    } catch (err: any) {
      setPollVoteError('Failed to vote.');
    } finally {
      setPollVoteLoading(false);
    }
  };

  // Social Icebreakers handlers
  const handleCreateTwoTruthsLie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newTwoTruthsLie.statement1.trim() || !newTwoTruthsLie.statement2.trim() || !newTwoTruthsLie.statement3.trim()) {
      alert('Please fill in all three statements');
      return;
    }
    
    const requestData = {
      statement1: newTwoTruthsLie.statement1.trim(),
      statement2: newTwoTruthsLie.statement2.trim(),
      statement3: newTwoTruthsLie.statement3.trim(),
      lie_statement: parseInt(newTwoTruthsLie.lie_statement.toString()),
      group: selectedGroup.group_id
    };
    try {
      await apiClient.post('/games/two-truths-lie/', requestData);
      setNewTwoTruthsLie({
        statement1: '',
        statement2: '',
        statement3: '',
        lie_statement: 1
      });
      setShowCreateTwoTruthsLie(false);
      fetchSocialIcebreakers();
    } catch (err: any) {
      console.error('Failed to create Two Truths and Lie game:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create game: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create game. Please try again.');
      }
    }
  };

  const handleCreateWouldYouRather = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newWouldYouRather.question.trim() || !newWouldYouRather.option_a.trim() || !newWouldYouRather.option_b.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const requestData = {
      question: newWouldYouRather.question.trim(),
      option_a: newWouldYouRather.option_a.trim(),
      option_b: newWouldYouRather.option_b.trim(),
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/would-you-rather/', requestData);
      setNewWouldYouRather({
        question: '',
        option_a: '',
        option_b: ''
      });
      setShowCreateWouldYouRather(false);
      fetchSocialIcebreakers();
    } catch (err: any) {
      console.error('Failed to create Would You Rather poll:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create poll: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create poll. Please try again.');
      }
    }
  };

  const handleCreateThisOrThat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newThisOrThat.question.trim() || !newThisOrThat.option_a.trim() || !newThisOrThat.option_b.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const requestData = {
      question: newThisOrThat.question.trim(),
      option_a: newThisOrThat.option_a.trim(),
      option_b: newThisOrThat.option_b.trim(),
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/this-or-that/', requestData);
      setNewThisOrThat({
        question: '',
        option_a: '',
        option_b: ''
      });
      setShowCreateThisOrThat(false);
      fetchSocialIcebreakers();
    } catch (err: any) {
      console.error('Failed to create This or That poll:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create poll: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create poll. Please try again.');
      }
    }
  };

  const handleCreateFillInBlank = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newFillInBlank.template.trim()) {
      alert('Please enter a template');
      return;
    }
    
    if (!newFillInBlank.template.includes('{blank}')) {
      alert('Please include {blank} in your template to indicate where the blank should be');
      return;
    }
    
    const requestData = {
      template: newFillInBlank.template.trim(),
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/fill-in-blank/', requestData);
      setNewFillInBlank({
        template: ''
      });
      setShowCreateFillInBlank(false);
      fetchSocialIcebreakers();
    } catch (err: any) {
      console.error('Failed to create Fill in the Blank game:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create game: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create game. Please try again.');
      }
    }
  };

  const handleCreateSpotDifference = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newSpotDifference.title.trim() || !newSpotDifference.original_image.trim() || !newSpotDifference.modified_image.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const requestData = {
      ...newSpotDifference,
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/spot-difference/', requestData);
      setNewSpotDifference({
        title: '',
        description: '',
        original_image: '',
        modified_image: '',
        difficulty: 'medium',
        differences_count: 5,
        time_limit: 60,
        points_reward: 10
      });
      setShowCreateSpotDifference(false);
      fetchEngagementGames();
    } catch (err: any) {
      console.error('Failed to create Spot the Difference game:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create game: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create game. Please try again.');
      }
    }
  };

  const handleCreateGuessWho = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newGuessWho.title.trim() || !newGuessWho.mystery_image.trim() || !newGuessWho.correct_answer.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const requestData = {
      ...newGuessWho,
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/guess-who/', requestData);
      setNewGuessWho({
        title: '',
        description: '',
        mystery_image: '',
        correct_answer: '',
        hints: ['', '', ''],
        time_limit: 120,
        points_reward: 15
      });
      setShowCreateGuessWho(false);
      fetchEngagementGames();
    } catch (err: any) {
      console.error('Failed to create Guess Who game:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create game: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create game. Please try again.');
      }
    }
  };

  const handleCreateReactionRace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!newReactionRace.title.trim() || !newReactionRace.target_post_id.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const requestData = {
      ...newReactionRace,
      group: selectedGroup.group_id
    };
    
    try {
      await apiClient.post('/games/reaction-race/', requestData);
      setNewReactionRace({
        title: '',
        description: '',
        target_post_id: '',
        duration: 300,
        points_reward: 20
      });
      setShowCreateReactionRace(false);
      fetchEngagementGames();
    } catch (err: any) {
      console.error('Failed to create Reaction Race game:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
        alert('Failed to create game: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to create game. Please try again.');
      }
    }
  };

  if (!selectedGroup) {
    return (
      <Card sx={{ 
        background: 'rgba(26, 26, 58, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ 
          fontFamily: 'Orbitron, monospace',
          color: '#00ff88',
          fontWeight: 700
        }}>
          🎯 Please select a group to view quantum games
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {/* Quantum Header */}
      <Card sx={{ 
        mb: 4, 
        background: 'rgba(26, 26, 58, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEventsIcon sx={{ mr: 2, fontSize: 32, color: '#00ff88' }} />
            <Typography variant="h4" sx={{ 
              fontFamily: 'Orbitron, monospace',
              fontWeight: 700,
              color: '#ffffff'
            }}>
              Quantum Games & Challenges
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ 
            opacity: 0.9,
            color: '#c0c0c0',
            fontFamily: 'Orbitron, monospace'
          }}>
            Level up your group engagement with quantum mechanics! 🚀
          </Typography>
        </CardContent>
      </Card>

      {/* Quantum User Stats Card */}
      {userStats && (
        <Card sx={{ 
          mb: 3, 
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <StarIcon sx={{ mr: 1, fontSize: 28, color: '#00ff88' }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'Orbitron, monospace'
              }}>
                Your Quantum Stats
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#00ff88' }}>{userStats.total_points}</Typography>
                <Typography variant="body2" sx={{ color: '#c0c0c0' }}>Points</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#00ff88' }}>{userStats.total_posts}</Typography>
                <Typography variant="body2" sx={{ color: '#c0c0c0' }}>Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#00ff88' }}>{userStats.challenges_completed}</Typography>
                <Typography variant="body2" sx={{ color: '#c0c0c0' }}>Challenges</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#00ff88' }}>{userStats.rank || 'N/A'}</Typography>
                <Typography variant="body2" sx={{ color: '#c0c0c0' }}>Rank</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quantum Tabs */}
      <Card sx={{ 
        mb: 3, 
        background: 'rgba(26, 26, 58, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                minHeight: { xs: 48, sm: 64 },
                minWidth: { xs: 80, sm: 120 },
                color: '#c0c0c0',
                fontFamily: 'Orbitron, monospace',
                '&.Mui-selected': {
                  color: '#00ff88'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00ff88'
              }
            }}
          >
            <Tab 
              icon={<EmojiEventsIcon />} 
              label="Challenges" 
              iconPosition="start"
            />
            <Tab 
              icon={<TrendingUpIcon />} 
              label="Streaks" 
              iconPosition="start"
            />
            <Tab 
              icon={<LeaderboardIcon />} 
              label="Leaderboard" 
              iconPosition="start"
            />
            <Tab icon={<PollIcon />} label="Polls" iconPosition="start" />
            <Tab icon={<MemoryIcon />} label="Photo Memory" iconPosition="start" />
            <Tab icon={<LinkIcon />} label="Word Association" iconPosition="start" />
            <Tab icon={<PsychologyIcon />} label="Two Truths & Lie" iconPosition="start" />
            <Tab icon={<QuestionAnswerIcon />} label="Would You Rather" iconPosition="start" />
            <Tab icon={<CompareArrowsIcon />} label="This or That" iconPosition="start" />
            <Tab icon={<CreateIcon />} label="Fill in Blank" iconPosition="start" />
            <Tab icon={<VisibilityIcon />} label="Spot Difference" iconPosition="start" />
            <Tab icon={<PersonIcon />} label="Guess Who" iconPosition="start" />
            <Tab icon={<CloudIcon />} label="Word Cloud" iconPosition="start" />
            <Tab icon={<SpeedIcon />} label="Reaction Race" iconPosition="start" />
            <Tab icon={<CakeIcon />} label="Birthdays" iconPosition="start" />
            <Tab icon={<CelebrationIcon />} label="Anniversaries" iconPosition="start" />
            <Tab icon={<FavoriteIcon />} label="Holiday Games" iconPosition="start" />
            <Tab icon={<VolunteerActivismIcon />} label="Kindness" iconPosition="start" />
          </Tabs>
          <Box sx={{ textAlign: 'center', py: 1, color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
            ← Scroll to see all game types & events →
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {/* Challenges Tab */}
          {activeTab === 0 && (
            <Box>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} gap={1}>
                <Typography variant="h6" fontWeight="bold">Active Challenges</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateChallenge(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                    color: '#0a0a1a',
                    fontWeight: 600,
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    borderRadius: 2,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(0, 255, 136, 0.4)'
                    }
                  }}
                >
                  Create Quantum Challenge
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredChallenges.length === 0 ? (
                <Card sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  background: 'rgba(26, 26, 58, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: 2
                }}>
                  <EmojiEventsIcon sx={{ fontSize: 48, color: '#00ff88', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Orbitron, monospace' }} gutterBottom>
                    No quantum challenges yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#c0c0c0' }}>
                    Create the first challenge to get your group engaged!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredChallenges.map((challenge) => (
                    <Card key={challenge.id} sx={{ 
                      borderRadius: 2,
                      border: challenge.is_current ? '2px solid #00ff88' : '1px solid rgba(0, 255, 136, 0.3)',
                      background: challenge.is_current ? 'rgba(0, 255, 136, 0.1)' : 'rgba(26, 26, 58, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {challenge.title}
                              {challenge.is_current && (
                                <Chip 
                                  label="Active" 
                                  size="small" 
                                  color="success" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {challenge.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Chip 
                                label={challenge.challenge_type} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={challenge.category} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`${challenge.points_reward} pts`} 
                                size="small" 
                                color="primary"
                              />
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              {challenge.days_remaining > 0 ? `${challenge.days_remaining} days left` : 'Expired'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {challenge.progress_count} completed
                            </Typography>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteChallenge(challenge)}
                              sx={{ mt: 1 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                        {/* Progress Bar */}
                        <Box sx={{ mt: 2 }}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {challenge.completion_rate}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={challenge.completion_rate} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Streaks Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={3}>Your Streaks</Typography>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : streaks.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No streaks yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start posting, commenting, and reacting to build your streaks!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {streaks.map((streak) => (
                    <Card key={streak.id} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {streak.streak_type.charAt(0).toUpperCase() + streak.streak_type.slice(1)} Streak
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Current: {streak.current_streak} days
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Longest: {streak.longest_streak} days
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="primary">
                              {streak.current_streak}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              days
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Group Leaderboard</Typography>
                <Button
                  variant="outlined"
                  onClick={calculateLeaderboard}
                  sx={{ borderRadius: 2 }}
                >
                  Refresh
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : leaderboard.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <LeaderboardIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No leaderboard data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start engaging with your group to see rankings!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {leaderboard.map((entry, index) => (
                    <Card key={entry.id} sx={{ 
                      borderRadius: 2,
                      border: index === 0 ? '2px solid #ffd700' : 
                              index === 1 ? '2px solid #c0c0c0' : 
                              index === 2 ? '2px solid #cd7f32' : '1px solid #e0e0e0'
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: index === 0 ? '#ffd700' : 
                                       index === 1 ? '#c0c0c0' : 
                                       index === 2 ? '#cd7f32' : '#e0e0e0',
                            color: index < 3 ? 'white' : 'text.primary',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {entry.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {entry.points} points
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              {entry.posts_count} posts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {entry.events_count} events
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Polls Tab */}
          {activeTab === 3 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Group Polls</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreatePoll(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Poll
                </Button>
              </Box>
              {polls.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <PollIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No polls yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first poll to get your group engaged!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {polls.map((poll) => (
                    <Card key={poll.id} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {poll.question}
                          </Typography>
                        </Box>
                        {/* Voting UI */}
                        {!poll.has_voted && poll.is_active ? (
                          <Box>
                            <PollVotingUI poll={poll} onVote={handleVote} loading={pollVoteLoading} error={pollVoteError} />
                          </Box>
                        ) : (
                          <Box>
                            <PollResultsUI poll={poll} />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
              {/* Create Poll Dialog */}
              <Dialog open={showCreatePoll} onClose={() => setShowCreatePoll(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  <Typography variant="h6" fontWeight="bold">Create New Poll</Typography>
                </DialogTitle>
                <form onSubmit={handleCreatePoll}>
                  <DialogContent>
                    <TextField
                      fullWidth
                      label="Poll Question"
                      value={newPoll.question}
                      onChange={e => setNewPoll({ ...newPoll, question: e.target.value })}
                      margin="normal"
                      required
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      {newPoll.options.map((opt, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            fullWidth
                            label={`Option ${idx + 1}`}
                            value={opt.text}
                            onChange={e => handlePollOptionChange(idx, e.target.value)}
                            required
                          />
                          {newPoll.options.length > 2 && (
                            <Button onClick={() => handleRemovePollOption(idx)} color="error" size="small">Remove</Button>
                          )}
                        </Box>
                      ))}
                      <Button onClick={handleAddPollOption} startIcon={<AddIcon />} size="small">Add Option</Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <TextField
                        select
                        fullWidth
                        label="Allow Multiple Selection"
                        value={newPoll.allow_multiple ? 'yes' : 'no'}
                        onChange={e => setNewPoll({ ...newPoll, allow_multiple: e.target.value === 'yes' })}
                        margin="normal"
                        required
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </TextField>
                    </Box>
                    {pollCreateError && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {pollCreateError}
                      </Typography>
                    )}
                  </DialogContent>
                  <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setShowCreatePoll(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}>Create Poll</Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Box>
          )}

          {activeTab === 4 && (
            <PhotoMemoryGame groupId={selectedGroup.group_id} />
          )}

          {activeTab === 5 && (
            <WordAssociationGame groupId={selectedGroup.group_id} />
          )}

          {/* Two Truths and Lie Tab */}
          {activeTab === 6 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Two Truths and a Lie</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateTwoTruthsLie(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Game
                </Button>
              </Box>
              
              {twoTruthsLieGames.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <PsychologyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No games yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Two Truths and a Lie game!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {twoTruthsLieGames.map((game) => (
                    <TwoTruthsLieGame key={game.id} game={game} onRefresh={fetchSocialIcebreakers} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Would You Rather Tab */}
          {activeTab === 7 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Would You Rather</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateWouldYouRather(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Poll
                </Button>
              </Box>
              
              {wouldYouRatherPolls.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <QuestionAnswerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No polls yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Would You Rather poll!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {wouldYouRatherPolls.map((poll) => (
                    <WouldYouRatherPoll key={poll.id} poll={poll} onRefresh={fetchSocialIcebreakers} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* This or That Tab */}
          {activeTab === 8 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">This or That</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateThisOrThat(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Poll
                </Button>
              </Box>
              
              {thisOrThatPolls.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <CompareArrowsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No polls yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first This or That poll!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {thisOrThatPolls.map((poll) => (
                    <ThisOrThatPoll key={poll.id} poll={poll} onRefresh={fetchSocialIcebreakers} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Fill in the Blank Tab */}
          {activeTab === 9 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Fill in the Blank</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateFillInBlank(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Game
                </Button>
              </Box>
              
              {fillInBlankGames.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <CreateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No games yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Fill in the Blank game!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {fillInBlankGames.map((game) => (
                    <FillInBlankGame key={game.id} game={game} onRefresh={fetchSocialIcebreakers} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Spot the Difference Tab */}
          {activeTab === 10 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Spot the Difference</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateSpotDifference(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Game
                </Button>
              </Box>
              
              {spotDifferenceGames.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <VisibilityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No games yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Spot the Difference game!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {spotDifferenceGames.map((game) => (
                    <SpotDifferenceGame key={game.id} game={game} onRefresh={fetchEngagementGames} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Guess Who Tab */}
          {activeTab === 11 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Guess Who</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateGuessWho(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Game
                </Button>
              </Box>
              
              {guessWhoGames.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No games yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Guess Who game!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {guessWhoGames.map((game) => (
                    <GuessWhoGame key={game.id} game={game} onRefresh={fetchEngagementGames} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Word Cloud Tab */}
          {activeTab === 12 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Word Cloud</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    select
                    size="small"
                    label="Period"
                    value={wordCloudPeriod}
                    onChange={(e) => {
                      setWordCloudPeriod(e.target.value);
                      fetchWordCloud(e.target.value);
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    onClick={() => fetchWordCloud(wordCloudPeriod)}
                    disabled={wordCloudLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>
              
              {wordCloudLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Generating word cloud...
                  </Typography>
                </Box>
              ) : wordCloudData ? (
                <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Most Used Words ({wordCloudPeriod})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Based on {wordCloudData.total_posts} posts from your group
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      p: 2, 
                      backgroundColor: 'rgba(0,0,0,0.02)', 
                      borderRadius: 2,
                      minHeight: 200,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {wordCloudData.word_data && Object.entries(wordCloudData.word_data).map(([word, count]: [string, any]) => (
                        <Chip
                          key={word}
                          label={`${word} (${count})`}
                          size="small"
                          sx={{
                            fontSize: Math.min(12 + (count * 2), 24),
                            fontWeight: 'bold',
                            backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
                            color: 'text.primary',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total words: {wordCloudData.total_words}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unique words: {wordCloudData.unique_words}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Period: {wordCloudPeriod}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <CloudIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No word data available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start posting in your group to generate a word cloud!
                  </Typography>
                </Card>
              )}
            </Box>
          )}

          {/* Reaction Race Tab */}
          {activeTab === 13 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Reaction Race</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateReactionRace(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Race
                </Button>
              </Box>
              
              {reactionRaceGames.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <SpeedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No races yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first Reaction Race!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reactionRaceGames.map((game) => (
                    <ReactionRaceGame key={game.id} game={game} onRefresh={fetchEngagementGames} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Birthday Celebrations Tab */}
          {activeTab === 14 && (
            <BirthdayCelebrations groupId={selectedGroup.group_id} />
          )}

          {/* Anniversary Celebrations Tab */}
          {activeTab === 15 && (
            <AnniversaryCelebrations groupId={selectedGroup.group_id} />
          )}

          {/* Holiday Games Tab */}
          {activeTab === 16 && (
            <HolidayGames groupId={selectedGroup.group_id} />
          )}

          {/* Random Acts of Kindness Tab */}
          {activeTab === 17 && (
            <RandomActsOfKindness groupId={selectedGroup.group_id} />
          )}
        </Box>
      </Card>

      {/* Create Challenge Dialog */}
      <Dialog 
        open={showCreateChallenge} 
        onClose={() => setShowCreateChallenge(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create New Challenge</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateChallenge}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <TextField
              fullWidth
              label="Challenge Title"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Challenge Type"
                value={newChallenge.challenge_type}
                onChange={(e) => setNewChallenge({...newChallenge, challenge_type: e.target.value})}
                margin="normal"
                required
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="special">Special Event</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Category"
                value={newChallenge.category}
                onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                margin="normal"
                required
              >
                <MenuItem value="post">Posting</MenuItem>
                <MenuItem value="event">Event Planning</MenuItem>
                <MenuItem value="interaction">Social Interaction</MenuItem>
                <MenuItem value="media">Media Sharing</MenuItem>
                <MenuItem value="engagement">Engagement</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Target Count"
                value={newChallenge.target_count}
                onChange={(e) => setNewChallenge({...newChallenge, target_count: parseInt(e.target.value)})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="number"
                label="Points Reward"
                value={newChallenge.points_reward}
                onChange={(e) => setNewChallenge({...newChallenge, points_reward: parseInt(e.target.value)})}
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date"
                value={newChallenge.start_date}
                onChange={(e) => setNewChallenge({...newChallenge, start_date: e.target.value})}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="End Date"
                value={newChallenge.end_date}
                onChange={(e) => setNewChallenge({...newChallenge, end_date: e.target.value})}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateChallenge(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Challenge
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Challenge Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={cancelDeleteChallenge}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Delete Challenge</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this challenge?</Typography>
          {challengeToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {challengeToDelete.title}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelDeleteChallenge} variant="outlined">Cancel</Button>
          <Button onClick={confirmDeleteChallenge} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create Two Truths and Lie Dialog */}
      <Dialog 
        open={showCreateTwoTruthsLie} 
        onClose={() => setShowCreateTwoTruthsLie(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Two Truths and a Lie</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateTwoTruthsLie}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Write three statements about yourself - two true and one false. Others will try to guess which one is the lie!
            </Typography>
            <TextField
              fullWidth
              label="Statement 1"
              value={newTwoTruthsLie.statement1}
              onChange={(e) => setNewTwoTruthsLie({...newTwoTruthsLie, statement1: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Statement 2"
              value={newTwoTruthsLie.statement2}
              onChange={(e) => setNewTwoTruthsLie({...newTwoTruthsLie, statement2: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Statement 3"
              value={newTwoTruthsLie.statement3}
              onChange={(e) => setNewTwoTruthsLie({...newTwoTruthsLie, statement3: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              select
              fullWidth
              label="Which statement is the lie?"
              value={newTwoTruthsLie.lie_statement}
              onChange={(e) => setNewTwoTruthsLie({...newTwoTruthsLie, lie_statement: parseInt(e.target.value)})}
              margin="normal"
              required
            >
              <MenuItem value={1}>Statement 1</MenuItem>
              <MenuItem value={2}>Statement 2</MenuItem>
              <MenuItem value={3}>Statement 3</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateTwoTruthsLie(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Would You Rather Dialog */}
      <Dialog 
        open={showCreateWouldYouRather} 
        onClose={() => setShowCreateWouldYouRather(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Would You Rather Poll</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateWouldYouRather}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <TextField
              fullWidth
              label="Question"
              value={newWouldYouRather.question}
              onChange={(e) => setNewWouldYouRather({...newWouldYouRather, question: e.target.value})}
              margin="normal"
              required
              placeholder="e.g., Would you rather..."
            />
            <TextField
              fullWidth
              label="Option A"
              value={newWouldYouRather.option_a}
              onChange={(e) => setNewWouldYouRather({...newWouldYouRather, option_a: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Option B"
              value={newWouldYouRather.option_b}
              onChange={(e) => setNewWouldYouRather({...newWouldYouRather, option_b: e.target.value})}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateWouldYouRather(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Poll
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create This or That Dialog */}
      <Dialog 
        open={showCreateThisOrThat} 
        onClose={() => setShowCreateThisOrThat(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create This or That Poll</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateThisOrThat}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <TextField
              fullWidth
              label="Question"
              value={newThisOrThat.question}
              onChange={(e) => setNewThisOrThat({...newThisOrThat, question: e.target.value})}
              margin="normal"
              required
              placeholder="e.g., This or that..."
            />
            <TextField
              fullWidth
              label="Option A"
              value={newThisOrThat.option_a}
              onChange={(e) => setNewThisOrThat({...newThisOrThat, option_a: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Option B"
              value={newThisOrThat.option_b}
              onChange={(e) => setNewThisOrThat({...newThisOrThat, option_b: e.target.value})}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateThisOrThat(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Poll
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Fill in the Blank Dialog */}
      <Dialog 
        open={showCreateFillInBlank} 
        onClose={() => setShowCreateFillInBlank(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Fill in the Blank</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateFillInBlank}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create a sentence with a blank that others will fill in. Use {"{blank}"} to indicate where the blank should be.
            </Typography>
            <TextField
              fullWidth
              label="Template"
              value={newFillInBlank.template}
              onChange={(e) => setNewFillInBlank({...newFillInBlank, template: e.target.value})}
              margin="normal"
              required
              placeholder="e.g., My favorite food is {blank}"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateFillInBlank(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Spot the Difference Dialog */}
      <Dialog 
        open={showCreateSpotDifference} 
        onClose={() => setShowCreateSpotDifference(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Spot the Difference Game</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateSpotDifference}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create a spot the difference game by providing two images - original and modified versions.
            </Typography>
            <TextField
              fullWidth
              label="Game Title"
              value={newSpotDifference.title}
              onChange={(e) => setNewSpotDifference({...newSpotDifference, title: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newSpotDifference.description}
              onChange={(e) => setNewSpotDifference({...newSpotDifference, description: e.target.value})}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Original Image URL"
              value={newSpotDifference.original_image}
              onChange={(e) => setNewSpotDifference({...newSpotDifference, original_image: e.target.value})}
              margin="normal"
              required
              placeholder="https://example.com/original.jpg"
            />
            <TextField
              fullWidth
              label="Modified Image URL"
              value={newSpotDifference.modified_image}
              onChange={(e) => setNewSpotDifference({...newSpotDifference, modified_image: e.target.value})}
              margin="normal"
              required
              placeholder="https://example.com/modified.jpg"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Difficulty"
                value={newSpotDifference.difficulty}
                onChange={(e) => setNewSpotDifference({...newSpotDifference, difficulty: e.target.value})}
                margin="normal"
                required
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </TextField>
              <TextField
                type="number"
                fullWidth
                label="Number of Differences"
                value={newSpotDifference.differences_count}
                onChange={(e) => setNewSpotDifference({...newSpotDifference, differences_count: parseInt(e.target.value) || 5})}
                margin="normal"
                required
                inputProps={{ min: 1, max: 20 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                type="number"
                fullWidth
                label="Time Limit (seconds)"
                value={newSpotDifference.time_limit}
                onChange={(e) => setNewSpotDifference({...newSpotDifference, time_limit: parseInt(e.target.value) || 60})}
                margin="normal"
                required
                inputProps={{ min: 30, max: 300 }}
              />
              <TextField
                type="number"
                fullWidth
                label="Points Reward"
                value={newSpotDifference.points_reward}
                onChange={(e) => setNewSpotDifference({...newSpotDifference, points_reward: parseInt(e.target.value) || 10})}
                margin="normal"
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateSpotDifference(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Guess Who Dialog */}
      <Dialog 
        open={showCreateGuessWho} 
        onClose={() => setShowCreateGuessWho(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Guess Who Game</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateGuessWho}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create a Guess Who game by uploading a mystery photo and providing hints for others to guess who it is.
            </Typography>
            <TextField
              fullWidth
              label="Game Title"
              value={newGuessWho.title}
              onChange={(e) => setNewGuessWho({...newGuessWho, title: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newGuessWho.description}
              onChange={(e) => setNewGuessWho({...newGuessWho, description: e.target.value})}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Mystery Image URL"
              value={newGuessWho.mystery_image}
              onChange={(e) => setNewGuessWho({...newGuessWho, mystery_image: e.target.value})}
              margin="normal"
              required
              placeholder="https://example.com/mystery.jpg"
            />
            <TextField
              fullWidth
              label="Correct Answer"
              value={newGuessWho.correct_answer}
              onChange={(e) => setNewGuessWho({...newGuessWho, correct_answer: e.target.value})}
              margin="normal"
              required
              placeholder="e.g., John Smith"
            />
            <Typography variant="subtitle2" fontWeight="bold" mt={2} mb={1}>Hints (optional):</Typography>
            {newGuessWho.hints.map((hint: string, index: number) => (
              <TextField
                key={index}
                fullWidth
                label={`Hint ${index + 1}`}
                value={hint}
                onChange={(e) => {
                  const newHints = [...newGuessWho.hints];
                  newHints[index] = e.target.value;
                  setNewGuessWho({...newGuessWho, hints: newHints});
                }}
                margin="normal"
                placeholder={`Hint ${index + 1} (optional)`}
              />
            ))}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                type="number"
                fullWidth
                label="Time Limit (seconds)"
                value={newGuessWho.time_limit}
                onChange={(e) => setNewGuessWho({...newGuessWho, time_limit: parseInt(e.target.value) || 120})}
                margin="normal"
                required
                inputProps={{ min: 30, max: 600 }}
              />
              <TextField
                type="number"
                fullWidth
                label="Points Reward"
                value={newGuessWho.points_reward}
                onChange={(e) => setNewGuessWho({...newGuessWho, points_reward: parseInt(e.target.value) || 15})}
                margin="normal"
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateGuessWho(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Reaction Race Dialog */}
      <Dialog 
        open={showCreateReactionRace} 
        onClose={() => setShowCreateReactionRace(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Reaction Race</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateReactionRace}>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create a reaction race where members compete to be the first to react to a specific post.
            </Typography>
            <TextField
              fullWidth
              label="Race Title"
              value={newReactionRace.title}
              onChange={(e) => setNewReactionRace({...newReactionRace, title: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newReactionRace.description}
              onChange={(e) => setNewReactionRace({...newReactionRace, description: e.target.value})}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Target Post ID"
              value={newReactionRace.target_post_id}
              onChange={(e) => setNewReactionRace({...newReactionRace, target_post_id: e.target.value})}
              margin="normal"
              required
              placeholder="Enter the post ID to react to"
              type="number"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                type="number"
                fullWidth
                label="Duration (seconds)"
                value={newReactionRace.duration}
                onChange={(e) => setNewReactionRace({...newReactionRace, duration: parseInt(e.target.value) || 300})}
                margin="normal"
                required
                inputProps={{ min: 60, max: 3600 }}
              />
              <TextField
                type="number"
                fullWidth
                label="Points Reward"
                value={newReactionRace.points_reward}
                onChange={(e) => setNewReactionRace({...newReactionRace, points_reward: parseInt(e.target.value) || 20})}
                margin="normal"
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button onClick={() => setShowCreateReactionRace(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}>
              Create Race
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

// Poll voting UI component
function PollVotingUI({ poll, onVote, loading, error }: { poll: any, onVote: (poll: any, selectedOptionIds: number[]) => void, loading: boolean, error: string }) {
  const [selected, setSelected] = React.useState<number[]>([]);
  const handleSelect = (optionId: number) => {
    if (poll.allow_multiple) {
      setSelected(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
    } else {
      setSelected([optionId]);
    }
  };
  return (
    <Box>
      {poll.options.map((opt: any) => (
        <Box key={opt.id} display="flex" alignItems="center" mb={1}>
          <Checkbox
            checked={selected.includes(opt.id)}
            onChange={() => handleSelect(opt.id)}
            disabled={loading || !poll.is_active}
            inputProps={{ 'aria-label': opt.text }}
            sx={{ mr: 1 }}
            {...(!poll.allow_multiple ? { icon: <RadioButtonUncheckedIcon />, checkedIcon: <RadioButtonCheckedIcon /> } : {})}
          />
          <Typography>{opt.text}</Typography>
        </Box>
      ))}
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button
        variant="contained"
        disabled={loading || selected.length === 0}
        onClick={() => onVote(poll, selected)}
        sx={{ mt: 1, borderRadius: 2 }}
      >
        {loading ? 'Submitting...' : 'Vote'}
      </Button>
    </Box>
  );
}

// Poll results UI component
function PollResultsUI({ poll }: { poll: any }) {
  const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + (opt.votes_count || 0), 0);
  return (
    <Box>
      {poll.options.map((opt: any) => {
        const percent = totalVotes ? (opt.votes_count / totalVotes) * 100 : 0;
        return (
          <Box key={opt.id} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>{opt.text}</Typography>
              <Typography variant="body2" color="text.secondary">{opt.votes_count} vote{opt.votes_count !== 1 ? 's' : ''} ({percent.toFixed(0)}%)</Typography>
            </Box>
            <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 5, mt: 0.5 }} />
          </Box>
        );
      })}
      <Typography variant="body2" color="text.secondary" mt={1}>
        Total votes: {totalVotes}
      </Typography>
    </Box>
  );
}

function PhotoMemoryGame({ groupId }: { groupId: number }) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch cards and reset state
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    apiClient.get(`/games/photo-memory/?group=${groupId}`)
      .then((res: any) => {
        setCards(res.data.cards.map((card: any, idx: number) => ({ ...card, idx })));
        setFlipped([]);
        setMatched([]);
        setError('');
        setTimer(60);
        setGameOver(false);
        setShowTimeout(false);
        setScore(0);
      })
      .catch(() => setError('Failed to load cards.'))
      .finally(() => setLoading(false));
  }, [groupId, resetKey]);

  // Timer logic
  useEffect(() => {
    if (loading || gameOver || error || !cards.length) return;
    if (timer === 0) {
      setShowTimeout(true);
      setTimeout(() => {
        setResetKey(k => k + 1);
      }, 2000);
      return;
    }
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, loading, gameOver, error, cards.length]);

  // Flip/match logic
  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx) || gameOver) return;
    setFlipped(prev => [...prev, idx]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].media === cards[second].media && first !== second) {
        setTimeout(() => {
          setMatched(prev => [...prev, first, second]);
          setScore(prev => prev + 10);
          setFlipped([]);
        }, 800);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length && matched.length === cards.length) {
      setGameOver(true);
    }
  }, [matched, cards]);

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!cards.length) return <Typography>No images available for this group.</Typography>;

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>Photo Memory Game</Typography>
      <Box mb={2} display="flex" alignItems="center" gap={4}>
        <Box display="flex" alignItems="center" gap={1}>
          <MemoryIcon color="primary" />
          <Typography variant="body1" fontWeight="bold">Time Left: {timer}s</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiEventsIcon color="secondary" />
          <Typography variant="body1" fontWeight="bold">Score: {score}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 80px)', gap: 2, justifyContent: 'center' }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <Box
              key={idx}
              sx={{ width: 80, height: 80, borderRadius: 2, boxShadow: 2, bgcolor: isFlipped ? 'white' : 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isFlipped ? 'default' : 'pointer', overflow: 'hidden', border: isFlipped ? '2px solid #4caf50' : '1px solid #e0e0e0' }}
              onClick={() => handleFlip(idx)}
            >
              {isFlipped ? (
                <img src={card.media} alt="memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <MemoryIcon sx={{ fontSize: 40, color: 'grey.500' }} />
              )}
            </Box>
          );
        })}
      </Box>
      {matched.length === cards.length && (
        <Typography mt={3} color="success.main" fontWeight="bold">🎉 You matched all pairs! Final Score: {score}</Typography>
      )}
      {showTimeout && (
        <Typography mt={3} color="error" fontWeight="bold">⏰ Time's up! The game will reset.</Typography>
      )}
    </Box>
  );
}

function WordAssociationGame({ groupId }: { groupId: number }) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [chain, setChain] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

    useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    setError('');
    setInput('');
    setChain([]);
    setScore(0);
    setGameOver(false);
    setWrongAnswer('');
    setCorrectAnswer('');

    apiClient.get(`/games/word-association/?group=${groupId}`)
      .then(response => {
        const data = response.data;
        if (data.words && data.words.length > 0) {
          setWords(data.words);
          setCurrentWord(data.words[0]);
          // Initialize chain with the starting word
          setChain([data.words[0]]);
        } else {
          setError('Not enough words in group posts to play.');
        }
      })
      .catch((error) => {
        console.error('Word Association API error:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('Failed to load words.');
        }
      })
      .finally(() => setLoading(false));
  }, [groupId, resetKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const guess = input.trim().toLowerCase();
    
    if (words.includes(guess) && !chain.includes(guess) && guess !== currentWord) {
      // Correct answer
      setChain(prev => [...prev, guess]);
      setCurrentWord(guess);
      setInput('');
      setScore(prev => prev + 1);
      
      // Check if all words have been used
      if (chain.length + 1 >= words.length) {
        setGameOver(true);
        setCorrectAnswer('Congratulations! You used all the words!');
      }
    } else {
      // Wrong answer
      setWrongAnswer(guess);
      setCorrectAnswer(words.find(w => w !== currentWord && !chain.includes(w)) || 'No more words available');
      setGameOver(true);
    }
  };

  const handleReset = () => setResetKey(k => k + 1);

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!words.length) return <Typography>No words available for this group.</Typography>;

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>Word Association Game</Typography>
      <Box mb={2} display="flex" alignItems="center" gap={4}>
        <Box display="flex" alignItems="center" gap={1}>
          <LinkIcon color="primary" />
          <Typography variant="body1" fontWeight="bold">Score: {score}</Typography>
        </Box>
      </Box>
      <Box mb={2}>
        <Typography variant="body1">Current Word: <b>{currentWord}</b></Typography>
      </Box>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          label="Next Associated Word"
          disabled={gameOver}
          autoFocus
        />
        <Button type="submit" variant="contained" disabled={gameOver}>Submit</Button>
      </form>
      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          <strong>Chain:</strong> {chain.join(' → ')}
        </Typography>
      </Box>
      {gameOver && (
        <Box mt={3}>
          <Typography color="error" fontWeight="bold" gutterBottom>
            Game Over! Final Score: {score}
          </Typography>
          {wrongAnswer && (
            <Typography color="error" variant="body2" gutterBottom>
              Your answer: <strong>"{wrongAnswer}"</strong>
            </Typography>
          )}
          {correctAnswer && (
            <Typography color="success.main" variant="body2" gutterBottom>
              {correctAnswer.startsWith('Congratulations') ? 
                correctAnswer : 
                `A correct answer would have been: <strong>"${correctAnswer}"</strong>`
              }
            </Typography>
          )}
          <Button onClick={handleReset} variant="outlined" sx={{ mt: 2 }}>Restart</Button>
        </Box>
      )}
    </Box>
  );
}

// Social Icebreaker Components
function TwoTruthsLieGame({ game, onRefresh }: { game: any, onRefresh: () => void }) {
  const [guessedLie, setGuessedLie] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuess = async (statementNumber: number) => {
    if (game.has_guessed) return;
    setLoading(true);
    try {
      await apiClient.post(`/games/two-truths-lie/${game.id}/guess/`, {
        guessed_lie: statementNumber
      });
      setGuessedLie(statementNumber);
      setShowResult(true);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to submit guess:', err);
    } finally {
      setLoading(false);
    }
  };

  const statements = [
    { number: 1, text: game.statement1 },
    { number: 2, text: game.statement2 },
    { number: 3, text: game.statement3 }
  ];

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {game.user_username}'s Two Truths and a Lie
          </Typography>
          <Chip 
            label={`${game.guess_count} guesses`} 
            size="small" 
            color="primary"
          />
        </Box>
        
        {!game.has_guessed && !showResult ? (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Guess which statement is the lie:
            </Typography>
            {statements.map((statement) => (
              <Button
                key={statement.number}
                variant="outlined"
                fullWidth
                onClick={() => handleGuess(statement.number)}
                disabled={loading}
                sx={{ mb: 1, justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Typography variant="body1">
                  {statement.number}. {statement.text}
                </Typography>
              </Button>
            ))}
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" color={showResult && guessedLie === game.lie_statement ? "success.main" : "error"} mb={2}>
              {showResult && guessedLie === game.lie_statement ? "✅ Correct!" : "❌ Wrong!"}
            </Typography>
            {statements.map((statement) => (
              <Box
                key={statement.number}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  backgroundColor: statement.number === game.lie_statement ? 'error.light' : 'success.light',
                  color: statement.number === game.lie_statement ? 'error.contrastText' : 'success.contrastText'
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {statement.number}. {statement.text}
                </Typography>
                <Typography variant="body2">
                  {statement.number === game.lie_statement ? "❌ This was the LIE" : "✅ This was TRUE"}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function WouldYouRatherPoll({ poll, onRefresh }: { poll: any, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleVote = async (choice: 'A' | 'B') => {
    if (poll.has_voted) return;
    setLoading(true);
    try {
      await apiClient.post(`/games/would-you-rather/${poll.id}/vote/`, {
        choice: choice
      });
      onRefresh();
    } catch (err: any) {
      console.error('Failed to vote:', err);
      if (err.response?.data) {
        alert('Failed to vote: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to vote. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercent = totalVotes ? (poll.option_a_votes / totalVotes) * 100 : 0;
  const optionBPercent = totalVotes ? (poll.option_b_votes / totalVotes) * 100 : 0;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {poll.question}
          </Typography>
          <Chip 
            label={`${totalVotes} votes`} 
            size="small" 
            color="primary"
          />
        </Box>
        
        {!poll.has_voted ? (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Choose your preference:
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleVote('A')}
                disabled={loading}
                sx={{ py: 2 }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {poll.option_a}
                </Typography>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleVote('B')}
                disabled={loading}
                sx={{ py: 2 }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {poll.option_b}
                </Typography>
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Results:
            </Typography>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body1">{poll.option_a}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.option_a_votes} votes ({optionAPercent.toFixed(0)}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={optionAPercent} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body1">{poll.option_b}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.option_b_votes} votes ({optionBPercent.toFixed(0)}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={optionBPercent} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            {poll.user_choice && (
              <Typography variant="body2" color="primary" fontWeight="bold">
                You chose: {poll.user_choice === 'A' ? poll.option_a : poll.option_b}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ThisOrThatPoll({ poll, onRefresh }: { poll: any, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleVote = async (choice: 'A' | 'B') => {
    if (poll.has_voted) return;
    setLoading(true);
    try {
      await apiClient.post(`/games/this-or-that/${poll.id}/vote/`, {
        choice: choice
      });
      onRefresh();
    } catch (err: any) {
      console.error('Failed to vote:', err);
      if (err.response?.data) {
        alert('Failed to vote: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to vote. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercent = totalVotes ? (poll.option_a_votes / totalVotes) * 100 : 0;
  const optionBPercent = totalVotes ? (poll.option_b_votes / totalVotes) * 100 : 0;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {poll.question}
          </Typography>
          <Chip 
            label={`${totalVotes} votes`} 
            size="small" 
            color="primary"
          />
        </Box>
        
        {!poll.has_voted ? (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Choose your preference:
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleVote('A')}
                disabled={loading}
                sx={{ py: 2 }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {poll.option_a}
                </Typography>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleVote('B')}
                disabled={loading}
                sx={{ py: 2 }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {poll.option_b}
                </Typography>
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Results:
            </Typography>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body1">{poll.option_a}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.option_a_votes} votes ({optionAPercent.toFixed(0)}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={optionAPercent} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body1">{poll.option_b}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.option_b_votes} votes ({optionBPercent.toFixed(0)}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={optionBPercent} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            {poll.user_choice && (
              <Typography variant="body2" color="primary" fontWeight="bold">
                You chose: {poll.user_choice === 'A' ? poll.option_a : poll.option_b}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function FillInBlankGame({ game, onRefresh }: { game: any, onRefresh: () => void }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [showResponses, setShowResponses] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    setLoading(true);
    try {
      await apiClient.post(`/games/fill-in-blank/${game.id}/submit/`, {
        filled_text: response.trim()
      });
      setResponse('');
      onRefresh();
    } catch (err: any) {
      console.error('Failed to submit response:', err);
      if (err.response?.data) {
        alert('Failed to submit response: ' + JSON.stringify(err.response.data));
      } else {
        alert('Failed to submit response. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponses = async () => {
    try {
      const res = await apiClient.get(`/games/fill-in-blank/${game.id}/responses/`);
      setResponses(res.data);
      setShowResponses(true);
    } catch (err: any) {
      console.error('Failed to fetch responses:', err);
    }
  };

  const displayText = game.template.replace('{blank}', '_____');

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Fill in the Blank
          </Typography>
          <Chip 
            label={`${game.response_count} responses`} 
            size="small" 
            color="primary"
          />
        </Box>
        
        <Typography variant="body1" mb={2}>
          {displayText}
        </Typography>
        
        {!game.has_responded ? (
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Your answer..."
                variant="outlined"
                size="small"
              />
              <Button type="submit" variant="contained" disabled={!response.trim() || loading} sx={{ borderRadius: 2 }}>
                Submit
              </Button>
            </Box>
          </form>
        ) : (
          <Box>
            <Typography variant="body2" color="success.main" fontWeight="bold" mb={2}>
              ✅ You responded: "{game.user_response}"
            </Typography>
            <Button variant="outlined" onClick={handleViewResponses} sx={{ borderRadius: 2 }}>
              View All Responses
            </Button>
          </Box>
        )}
        
        {showResponses && (
          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              All Responses:
            </Typography>
            {responses.map((resp, index) => (
              <Box key={resp.id} sx={{ p: 2, mb: 1, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {resp.user_username}:
                </Typography>
                <Typography variant="body1">
                  {resp.filled_text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function SpotDifferenceGame({ game, onRefresh }: { game: any, onRefresh: () => void }) {
  const [differencesFound, setDifferencesFound] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && timer < game.time_limit) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, timer, game.time_limit]);

  const handleStartGame = () => {
    setGameStarted(true);
    setShowGame(true);
    setTimer(0);
    setTimeTaken(0);
    setDifferencesFound(0);
  };

  const handleSubmitAttempt = async () => {
    if (differencesFound < 0 || differencesFound > game.differences_count) {
      alert('Please enter a valid number of differences found');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/games/spot-difference/${game.id}/attempt/`, {
        differences_found: differencesFound,
        time_taken: timeTaken
      });
      
      setGameCompleted(true);
      onRefresh();
      
      // Show results
      const result = response.data;
      alert(`Game completed!\nScore: ${result.score}\nDifferences found: ${differencesFound}/${game.differences_count}\nTime taken: ${timeTaken}s\nPoints earned: ${result.points_earned}`);
      
    } catch (err: any) {
      console.error('Failed to submit attempt:', err);
      alert('Failed to submit attempt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setShowGame(false);
    setTimer(0);
    setTimeTaken(0);
    setDifferencesFound(0);
  };

  return (
    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {game.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {game.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created by {game.created_by_username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={`${game.differences_count} differences`} size="small" variant="outlined" />
              <Chip label={`${game.time_limit}s limit`} size="small" variant="outlined" />
              <Chip label={`${game.points_reward} pts`} size="small" color="primary" />
              <Chip label={game.difficulty} size="small" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {game.attempt_count} attempts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg score: {game.average_score}
            </Typography>
          </Box>
        </Box>

        {!game.has_attempted && !showGame && (
          <Button
            variant="contained"
            onClick={handleStartGame}
            sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}
          >
            Start Game
          </Button>
        )}

        {showGame && !gameCompleted && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Time: {timer}s / {game.time_limit}s</Typography>
              <Typography variant="h6">Differences: {differencesFound} / {game.differences_count}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <img 
                src={game.original_image} 
                alt="Original" 
                style={{ width: '45%', height: 'auto', border: '2px solid #ccc' }}
              />
              <img 
                src={game.modified_image} 
                alt="Modified" 
                style={{ width: '45%', height: 'auto', border: '2px solid #ccc' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="number"
                label="Differences found"
                value={differencesFound}
                onChange={(e) => setDifferencesFound(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: game.differences_count }}
                sx={{ width: 150 }}
              />
              <Button
                variant="contained"
                onClick={handleSubmitAttempt}
                disabled={loading}
                sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        )}

        {game.has_attempted && !showGame && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You already attempted this game. Score: {game.user_attempt?.score || 0}
          </Alert>
        )}

        {gameCompleted && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Game completed! You can play again if you want.
            </Alert>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ borderRadius: 2 }}
            >
              Play Again
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function GuessWhoGame({ game, onRefresh }: { game: any, onRefresh: () => void }) {
  const [guess, setGuess] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && timer < game.time_limit) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, timer, game.time_limit]);

  const handleStartGame = () => {
    setGameStarted(true);
    setShowGame(true);
    setTimer(0);
    setTimeTaken(0);
    setGuess('');
  };

  const handleSubmitGuess = async () => {
    if (!guess.trim()) {
      alert('Please enter your guess');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/games/guess-who/${game.id}/attempt/`, {
        guess: guess.trim(),
        time_taken: timeTaken
      });
      
      setGameCompleted(true);
      onRefresh();
      
      // Show results
      const result = response.data;
      const isCorrect = result.is_correct;
      alert(`Game completed!\nYour guess: ${guess}\nCorrect answer: ${game.correct_answer}\nResult: ${isCorrect ? 'Correct!' : 'Incorrect'}\nScore: ${result.score}\nTime taken: ${timeTaken}s\nPoints earned: ${result.points_earned}`);
      
    } catch (err: any) {
      console.error('Failed to submit guess:', err);
      alert('Failed to submit guess. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setShowGame(false);
    setTimer(0);
    setTimeTaken(0);
    setGuess('');
    setShowHints(false);
  };

  return (
    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {game.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {game.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created by {game.created_by_username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={`${game.time_limit}s limit`} size="small" variant="outlined" />
              <Chip label={`${game.points_reward} pts`} size="small" color="primary" />
              <Chip label={`${game.hints.length} hints`} size="small" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {game.attempt_count} attempts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Success rate: {game.success_rate}%
            </Typography>
          </Box>
        </Box>

        {!game.has_attempted && !showGame && (
          <Button
            variant="contained"
            onClick={handleStartGame}
            sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}
          >
            Start Game
          </Button>
        )}

        {showGame && !gameCompleted && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Time: {timer}s / {game.time_limit}s</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowHints(!showHints)}
                sx={{ borderRadius: 2 }}
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img 
                src={game.mystery_image} 
                alt="Mystery Person" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  border: '2px solid #ccc',
                  borderRadius: '8px'
                }}
              />
            </Box>
            
            {showHints && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>Hints:</Typography>
                {game.hints.map((hint: string, index: number) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    {index + 1}. {hint}
                  </Typography>
                ))}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Who is this person?"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess..."
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleSubmitGuess}
                disabled={loading || !guess.trim()}
                sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit Guess'}
              </Button>
            </Box>
          </Box>
        )}

        {game.has_attempted && !showGame && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You already attempted this game. Your guess: "{game.user_attempt?.guess}" - {game.user_attempt?.is_correct ? 'Correct!' : 'Incorrect'}
          </Alert>
        )}

        {gameCompleted && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Game completed! You can play again if you want.
            </Alert>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ borderRadius: 2 }}
            >
              Play Again
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ReactionRaceGame({ game, onRefresh }: { game: any, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [timeJoined, setTimeJoined] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const handleJoinRace = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/games/reaction-race/${game.id}/join/`);
      setHasJoined(true);
      setTimeJoined(Date.now());
      onRefresh();
    } catch (err: any) {
      console.error('Failed to join race:', err);
      alert('Failed to join race. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (reactionType: string) => {
    if (!hasJoined) return;
    
    setLoading(true);
    try {
      const response = await apiClient.post(`/games/reaction-race/${game.id}/react/`, {
        reaction_type: reactionType,
        reaction_time: Date.now() - (timeJoined || 0)
      });
      
      setReactionTime(response.data.reaction_time);
      onRefresh();
      
      // Show results
      const result = response.data;
      alert(`Reaction submitted!\nReaction time: ${result.reaction_time}ms\nPosition: ${result.position}\nPoints earned: ${result.points_earned}`);
      
    } catch (err: any) {
      console.error('Failed to submit reaction:', err);
      alert('Failed to submit reaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaderboard = async () => {
    try {
      const response = await apiClient.get(`/games/reaction-race/${game.id}/leaderboard/`);
      setLeaderboard(response.data);
      setShowLeaderboard(true);
    } catch (err: any) {
      console.error('Failed to fetch leaderboard:', err);
      alert('Failed to fetch leaderboard.');
    }
  };

  const formatTime = (ms: number) => {
    return `${ms}ms`;
  };

  return (
    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {game.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {game.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created by {game.created_by_username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={`${game.duration}s duration`} size="small" variant="outlined" />
              <Chip label={`${game.points_reward} pts`} size="small" color="primary" />
              <Chip label={`${game.participant_count} participants`} size="small" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Target Post: #{game.target_post_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {game.is_active ? 'Active' : 'Ended'}
            </Typography>
          </Box>
        </Box>

        {!hasJoined && game.is_active && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Be the first to react to the target post! Join the race and get ready to react quickly.
            </Typography>
            <Button
              variant="contained"
              onClick={handleJoinRace}
              disabled={loading}
              sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}
            >
              {loading ? 'Joining...' : 'Join Race'}
            </Button>
          </Box>
        )}

        {hasJoined && game.is_active && !reactionTime && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              You're in the race! React to the target post as quickly as possible.
            </Alert>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Target Post: #{game.target_post_id}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => handleReact('like')}
                disabled={loading}
                sx={{ background: 'linear-gradient(45deg, #4caf50 0%, #45a049 100%)', borderRadius: 2 }}
              >
                👍 Like
              </Button>
              <Button
                variant="contained"
                onClick={() => handleReact('love')}
                disabled={loading}
                sx={{ background: 'linear-gradient(45deg, #f44336 0%, #d32f2f 100%)', borderRadius: 2 }}
              >
                ❤️ Love
              </Button>
              <Button
                variant="contained"
                onClick={() => handleReact('laugh')}
                disabled={loading}
                sx={{ background: 'linear-gradient(45deg, #ff9800 0%, #f57c00 100%)', borderRadius: 2 }}
              >
                😂 Laugh
              </Button>
              <Button
                variant="contained"
                onClick={() => handleReact('wow')}
                disabled={loading}
                sx={{ background: 'linear-gradient(45deg, #9c27b0 0%, #7b1fa2 100%)', borderRadius: 2 }}
              >
                😮 Wow
              </Button>
            </Box>
          </Box>
        )}

        {reactionTime && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Reaction submitted! Your time: {formatTime(reactionTime)}
          </Alert>
        )}

        {!game.is_active && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This race has ended. Check the leaderboard for results!
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleViewLeaderboard}
            sx={{ borderRadius: 2 }}
          >
            View Leaderboard
          </Button>
        </Box>

        {/* Leaderboard Dialog */}
        <Dialog open={showLeaderboard} onClose={() => setShowLeaderboard(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reaction Race Leaderboard</DialogTitle>
          <DialogContent>
            {leaderboard.length === 0 ? (
              <Typography color="text.secondary">No participants yet.</Typography>
            ) : (
              <List>
                {leaderboard.map((participant, index) => (
                  <ListItem key={participant.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="primary">
                            #{index + 1}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {participant.username}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Reaction: {participant.reaction_type} • Time: {formatTime(participant.reaction_time)}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            Points: {participant.points_earned}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowLeaderboard(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  const { setMemberships, setSelectedGroup } = useGroup();
  const { logout } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('memberships');
    localStorage.removeItem('selectedGroup');
    setMemberships([]);
    setSelectedGroup(null);
    logout(); // Update authentication state
    navigate('/');
  };
  return (
    <Button 
      color="inherit" 
      onClick={handleLogout} 
      sx={{ 
        ml: 2,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        px: 2,
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.2s',
        '&:hover': {
          background: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }
      }}
    >
      <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
      Logout
    </Button>
  );
}

function AuthGate() {
  const navigate = useNavigate();
  const location = window.location.pathname;
  
  useEffect(() => {
    const token = localStorage.getItem('access');
    console.log('AuthGate: Checking token:', token ? 'Token exists' : 'No token found');
    console.log('AuthGate: Current location:', location);
    
    // Allow access to public routes without token
    if (location === '/' || location === '/onboarding' || location === '/login' || location === '/change-credentials') {
      console.log('AuthGate: Allowing access to public routes');
      return;
    }
    
    if (!token) {
      console.log('AuthGate: No token, redirecting to home');
      navigate('/');
    } else {
      console.log('AuthGate: Token found, staying on current page');
    }
  }, [navigate, location]);
  return null;
}

function Documentation() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          onClick={handleOpen} 
          sx={{ 
            ml: 2,
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            color: '#00ff88',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            '&:hover': {
              background: 'rgba(0, 255, 136, 0.2)',
              borderColor: '#00ff88',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
            }
          }}
        >
          <HelpIcon sx={{ mr: 1, fontSize: 20 }} />
          Documentation
        </Button>
      </motion.div>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth 
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 58, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 255, 136, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)',
          color: '#00ff88',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
        }}>
          <CodeIcon sx={{ color: '#00ff88' }} />
          QUANTUM DOCUMENTATION - BONDED v1.4.0
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 1, sm: 3 },
          background: 'rgba(26, 26, 58, 0.3)',
          '& .MuiAccordion-root': {
            background: 'rgba(26, 26, 58, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
            borderRadius: 2,
            mb: 2,
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              borderColor: 'rgba(0, 255, 136, 0.3)',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)'
            }
          },
          '& .MuiAccordionSummary-root': {
            color: '#00ff88',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(0, 255, 136, 0.1)'
            }
          },
          '& .MuiAccordionDetails-root': {
            color: '#e0e0e0',
            background: 'rgba(0, 0, 0, 0.2)'
          }
        }}>
          <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    fontFamily: 'Orbitron, monospace',
                    color: '#00ff88'
                  }}>
                    🚀 QUANTUM OVERVIEW
                  </Typography>
                </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>
                  <strong>Bonded</strong> is a modern, group-based social platform for sharing memories, planning events, and playing interactive games. Each group is isolated, with unique usernames per group. The platform now features a suite of social games, exclusive Cloudinary media storage, and a streamlined login flow (no group selection after login).
                </Typography>
                <Typography variant="h6" gutterBottom>Key Features (v1.4.0):</Typography>
                <List dense>
                  <ListItem>• Group-based social networking with isolated data</ListItem>
                  <ListItem>• Multi-group membership support</ListItem>
                  <ListItem>• Post creation with text and media (Cloudinary only)</ListItem>
                  <ListItem>• Event planning (trips, goals, meetings)</ListItem>
                  <ListItem>• Real-time reactions and comments</ListItem>
                  <ListItem>• Social games: Photo Memory, Word Association, Polls, Two Truths and a Lie, Would You Rather, This or That, Fill in the Blank, Creative Challenges, Streaks, Leaderboards, Achievements</ListItem>
                  <ListItem>• JWT-based authentication with improved error handling</ListItem>
                  <ListItem>• Responsive Material-UI design with modern UI/UX (fixed footer, tabs, etc.)</ListItem>
                  <ListItem>• No group selection after login—auto-selects based on credentials</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            </motion.div>
            {/* Architecture */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  🏗️ QUANTUM ARCHITECTURE
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Backend Stack:</Typography>
                <List dense>
                  <ListItem>• <strong>Django 5.2.3</strong> - Web framework</ListItem>
                  <ListItem>• <strong>Django REST Framework 3.16.0</strong> - API framework</ListItem>
                  <ListItem>• <strong>PostgreSQL</strong> - Database</ListItem>
                  <ListItem>• <strong>Cloudinary</strong> - Media storage (all media is stored and loaded from Cloudinary)</ListItem>
                  <ListItem>• <strong>JWT Authentication</strong> - Security</ListItem>
                  <ListItem>• <strong>CORS</strong> - Cross-origin support</ListItem>
                </List>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Frontend Stack:</Typography>
                <List dense>
                  <ListItem>• <strong>React 19.1.0</strong> - UI library</ListItem>
                  <ListItem>• <strong>TypeScript 4.9.5</strong> - Type safety</ListItem>
                  <ListItem>• <strong>Material-UI 7.1.2</strong> - Component library</ListItem>
                  <ListItem>• <strong>React Router 7.6.2</strong> - Navigation</ListItem>
                  <ListItem>• <strong>Axios 1.10.0</strong> - HTTP client</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            {/* Database Models */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  <StorageIcon sx={{ mr: 1, color: '#00ff88' }} />
                  QUANTUM DATABASE
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Core Models:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>User</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Custom user model with email, password, and group memberships.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Group</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Represents social groups with name and member relationships.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>GroupMembership</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Links users to groups with username and role per group.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Post</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>User posts with text, group, and Cloudinary media.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Event</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Events with title, type, start_time, and group association.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Comment</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Comments on posts with text and user association.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Reaction</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>User reactions to posts (like, love, laugh, wow, sad, angry).</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Game & Challenge Models</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Photo Memory, Word Association, Poll, Two Truths and a Lie, Would You Rather, This or That, Fill in the Blank, Creative Challenges, Streaks, Leaderboards, Achievements, and related user/game state models.</Typography></CardContent></Card>
              </AccordionDetails>
            </Accordion>
            {/* API Endpoints */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  <ApiIcon sx={{ mr: 1, color: '#00ff88' }} />
                  QUANTUM API
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Authentication & Group Endpoints:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}><Table size="small"><TableHead><TableRow><TableCell><strong>Method</strong></TableCell><TableCell><strong>Endpoint</strong></TableCell><TableCell><strong>Description</strong></TableCell></TableRow></TableHead><TableBody>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/users/register-group/</TableCell><TableCell>Register a new group with members</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/users/group-login/</TableCell><TableCell>Login with group, username, password</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/users/change-credentials/</TableCell><TableCell>Change username and password</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/users/groups/{'{group_id}'}/members/</TableCell><TableCell>Get group members</TableCell></TableRow>
                </TableBody></Table></TableContainer>
                <Typography variant="h6" gutterBottom>Posts, Events, Comments, Reactions:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}><Table size="small"><TableHead><TableRow><TableCell><strong>Method</strong></TableCell><TableCell><strong>Endpoint</strong></TableCell><TableCell><strong>Description</strong></TableCell></TableRow></TableHead><TableBody>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/posts/?group={'{group_id}'}</TableCell><TableCell>Get posts for a group</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/posts/</TableCell><TableCell>Create a new post</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/events/?group={'{group_id}'}</TableCell><TableCell>Get events for a group</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/events/</TableCell><TableCell>Create a new event</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/comments/post/{'{post_id}'}/</TableCell><TableCell>Get comments for a post</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/comments/post/{'{post_id}'}/</TableCell><TableCell>Add a comment to a post</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/reactions/post/{'{post_id}'}/</TableCell><TableCell>Get reactions for a post</TableCell></TableRow>
                  <TableRow><TableCell>POST</TableCell><TableCell>/api/reactions/post/{'{post_id}'}/</TableCell><TableCell>Add/change reaction to a post</TableCell></TableRow>
                  <TableRow><TableCell>DELETE</TableCell><TableCell>/api/reactions/post/{'{post_id}'}/</TableCell><TableCell>Remove reaction from a post</TableCell></TableRow>
                </TableBody></Table></TableContainer>
                <Typography variant="h6" gutterBottom>Games & Challenges:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}><Table size="small"><TableHead><TableRow><TableCell><strong>Method</strong></TableCell><TableCell><strong>Endpoint</strong></TableCell><TableCell><strong>Description</strong></TableCell></TableRow></TableHead><TableBody>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/photo-memory/?group={'{group_id}'}</TableCell><TableCell>Get shuffled cards for Photo Memory game</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/word-association/?group={'{group_id}'}</TableCell><TableCell>Get words for Word Association game</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/polls/?group={'{group_id}'}</TableCell><TableCell>Get or create polls</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/two-truths-lie/?group={'{group_id}'}</TableCell><TableCell>Get or create Two Truths and a Lie games</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/would-you-rather/?group={'{group_id}'}</TableCell><TableCell>Get or create Would You Rather polls</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/this-or-that/?group={'{group_id}'}</TableCell><TableCell>Get or create This or That polls</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/fill-in-blank/?group={'{group_id}'}</TableCell><TableCell>Get or create Fill in the Blank games</TableCell></TableRow>
                  <TableRow><TableCell>GET/POST</TableCell><TableCell>/api/games/creative-challenges/?group={'{group_id}'}</TableCell><TableCell>Get or create Creative Challenges</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/streaks/?group={'{group_id}'}</TableCell><TableCell>Get user streaks</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/leaderboard-entries/?group={'{group_id}'}</TableCell><TableCell>Get leaderboard entries</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/user-stats/?group={'{group_id}'}</TableCell><TableCell>Get user stats</TableCell></TableRow>
                  <TableRow><TableCell>GET</TableCell><TableCell>/api/games/user-achievements/?group={'{group_id}'}</TableCell><TableCell>Get user achievements</TableCell></TableRow>
                </TableBody></Table></TableContainer>
              </AccordionDetails>
            </Accordion>
            {/* Frontend Components */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  <BuildIcon sx={{ mr: 1, color: '#00ff88' }} />
                  QUANTUM COMPONENTS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Core Components:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>App Component</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Main application component with routing, authentication gate, and global state management.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>GroupProvider & GroupContext</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>React Context for managing group memberships and selected group state across the application. Group selection is now automatic after login.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Onboarding Component</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Group registration form with credential generation and sharing functionality.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Login Component</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Group-based login form with credential change flow integration. No manual group selection after login.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Dashboard Component</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Main dashboard showing group members, posts, events, and creation forms with modern UI.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Games Component</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Tab-based interface for all social games, including Photo Memory, Word Association, Polls, and more.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>Comments & Reactions Components</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Real-time comment and reaction display and creation with user avatars and emoji icons.</Typography></CardContent></Card>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Key UI Features:</Typography>
                <List dense>
                  <ListItem>• <strong>Responsive Design</strong> - Mobile-first with Material-UI</ListItem>
                  <ListItem>• <strong>Modern UI/UX</strong> - Gradient backgrounds, glassmorphism, fixed footer, tabs</ListItem>
                  <ListItem>• <strong>Real-time Updates</strong> - Automatic data refresh after actions</ListItem>
                  <ListItem>• <strong>Authentication Flow</strong> - JWT token management with automatic logout</ListItem>
                  <ListItem>• <strong>Group Isolation</strong> - Complete separation of data between groups</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            {/* Security Features */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  <SecurityIcon sx={{ mr: 1, color: '#00ff88' }} />
                  QUANTUM SECURITY
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Authentication & Authorization:</Typography>
                <List dense>
                  <ListItem>• <strong>JWT Tokens</strong> - Secure stateless authentication</ListItem>
                  <ListItem>• <strong>Group-based Access Control</strong> - Users can only access their group data</ListItem>
                  <ListItem>• <strong>Credential Change Flow</strong> - Secure password/username updates</ListItem>
                  <ListItem>• <strong>Token Expiration</strong> - Automatic logout on token expiry</ListItem>
                  <ListItem>• <strong>CORS Protection</strong> - Cross-origin request security</ListItem>
                </List>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Data Protection:</Typography>
                <List dense>
                  <ListItem>• <strong>Input Validation</strong> - Server-side validation for all inputs</ListItem>
                  <ListItem>• <strong>SQL Injection Prevention</strong> - Django ORM protection</ListItem>
                  <ListItem>• <strong>XSS Protection</strong> - Content Security Policy</ListItem>
                  <ListItem>• <strong>CSRF Protection</strong> - Cross-site request forgery prevention</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            {/* Installation & Setup */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  📦 QUANTUM SETUP
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Prerequisites:</Typography>
                <List dense>
                  <ListItem>• Python 3.11+</ListItem>
                  <ListItem>• Node.js 16+</ListItem>
                  <ListItem>• PostgreSQL (Docker recommended)</ListItem>
                  <ListItem>• Cloudinary account (for media storage)</ListItem>
                </List>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Backend Setup:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#00ff88' }}>{`# Clone repository
git clone <repository-url>
cd bonded/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL database
# Update settings.py with your database credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver`}</Typography></CardContent></Card>
                <Typography variant="h6" gutterBottom>Frontend Setup:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#00ff88' }}>{`# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start`}</Typography></CardContent></Card>
                <Typography variant="h6" gutterBottom>Environment Configuration:</Typography>
                <List dense>
                  <ListItem>• Update <code>settings.py</code> with your database credentials</ListItem>
                  <ListItem>• Configure Cloudinary settings for media storage</ListItem>
                  <ListItem>• Set up CORS settings for your frontend domain</ListItem>
                  <ListItem>• Configure JWT settings for token expiration</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            {/* API Usage Examples */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  💡 QUANTUM EXAMPLES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Authentication Flow:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#00ff88' }}>{`// 1. Register a group
POST /api/users/register-group/
{
  "group_name": "My Friends",
  "num_people": 5
}

// 2. Login with credentials
POST /api/users/group-login/
{
  "group": "My Friends",
  "username": "john_doe",
  "password": "password123"
}

// 3. Use JWT token in subsequent requests
Authorization: Bearer <jwt_token>`}</Typography></CardContent></Card>
                <Typography variant="h6" gutterBottom>Creating Content & Playing Games:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 2 }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#00ff88' }}>{`// Create a post
POST /api/posts/
{
  "text": "Hello everyone!",
  "group": 1
}

// Create an event
POST /api/events/
{
  "title": "Weekend Trip",
  "type": "trip",
  "start_time": "2024-01-15T10:00:00Z",
  "group": 1
}

// Add a comment
POST /api/comments/post/1/
{
  "text": "Great post!"
}

// Add a reaction
POST /api/reactions/post/1/
{
  "type": "like"
}

// Get Photo Memory game cards
GET /api/games/photo-memory/?group=1

// Get Word Association words
GET /api/games/word-association/?group=1
`}</Typography></CardContent></Card>
              </AccordionDetails>
            </Accordion>
            {/* Troubleshooting */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  🔧 QUANTUM DEBUG
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Common Issues:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b6b', fontFamily: 'Orbitron, monospace' }}>Database Connection Issues</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Ensure PostgreSQL is running and credentials in settings.py are correct.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b6b', fontFamily: 'Orbitron, monospace' }}>CORS Errors</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Check CORS_ALLOW_ALL_ORIGINS setting and ensure frontend URL is allowed.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b6b', fontFamily: 'Orbitron, monospace' }}>JWT Token Issues</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Verify JWT settings and ensure tokens are being sent in Authorization header.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b6b', fontFamily: 'Orbitron, monospace' }}>Media Upload Issues</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Configure Cloudinary settings properly for media storage functionality.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: 2 }}><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b6b', fontFamily: 'Orbitron, monospace' }}>Game API Issues</Typography><Typography variant="body2" sx={{ color: '#e0e0e0' }}>Ensure you are authenticated and passing the correct group ID for all game endpoints.</Typography></CardContent></Card>
              </AccordionDetails>
            </Accordion>
            {/* Future Enhancements */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff88' }} />}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Orbitron, monospace',
                  color: '#00ff88'
                }}>
                  🚀 QUANTUM FUTURE
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Planned Features:</Typography>
                <List dense>
                  <ListItem>• <strong>Real-time Chat</strong> - WebSocket-based messaging</ListItem>
                  <ListItem>• <strong>File Sharing</strong> - Enhanced media upload capabilities</ListItem>
                  <ListItem>• <strong>Event RSVPs</strong> - Attendance tracking for events</ListItem>
                  <ListItem>• <strong>Task Management</strong> - Todo lists and task assignments</ListItem>
                  <ListItem>• <strong>Push Notifications</strong> - Mobile app with notifications</ListItem>
                  <ListItem>• <strong>Advanced Analytics</strong> - Group activity insights</ListItem>
                  <ListItem>• <strong>API Rate Limiting</strong> - Enhanced security measures</ListItem>
                  <ListItem>• <strong>Multi-language Support</strong> - Internationalization</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          background: 'rgba(26, 26, 58, 0.3)',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleClose} 
              variant="contained" 
              sx={{ 
                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                color: '#0a0a1a',
                fontWeight: 600,
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0, 255, 136, 0.4)'
                }
              }}
            >
              QUANTUM CLOSE
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <GroupProvider>
      <Router>
        <AuthGate />
        <CssBaseline />
        {/* Quantum Background Container */}
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a4a 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Quantum Particles Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 136, 255, 0.05) 0%, transparent 50%)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
          
          <AppBar position="fixed" sx={{ 
            background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 255, 136, 0.1)',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}>
            <Toolbar>
              <Box display="flex" alignItems="center">
                <BondedLogo 
                  size={40} 
                  src="/Bonded.png"
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mr: 1, ml: 1, color: '#00ff88' }}>
                    BONDED
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, color: '#c0c0c0' }}>
                    QUANTUM SOCIAL
                  </Typography>
                </motion.div>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Documentation />
              {isAuthenticated && <LogoutButton />}
            </Toolbar>
          </AppBar>
          {/* Spacer to prevent content from being hidden behind fixed header */}
          <Toolbar />
          <Container sx={{ 
            mt: { xs: 2, md: 4 }, 
            mb: { xs: 7, md: 8 }, 
            minHeight: { xs: 'calc(100vh - 120px)', md: 'calc(100vh - 140px)' }, 
            px: { xs: 1, sm: 2, md: 3 },
            position: 'relative',
            zIndex: 1
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/change-credentials" element={<CredentialChange />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/events" element={<Events />} />
              <Route path="/games" element={<Games />} />
            </Routes>
            </Container>
          
          {/* Quantum Kitten - Only show on homepage */}
          {window.location.pathname === '/' && (
            <QuantumKitten isMobile={isMobile} />
          )}
          
          {/* Fixed Footer */}
          <Box
            component="footer"
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)',
              backdropFilter: 'blur(20px)',
              color: '#c0c0c0',
              py: 1,
              px: 2,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              boxShadow: '0 -2px 10px rgba(0, 255, 136, 0.1)',
              borderTop: '1px solid rgba(0, 255, 136, 0.2)'
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Bonded Social Platform
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  © 2025 Aniruddha H D. All rights reserved.
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Version 1.4.0
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </GroupProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

// Add these placeholders:
function Posts() {
  return (
    <Box sx={{ 
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 4
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" sx={{ 
          color: '#00ff88', 
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          mb: 2,
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
        }}>
          QUANTUM POSTS
        </Typography>
        <Typography variant="h6" sx={{ 
          color: '#c0c0c0', 
          opacity: 0.8,
          mb: 4
        }}>
          Coming Soon - Quantum Social Feed
        </Typography>
        <Box sx={{
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 3,
          p: 4,
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
        }}>
          <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
            Advanced social feed with quantum-enhanced interactions, 
            holographic posts, and real-time quantum entanglement features.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

function Events() {
  return (
    <Box sx={{ 
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 4
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Typography variant="h3" sx={{ 
          color: '#8b5cf6', 
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          mb: 2,
          textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
        }}>
          QUANTUM EVENTS
        </Typography>
        <Typography variant="h6" sx={{ 
          color: '#c0c0c0', 
          opacity: 0.8,
          mb: 4
        }}>
          Coming Soon - Temporal Event Management
        </Typography>
        <Box sx={{
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 3,
          p: 4,
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
        }}>
          <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
            Quantum event scheduling with temporal coordinates, 
            holographic event previews, and multi-dimensional RSVP systems.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}
