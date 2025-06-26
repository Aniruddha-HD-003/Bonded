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
  TableRow
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
  Build as BuildIcon
} from '@mui/icons-material';
import axios from 'axios';

// Group context to provide memberships and selected group
type Membership = {
  group_id: number;
  group_name: string;
  username: string;
  role: string;
};
const GroupContext = createContext<any>(null);

function GroupProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>(() => {
    const m = localStorage.getItem('memberships');
    return m ? JSON.parse(m) : [];
  });
  const [selectedGroup, setSelectedGroup] = useState<Membership | null>(() => {
    const sg = localStorage.getItem('selectedGroup');
    return sg ? JSON.parse(sg) : null;
  });

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

function GroupSelector() {
  const { memberships, selectedGroup, setSelectedGroup } = useGroup();
  if (!memberships || memberships.length === 0) return null;
  return (
    <Card sx={{ 
      mb: 3, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <GroupIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">Select Your Group</Typography>
        </Box>
        <TextField
          select
          SelectProps={{ native: true }}
          value={selectedGroup?.group_id || ''}
          onChange={e => {
            const group = memberships.find((m: Membership) => m.group_id === Number(e.target.value));
            setSelectedGroup(group || null);
          }}
          fullWidth
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
            '& .MuiSelect-select': { color: 'white' },
            '& option': { backgroundColor: '#667eea', color: 'white' }
          }}
        >
          <option value="" disabled>Select a group</option>
          {memberships.map((m: Membership) => (
            <option key={m.group_id} value={m.group_id}>{m.group_name} ({m.username})</option>
          ))}
        </TextField>
      </CardContent>
    </Card>
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
      const res = await axios.post('http://127.0.0.1:8000/api/users/register-group/', {
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
    <Box mt={4}>
      <Card sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          p: 4, 
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            🚀 Welcome to Bonded
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Create your social space for friends and memories
          </Typography>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/users/group-login/', {
        group,
        username,
        password,
      });
      if (res.data.must_change_credentials) {
        sessionStorage.setItem('pending_group', group);
        sessionStorage.setItem('pending_username', username);
        sessionStorage.setItem('pending_password', password);
        navigate('/change-credentials');
      } else if (res.data.access) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('memberships', JSON.stringify(res.data.memberships));
        navigate('/dashboard');
      } else {
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
    <Box mt={4}>
      <Card sx={{ 
        maxWidth: 500, 
        mx: 'auto', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          p: 4, 
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            🔐 Welcome Back
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Sign in to your group space
          </Typography>
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
      await axios.post('http://127.0.0.1:8000/api/users/change-credentials/', {
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
    <Box mt={4}>
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
    authAxios().get(`http://127.0.0.1:8000/api/comments/post/${postId}/`)
      .then(res => setComments(res.data))
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
      await authAxios().post(`http://127.0.0.1:8000/api/comments/post/${postId}/`, {
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
    authAxios().get(`http://127.0.0.1:8000/api/reactions/post/${postId}/`)
      .then(res => {
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
        await authAxios().delete(`http://127.0.0.1:8000/api/reactions/post/${postId}/`);
        setUserReaction(null);
      } else {
        // Add/change reaction
        await authAxios().post(`http://127.0.0.1:8000/api/reactions/post/${postId}/`, { type });
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
  const [postError, setPostError] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('trip');
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [eventError, setEventError] = useState('');

  const fetchData = () => {
    if (!selectedGroup) return;
    setLoading(true);
    // Fetch group members
    authAxios().get(`http://127.0.0.1:8000/api/users/groups/${selectedGroup.group_id}/members/`)
      .then(res => setMembers(res.data.members))
      .catch(() => setMembers([]));
    // Fetch posts
    authAxios().get(`http://127.0.0.1:8000/api/posts/?group=${selectedGroup.group_id}`)
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
    // Fetch events
    authAxios().get(`http://127.0.0.1:8000/api/events/?group=${selectedGroup.group_id}`)
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [selectedGroup]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    if (!newPost.trim()) {
      setPostError('Post cannot be empty.');
      return;
    }
    try {
      await authAxios().post(
        'http://127.0.0.1:8000/api/posts/',
        { text: newPost, group: selectedGroup.group_id }
      );
      setNewPost('');
      fetchData();
    } catch (err: any) {
      setPostError(err.response?.data?.error || 'Failed to create post.');
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError('');
    if (!newEventTitle.trim() || !newEventType || !newEventStartTime) {
      setEventError('All fields are required.');
      return;
    }
    try {
      await authAxios().post(
        'http://127.0.0.1:8000/api/events/',
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
                  <Box component="form" onSubmit={handlePostSubmit} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Share something..."
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ 
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
                        <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                          {p.text}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
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
    </Box>
  );
}

function Posts() {
  return <div>Posts Page</div>;
}

function Events() {
  return <div>Events Page</div>;
}

// Axios interceptor for 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('memberships');
      localStorage.removeItem('selectedGroup');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper for authenticated API calls
function authAxios() {
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  
  return axios.create({
    baseURL: apiUrl,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  });
}

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('memberships');
    localStorage.removeItem('selectedGroup');
    navigate('/login');
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  return null;
}

function Documentation() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button 
        color="inherit" 
        onClick={handleOpen} 
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
        <HelpIcon sx={{ mr: 1, fontSize: 20 }} />
        Documentation
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CodeIcon />
          Bonded Social Platform - Complete Documentation
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
                  <strong>Bonded</strong> is a production-grade social platform designed for groups of friends to share memories, 
                  plan trips/goals/meetings, and interact via posts, likes, and reactions. The platform features group isolation 
                  where the same username can exist in different groups but must be unique within a group.
                </Typography>
                <Typography variant="h6" gutterBottom>Key Features:</Typography>
                <List dense>
                  <ListItem>• Group-based social networking</ListItem>
                  <ListItem>• Multi-group membership support</ListItem>
                  <ListItem>• Post creation and interaction</ListItem>
                  <ListItem>• Event planning (trips, goals, meetings)</ListItem>
                  <ListItem>• Real-time reactions and comments</ListItem>
                  <ListItem>• JWT-based authentication</ListItem>
                  <ListItem>• Responsive Material-UI design</ListItem>
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
                  <ListItem>• <strong>PostgreSQL</strong> - Database (Docker)</ListItem>
                  <ListItem>• <strong>JWT Authentication</strong> - Security</ListItem>
                  <ListItem>• <strong>Cloudinary</strong> - Media storage</ListItem>
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
                
                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">User Model</Typography>
                    <Typography variant="body2">
                      Custom user model with email, password, and group membership relationships.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">Group Model</Typography>
                    <Typography variant="body2">
                      Represents social groups with name and member relationships.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">GroupMembership Model</Typography>
                    <Typography variant="body2">
                      Junction table linking users to groups with username and role per group.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">Post Model</Typography>
                    <Typography variant="body2">
                      User posts with text content, group association, and media support.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">Event Model</Typography>
                    <Typography variant="body2">
                      Events with title, type (trip/goal/meeting), start_time, and group association.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">Comment Model</Typography>
                    <Typography variant="body2">
                      Comments on posts with text content and user association.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">Reaction Model</Typography>
                    <Typography variant="body2">
                      User reactions to posts (like, love, laugh, wow, sad, angry).
                    </Typography>
                  </CardContent>
                </Card>
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
                <Typography variant="h6" gutterBottom>Authentication Endpoints:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/users/register-group/</TableCell>
                        <TableCell>Register a new group with members</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/users/group-login/</TableCell>
                        <TableCell>Login with group, username, password</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/users/change-credentials/</TableCell>
                        <TableCell>Change username and password</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Group Management:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>GET</TableCell>
                        <TableCell>/api/users/groups/{'{group_id}'}/members/</TableCell>
                        <TableCell>Get group members</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Posts:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>GET</TableCell>
                        <TableCell>/api/posts/?group={'{group_id}'}</TableCell>
                        <TableCell>Get posts for a group</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/posts/</TableCell>
                        <TableCell>Create a new post</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Events:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>GET</TableCell>
                        <TableCell>/api/events/?group={'{group_id}'}</TableCell>
                        <TableCell>Get events for a group</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/events/</TableCell>
                        <TableCell>Create a new event</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Comments:</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>GET</TableCell>
                        <TableCell>/api/comments/post/{'{post_id}'}/</TableCell>
                        <TableCell>Get comments for a post</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/comments/post/{'{post_id}'}/</TableCell>
                        <TableCell>Add a comment to a post</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Reactions:</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>GET</TableCell>
                        <TableCell>/api/reactions/post/{'{post_id}'}/</TableCell>
                        <TableCell>Get reactions for a post</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>POST</TableCell>
                        <TableCell>/api/reactions/post/{'{post_id}'}/</TableCell>
                        <TableCell>Add/change reaction to a post</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>DELETE</TableCell>
                        <TableCell>/api/reactions/post/{'{post_id}'}/</TableCell>
                        <TableCell>Remove reaction from a post</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
                
                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">App Component</Typography>
                    <Typography variant="body2">
                      Main application component with routing, authentication gate, and global state management.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">GroupProvider & GroupContext</Typography>
                    <Typography variant="body2">
                      React Context for managing group memberships and selected group state across the application.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">Onboarding Component</Typography>
                    <Typography variant="body2">
                      Group registration form with credential generation and sharing functionality.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">Login Component</Typography>
                    <Typography variant="body2">
                      Group-based login form with credential change flow integration.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">Dashboard Component</Typography>
                    <Typography variant="body2">
                      Main dashboard showing group members, posts, events, and creation forms with futuristic UI.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">Comments Component</Typography>
                    <Typography variant="body2">
                      Comment display and creation with real-time updates and user avatars.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">Reactions Component</Typography>
                    <Typography variant="body2">
                      Interactive reaction buttons with emoji icons and real-time count updates.
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Key Features:</Typography>
                <List dense>
                  <ListItem>• <strong>Responsive Design</strong> - Mobile-first approach with Material-UI</ListItem>
                  <ListItem>• <strong>Futuristic UI</strong> - Gradient backgrounds, glassmorphism effects, animations</ListItem>
                  <ListItem>• <strong>Real-time Updates</strong> - Automatic data refresh after actions</ListItem>
                  <ListItem>• <strong>Error Handling</strong> - Comprehensive error states and user feedback</ListItem>
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
                <Card sx={{ mb: 2, background: 'rgba(255, 193, 7, 0.1)' }}>
                  <CardContent>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`# Clone repository
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
python manage.py runserver`}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom>Frontend Setup:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(255, 193, 7, 0.1)' }}>
                  <CardContent>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start`}
                    </Typography>
                  </CardContent>
                </Card>

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
                <Card sx={{ mb: 2, background: 'rgba(156, 39, 176, 0.1)' }}>
                  <CardContent>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`// 1. Register a group
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
Authorization: Bearer <jwt_token>`}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom>Creating Content:</Typography>
                <Card sx={{ mb: 2, background: 'rgba(156, 39, 176, 0.1)' }}>
                  <CardContent>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`// Create a post
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
}`}
                    </Typography>
                  </CardContent>
                </Card>
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
                
                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="error">Database Connection Issues</Typography>
                    <Typography variant="body2">
                      Ensure PostgreSQL is running and credentials in settings.py are correct.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="error">CORS Errors</Typography>
                    <Typography variant="body2">
                      Check CORS_ALLOW_ALL_ORIGINS setting and ensure frontend URL is allowed.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="error">JWT Token Issues</Typography>
                    <Typography variant="body2">
                      Verify JWT settings and ensure tokens are being sent in Authorization header.
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, background: 'rgba(244, 67, 54, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="error">Media Upload Issues</Typography>
                    <Typography variant="body2">
                      Configure Cloudinary settings properly for media storage functionality.
                    </Typography>
                  </CardContent>
                </Card>
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

function App() {
  return (
    <GroupProvider>
      <Router>
        <AuthGate />
        <CssBaseline />
        <AppBar position="static" sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                🚀 Bonded
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Social Platform
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Documentation />
            <LogoutButton />
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, mb: 4 }}>
          <GroupSelector />
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-credentials" element={<CredentialChange />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </Container>
      </Router>
    </GroupProvider>
  );
}

export default App;
