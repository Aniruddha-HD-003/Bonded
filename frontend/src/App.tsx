import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
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
  Avatar,
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
} from '@mui/material';
import { 
  Group as GroupIcon,
  Event as EventIcon,
  PostAdd as PostAddIcon,
  Comment as CommentIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
  Build as BuildIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  Leaderboard as LeaderboardIcon,
  Star as StarIcon,
  Add as AddIcon,
  Poll as PollIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  Memory as MemoryIcon,
  Link as LinkIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CompareArrows as CompareArrowsIcon,
  Create as CreateIcon
} from '@mui/icons-material';
import apiClient from './config/api';
import BondedLogo from './components/BondedLogo';

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

function GroupProvider({ children }: { children: React.ReactNode }) {
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

function useGroup() {
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

function HomePage() {
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

          {/* Features Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
              Why Choose Bonded?
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
              gap: 3 
            }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Private & Secure
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Your group is completely private and secure with JWT authentication.
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <EventIcon sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Plan Events
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Create and manage events, trips, and meetings with your group.
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CommentIcon sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Stay Connected
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Share posts, comments, and reactions with your group members.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
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
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
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
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              🚀 Create Your Group
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Set up your private social space for friends and memories
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
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
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
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
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
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                  }
                }}
              >
                {loading ? 'Creating Group...' : '🚀 Create Group'}
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
    <Box mt={2}>
      <Card sx={{ 
        maxWidth: 500, 
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
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
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
            <Typography variant="h4" gutterBottom fontWeight="bold">
              🔐 Welcome Back
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Sign in to your group space
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
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
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
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
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
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
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
              {loading ? 'Signing In...' : '🚀 Sign In'}
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
    <Box mt={2}>
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>Set Your Username & Password</Typography>
        {success ? (
          <Alert severity="success">Credentials updated! Redirecting to login...</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            {error && (
              Array.isArray(error) ? error.map((msg, idx) => (
                <Alert severity="error" sx={{ mb: 1 }} key={idx}>{msg}</Alert>
              )) : <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Updating...' : 'Update Credentials'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}

function Comments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(() => {
    apiClient.get(`/comments/post/${postId}/`)
      .then((res: any) => setComments(res.data))
      .catch(() => setComments([]));
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await apiClient.post(`/comments/post/${postId}/`, {
        text: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box component="form" onSubmit={handleCommentSubmit} sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 2,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        p: 1
      }}>
        <TextField
          label="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          fullWidth
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.6)' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiInputBase-input': { color: 'white' }
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="small"
          disabled={loading}
          sx={{ 
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 2,
            minWidth: 'fit-content',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #764ba2 0%, #667eea 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          <CommentIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Comment
        </Button>
      </Box>
      <List sx={{ p: 0 }}>
        {comments.map((c: any) => (
          <Card key={c.id} sx={{ 
            mb: 1, 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 1.5,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ListItem sx={{ py: 1 }}>
              <Avatar sx={{ 
                mr: 1, 
                width: 20, 
                height: 20, 
                fontSize: '0.7rem',
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
              }}>
                {c.user_username?.charAt(0).toUpperCase() || '?'}
              </Avatar>
              <ListItemText 
                primary={
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    {c.user_username || 'Unknown User'}
                  </Typography>
                } 
                secondary={
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {c.text}
                  </Typography>
                } 
              />
            </ListItem>
          </Card>
        ))}
      </List>
    </Box>
  );
}

function Reactions({ postId, currentUser }: { postId: number; currentUser: string }) {
  const [reactions, setReactions] = useState<any[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const fetchReactions = useCallback(() => {
    apiClient.get(`/reactions/post/${postId}/`)
      .then((res: any) => {
        setReactions(res.data);
        const userReact = res.data.find((r: any) => r.user_username === currentUser);
        setUserReaction(userReact ? userReact.type : null);
      })
      .catch(() => setReactions([]));
  }, [postId, currentUser]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReact = async (type: string) => {
    try {
      if (userReaction === type) {
        // Remove reaction
        await apiClient.delete(`/reactions/post/${postId}/`);
        setUserReaction(null);
      } else {
        // Add/change reaction
        await apiClient.post(`/reactions/post/${postId}/`, { type });
        setUserReaction(type);
      }
      fetchReactions();
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const reactionTypes = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
  const reactionEmojis = { like: '👍', love: '❤️', laugh: '😂', wow: '😮', sad: '😢', angry: '😠' };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {reactionTypes.map(type => {
          const count = reactions.filter(r => r.type === type).length;
          const isActive = userReaction === type;
          return (
            <Button
              key={type}
              onClick={() => handleReact(type)}
              size="small"
              sx={{
                background: isActive 
                  ? 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)' 
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                minWidth: 'fit-content',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s',
                '&:hover': {
                  background: isActive 
                    ? 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)'
                    : 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Typography variant="body2" sx={{ mr: 0.5 }}>
                {reactionEmojis[type as keyof typeof reactionEmojis]}
              </Typography>
              {count > 0 && (
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {count}
                </Typography>
              )}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

function Dashboard() {
  const { selectedGroup } = useGroup();
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [postError, setPostError] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('trip');
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [eventError, setEventError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  const fetchData = () => {
    if (!selectedGroup) return;
    setLoading(true);
    // Fetch group members
    apiClient.get(`/users/groups/${selectedGroup.group_id}/members/`)
      .then((res: any) => setMembers(res.data.members))
      .catch(() => setMembers([]));
    // Fetch posts
    apiClient.get(`/posts/?group=${selectedGroup.group_id}`)
      .then((res: any) => setPosts(res.data))
      .catch(() => setPosts([]));
    // Fetch events
    apiClient.get(`/events/?group=${selectedGroup.group_id}`)
      .then((res: any) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [selectedGroup]);

  useEffect(() => {
    if (!selectedGroup) return;
    setAchievementsLoading(true);
    apiClient.get(`/games/user-achievements/?group=${selectedGroup.group_id}`)
      .then((res: any) => setAchievements(res.data))
      .catch(() => setAchievements([]))
      .finally(() => setAchievementsLoading(false));
  }, [selectedGroup]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    
    // Validate that either text or file is provided
    if (!newPost.trim() && !selectedFile) {
      setPostError('Please add some text or upload a photo/video.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('text', newPost);
      formData.append('group', selectedGroup.group_id.toString());
      
      if (selectedFile) {
        formData.append('media', selectedFile);
      }
      
      await apiClient.post('/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset form
      setNewPost('');
      setSelectedFile(null);
      setFilePreview(null);
      fetchData();
    } catch (err: any) {
      setPostError(err.response?.data?.error || 'Failed to create post.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setPostError('Please select a valid image or video file.');
        return;
      }
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setPostError('File size must be under 50MB.');
        return;
      }
      
      setSelectedFile(file);
      setPostError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError('');
    if (!newEventTitle.trim() || !newEventType || !newEventStartTime) {
      setEventError('All fields are required.');
      return;
    }
    try {
      await apiClient.post(
        '/events/',
        {
          title: newEventTitle,
          type: newEventType,
          start_time: newEventStartTime,
          group: selectedGroup.group_id
        }
      );
      setNewEventTitle('');
      setNewEventType('trip');
      setNewEventStartTime('');
      fetchData();
    } catch (err: any) {
      setEventError(err.response?.data?.error || 'Failed to create event.');
    }
  };

  const handleDeletePost = (post: any) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await apiClient.delete(`/posts/${postToDelete.id}/`);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      fetchData(); // Refresh posts
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (!selectedGroup) {
    return (
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          🎯 Please select a group to view its dashboard
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {selectedGroup.group_name}
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Welcome back, {selectedGroup.username}! 🚀
          </Typography>
        </CardContent>
      </Card>

      {/* Navigation Section */}
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Quick Navigation</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/games"
              variant="contained"
              startIcon={<EmojiEventsIcon />}
              sx={{
                background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(245, 87, 108, 0.3)'
                }
              }}
            >
              Games & Challenges
            </Button>
            <Button
              component={Link}
              to="/posts"
              variant="outlined"
              startIcon={<PostAddIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              View All Posts
            </Button>
            <Button
              component={Link}
              to="/events"
              variant="outlined"
              startIcon={<EventIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              View All Events
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Members Section */}
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Card sx={{ 
            height: 'fit-content',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <GroupIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">Group Members</Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {members.map((m: any, index: number) => (
                  <Card key={m.user_id} sx={{ 
                    mb: 2, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <ListItem>
                      <Avatar sx={{ 
                        mr: 2, 
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 'bold'
                      }}>
                        {m.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold" color="white">
                            {m.username}
                          </Typography>
                        } 
                        secondary={
                          <Chip 
                            label={m.role} 
                            size="small" 
                            sx={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              color: 'white',
                              fontWeight: 'bold',
                              mt: 0.5
                            }} 
                          />
                        } 
                      />
                    </ListItem>
                  </Card>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Posts Section */}
        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PostAddIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">Posts</Typography>
              </Box>
              
              {/* Create Post Form */}
              <Card sx={{ 
                mb: 3, 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent>
                  <Box component="form" onSubmit={handlePostSubmit}>
                    {/* Text Input */}
                    <TextField
                      label="Share something..."
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'white' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                    
                    {/* File Preview */}
                    {filePreview && (
                      <Box sx={{ mb: 2, position: 'relative' }}>
                        {selectedFile?.type.startsWith('image/') ? (
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '300px', 
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }} 
                          />
                        ) : (
                          <video 
                            src={filePreview} 
                            controls 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '300px', 
                              borderRadius: '8px'
                            }} 
                          />
                        )}
                        <Button
                          onClick={removeFile}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            minWidth: 'auto',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.9)',
                            }
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    )}
                    
                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <input
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<AttachFileIcon />}
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          {selectedFile ? 'Change File' : 'Add Photo/Video'}
                        </Button>
                      </label>
                      
                      <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                          background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                          borderRadius: 2,
                          px: 3,
                          minWidth: 'fit-content',
                          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                          }
                        }}
                      >
                        Post
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              {postError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {postError}
                </Alert>
              )}
              
              {loading ? (
                <Box textAlign="center" py={4}>
                  <Typography>Loading posts...</Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {posts.map((p: any) => (
                    <Card key={p.id} sx={{ 
                      mb: 2, 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                                          <CardContent>
                      {/* Post Text */}
                      {p.text && (
                        <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                          {p.text}
                        </Typography>
                      )}
                      
                      {/* Post Media */}
                      {p.media_url && (
                        <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                          {p.media_type === 'image' ? (
                            <img 
                              src={p.media_url} 
                              alt="Post content" 
                              style={{ 
                                width: '100%', 
                                maxHeight: '500px', 
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }} 
                              onError={(e) => {
                                console.error('Image failed to load:', p.media_url);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : p.media_type === 'video' ? (
                            <video 
                              src={p.media_url} 
                              controls 
                              style={{ 
                                width: '100%', 
                                maxHeight: '500px',
                                borderRadius: '8px'
                              }} 
                              onError={(e) => {
                                console.error('Video failed to load:', p.media_url);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </Box>
                      )}
                      
                      {/* Post Meta */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ 
                            mr: 1, 
                            width: 24, 
                            height: 24, 
                            fontSize: '0.8rem',
                            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
                          }}>
                            {p.author_username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {p.author_username} • {new Date(p.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        
                        {/* Delete Button - Only show for post author */}
                        {p.author_username === selectedGroup.username && (
                          <Button
                            onClick={() => handleDeletePost(p)}
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(244, 67, 54, 0.8)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 1)',
                              }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </Button>
                        )}
                      </Box>
                      <Reactions postId={p.id} currentUser={p.author_username} />
                      <Comments postId={p.id} />
                    </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Events Section */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <EventIcon sx={{ mr: 1, fontSize: 28, color: '#333' }} />
              <Typography variant="h6" fontWeight="bold" color="#333">Events</Typography>
            </Box>
            
            {/* Create Event Form */}
            <Card sx={{ 
              mb: 3, 
              background: 'rgba(255,255,255,0.7)', 
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box component="form" onSubmit={handleEventSubmit} sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap', 
                  alignItems: 'center' 
                }}>
                  <TextField
                    label="Event Title"
                    value={newEventTitle}
                    onChange={e => setNewEventTitle(e.target.value)}
                    required
                    sx={{ flex: 2, minWidth: 200 }}
                  />
                  <TextField
                    label="Type"
                    select
                    SelectProps={{ native: true }}
                    value={newEventType}
                    onChange={e => setNewEventType(e.target.value)}
                    required
                    sx={{ flex: 1, minWidth: 120 }}
                  >
                    <option value="trip">Trip</option>
                    <option value="goal">Goal</option>
                    <option value="meeting">Meeting</option>
                  </TextField>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={newEventStartTime}
                    onChange={e => setNewEventStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{ flex: 2, minWidth: 200 }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ 
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      borderRadius: 2,
                      px: 3,
                      minWidth: 'fit-content',
                      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
                      }
                    }}
                  >
                    Add Event
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            {eventError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {eventError}
              </Alert>
            )}
            
            {loading ? (
              <Box textAlign="center" py={4}>
                <Typography color="#333">Loading events...</Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2 
              }}>
                {events.map((ev: any) => (
                  <Card key={ev.id} sx={{ 
                    background: 'rgba(255,255,255,0.8)', 
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                        {ev.title}
                      </Typography>
                      <Chip 
                        label={ev.type} 
                        size="small" 
                        sx={{ 
                          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 1
                        }} 
                      />
                      <Typography variant="body2" color="#666" sx={{ mt: 1 }}>
                        📅 {new Date(ev.start_time).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeletePost}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          Delete Post
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this post?
          </Typography>
          {postToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                "{postToDelete.text ? postToDelete.text.substring(0, 100) + (postToDelete.text.length > 100 ? '...' : '') : 'Media post'}"
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. All comments and reactions will also be deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={cancelDeletePost}
            variant="outlined"
            sx={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.4)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeletePost}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* My Achievements Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEventsIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">My Achievements</Typography>
          </Box>
          {achievementsLoading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : achievements.length === 0 ? (
            <Typography variant="body2" color="white">No achievements yet. Start engaging to earn badges!</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {achievements.map((ua) => (
                <Card key={ua.id} sx={{ minWidth: 180, maxWidth: 220, background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Avatar sx={{ bgcolor: '#fffde4', color: '#ffa751', width: 36, height: 36, fontSize: 22 }}>
                        {/* Use icon name or fallback */}
                        <EmojiEventsIcon />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff' }}>{ua.achievement.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#fffde4' }}>{ua.achievement.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

function Posts() {
  return <div>Posts Page</div>;
}

function Events() {
  return <div>Events Page</div>;
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

  useEffect(() => {
    fetchGamesData();
    fetchPolls();
    fetchSocialIcebreakers();
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

  if (!selectedGroup) {
    return (
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          🎯 Please select a group to view games
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEventsIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              Games & Challenges
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Level up your group engagement! 🚀
          </Typography>
        </CardContent>
      </Card>

      {/* User Stats Card */}
      {userStats && (
        <Card sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <StarIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold">Your Stats</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" fontWeight="bold">{userStats.total_points}</Typography>
                <Typography variant="body2">Points</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" fontWeight="bold">{userStats.total_posts}</Typography>
                <Typography variant="body2">Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" fontWeight="bold">{userStats.challenges_completed}</Typography>
                <Typography variant="body2">Challenges</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" fontWeight="bold">{userStats.rank || 'N/A'}</Typography>
                <Typography variant="body2">Rank</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '0.9rem',
                textTransform: 'none',
                minHeight: 64,
                minWidth: 120
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
          </Tabs>
          <Box sx={{ textAlign: 'center', py: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
            ← Scroll to see all game types →
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Challenges Tab */}
          {activeTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Active Challenges</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateChallenge(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Create Challenge
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredChallenges.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <EmojiEventsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No challenges yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create the first challenge to get your group engaged!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredChallenges.map((challenge) => (
                    <Card key={challenge.id} sx={{ 
                      borderRadius: 2,
                      border: challenge.is_current ? '2px solid #4caf50' : '1px solid #e0e0e0',
                      background: challenge.is_current ? 'rgba(76, 175, 80, 0.05)' : 'white'
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
        </Box>
      </Card>

      {/* Create Challenge Dialog */}
      <Dialog 
        open={showCreateChallenge} 
        onClose={() => setShowCreateChallenge(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create New Challenge</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateChallenge}>
          <DialogContent>
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
          <DialogActions sx={{ p: 2 }}>
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
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Two Truths and a Lie</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateTwoTruthsLie}>
          <DialogContent>
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
          <DialogActions sx={{ p: 2 }}>
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
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Would You Rather Poll</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateWouldYouRather}>
          <DialogContent>
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
          <DialogActions sx={{ p: 2 }}>
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
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create This or That Poll</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateThisOrThat}>
          <DialogContent>
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
          <DialogActions sx={{ p: 2 }}>
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
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Create Fill in the Blank</Typography>
        </DialogTitle>
        <form onSubmit={handleCreateFillInBlank}>
          <DialogContent>
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
          <DialogActions sx={{ p: 2 }}>
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
  return (
    <>
      <Button color="inherit" onClick={handleOpen} sx={{ ml: 2 }}>
        <HelpIcon sx={{ mr: 1, fontSize: 20 }} />
        Documentation
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CodeIcon />
          Bonded Social Platform - Complete Documentation (v1.1.0)
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            {/* Overview */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  🚀 Project Overview
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>
                  <strong>Bonded</strong> is a modern, group-based social platform for sharing memories, planning events, and playing interactive games. Each group is isolated, with unique usernames per group. The platform now features a suite of social games, exclusive Cloudinary media storage, and a streamlined login flow (no group selection after login).
                </Typography>
                <Typography variant="h6" gutterBottom>Key Features (v1.1.0):</Typography>
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
            {/* Architecture */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  🏗️ System Architecture
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  <StorageIcon sx={{ mr: 1 }} />
                  Database Models
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Core Models:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">User</Typography><Typography variant="body2">Custom user model with email, password, and group memberships.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Group</Typography><Typography variant="body2">Represents social groups with name and member relationships.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">GroupMembership</Typography><Typography variant="body2">Links users to groups with username and role per group.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Post</Typography><Typography variant="body2">User posts with text, group, and Cloudinary media.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Event</Typography><Typography variant="body2">Events with title, type, start_time, and group association.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Comment</Typography><Typography variant="body2">Comments on posts with text and user association.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Reaction</Typography><Typography variant="body2">User reactions to posts (like, love, laugh, wow, sad, angry).</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="primary">Game & Challenge Models</Typography><Typography variant="body2">Photo Memory, Word Association, Poll, Two Truths and a Lie, Would You Rather, This or That, Fill in the Blank, Creative Challenges, Streaks, Leaderboards, Achievements, and related user/game state models.</Typography></CardContent></Card>
              </AccordionDetails>
            </Accordion>
            {/* API Endpoints */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  <ApiIcon sx={{ mr: 1 }} />
                  API Endpoints
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  <BuildIcon sx={{ mr: 1 }} />
                  Frontend Components
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Core Components:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">App Component</Typography><Typography variant="body2">Main application component with routing, authentication gate, and global state management.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">GroupProvider & GroupContext</Typography><Typography variant="body2">React Context for managing group memberships and selected group state across the application. Group selection is now automatic after login.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">Onboarding Component</Typography><Typography variant="body2">Group registration form with credential generation and sharing functionality.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">Login Component</Typography><Typography variant="body2">Group-based login form with credential change flow integration. No manual group selection after login.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">Dashboard Component</Typography><Typography variant="body2">Main dashboard showing group members, posts, events, and creation forms with modern UI.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">Games Component</Typography><Typography variant="body2">Tab-based interface for all social games, including Photo Memory, Word Association, Polls, and more.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="success.main">Comments & Reactions Components</Typography><Typography variant="body2">Real-time comment and reaction display and creation with user avatars and emoji icons.</Typography></CardContent></Card>
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  <SecurityIcon sx={{ mr: 1 }} />
                  Security Features
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  📦 Installation & Setup
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
                <Card sx={{ mb: 2, background: 'rgba(255, 193, 7, 0.1)' }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>{`# Clone repository
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
                <Card sx={{ mb: 2, background: 'rgba(255, 193, 7, 0.1)' }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>{`# Navigate to frontend directory
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  💡 API Usage Examples
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Authentication Flow:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(156, 39, 176, 0.1)' }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>{`// 1. Register a group
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
                <Card sx={{ mb: 2, background: 'rgba(156, 39, 176, 0.1)' }}><CardContent><Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>{`// Create a post
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  🔧 Troubleshooting
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" gutterBottom>Common Issues:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="error">Database Connection Issues</Typography><Typography variant="body2">Ensure PostgreSQL is running and credentials in settings.py are correct.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="error">CORS Errors</Typography><Typography variant="body2">Check CORS_ALLOW_ALL_ORIGINS setting and ensure frontend URL is allowed.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="error">JWT Token Issues</Typography><Typography variant="body2">Verify JWT settings and ensure tokens are being sent in Authorization header.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="error">Media Upload Issues</Typography><Typography variant="body2">Configure Cloudinary settings properly for media storage functionality.</Typography></CardContent></Card>
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}><CardContent><Typography variant="subtitle1" fontWeight="bold" color="error">Game API Issues</Typography><Typography variant="body2">Ensure you are authenticated and passing the correct group ID for all game endpoints.</Typography></CardContent></Card>
              </AccordionDetails>
            </Accordion>
            {/* Future Enhancements */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  🚀 Future Enhancements
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ 
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <GroupProvider>
      <Router>
        <AuthGate />
        <CssBaseline />
        <AppBar position="fixed" sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              <BondedLogo 
                size={40} 
                src="/Bonded.png" // Your logo is now in the public folder
              />
              <Typography variant="h6" fontWeight="bold" sx={{ mr: 1, ml: 1 }}>
                Bonded
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Social Platform
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Documentation />
            {isAuthenticated && <LogoutButton />}
          </Toolbar>
        </AppBar>
        {/* Spacer to prevent content from being hidden behind fixed header */}
        <Toolbar />
        <Container sx={{ mt: 4, mb: 8, minHeight: 'calc(100vh - 140px)' }}>
          {/* Removed <GroupSelector /> */}
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
        {/* Fixed Footer */}
        <Box
          component="footer"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            py: 1,
            px: 2,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            borderTop: '1px solid rgba(255,255,255,0.1)'
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
                Version 1.1.0
              </Typography>
            </Box>
          </Container>
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
