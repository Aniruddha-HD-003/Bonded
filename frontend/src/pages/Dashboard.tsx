import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  Chip, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard as DashboardIcon,
  FileText as PostAddIcon,
  Calendar as EventIcon,
  Trophy as EmojiEventsIcon,
  Paperclip as AttachFileIcon,
  Trash2 as DeleteIcon,
  Send as SendIcon,
  X as CloseIcon,
  Zap as ZapIcon,
  Users as UsersIcon,
  MessageCircle as MessageCircleIcon
} from 'lucide-react';
import apiClient from '../config/api';
import { useGroup } from '../App';
import Comments from '../components/Comments';
import Reactions from '../components/Reactions';

const Dashboard = () => {
  const { selectedGroup } = useGroup();
  
  // State
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [postCounts, setPostCounts] = useState<{[key: number]: {comments: number, reactions: number}}>({});
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [postError, setPostError] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.1 
      } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: easeOut 
      } 
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch data
  const fetchData = useCallback(() => {
    if (!selectedGroup) return;
    setLoading(true);
    
    Promise.all([
      apiClient.get(`/users/groups/${selectedGroup.group_id}/members/`),
      apiClient.get(`/posts/?group=${selectedGroup.group_id}`)
    ])
    .then(([membersRes, postsRes]) => {
      console.log('Dashboard fetchData - Posts response:', postsRes.data);
      console.log('Dashboard fetchData - Posts with media:', postsRes.data?.filter((post: any) => post.media || post.media_url));
      console.log('Dashboard fetchData - Sample post structure:', postsRes.data?.[0]);
      
      setMembers(membersRes.data.members || []);
      setPosts(postsRes.data || []);
      
      // Initialize post counts
      const initialCounts: {[key: number]: {comments: number, reactions: number}} = {};
      postsRes.data?.forEach((post: any) => {
        initialCounts[post.id] = {
          comments: post.comments_count || 0,
          reactions: post.reactions_count || 0
        };
      });
      setPostCounts(initialCounts);
    })
    .catch((error) => {
      console.error('Dashboard fetchData error:', error);
      setMembers([]);
      setPosts([]);
      setPostCounts({});
    })
    .finally(() => setLoading(false));
  }, [selectedGroup]);

  useEffect(() => {
    fetchData();
  }, [selectedGroup, fetchData]);

  // Post handlers
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setPostError('Please select a valid image or video file.');
        return;
      }
      
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setPostError('File size must be under 50MB.');
        return;
      }
      
      setSelectedFile(file);
      setPostError('');
      
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };



  const handleDeletePost = (post: any) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await apiClient.delete(`/posts/${postToDelete.id}/`);
      fetchData();
    } catch (err: any) {
      console.error('Failed to delete post:', err);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  // Function to update post counts
  const updatePostCounts = (postId: number, type: 'comments' | 'reactions', count: number) => {
    setPostCounts(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [type]: count
      }
    }));
  };

  if (!selectedGroup) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
          textAlign: 'center'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Orbitron, monospace',
              color: '#00ff88',
              fontWeight: 700
            }}>
              🎯 Please select a group to view its quantum dashboard
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh' 
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress sx={{ color: '#00ff88' }} size={60} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Quantum Header */}
          <motion.div variants={cardVariants}>
            <Card sx={{
              background: 'rgba(26, 26, 58, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <DashboardIcon style={{ width: 32, height: 32, color: '#00ff88', marginRight: 12 }} />
                  </motion.div>
                  <Typography variant="h4" sx={{ 
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}>
                    {selectedGroup.group_name}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ 
                  color: '#00ff88',
                  fontFamily: 'Orbitron, monospace'
                }}>
                  Welcome back, {selectedGroup.username}! 🚀
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quantum Navigation */}
          <motion.div variants={cardVariants}>
            <Card sx={{
              background: 'rgba(26, 26, 58, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
              mb: 4
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 700,
                  color: '#ffffff',
                  mb: 2
                }}>
                  Quantum Navigation
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/games"
                      variant="contained"
                      startIcon={<EmojiEventsIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                        color: '#0a0a1a',
                        fontWeight: 600,
                        fontFamily: 'Orbitron, monospace',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 25px rgba(0, 255, 136, 0.4)'
                        }
                      }}
                    >
                      Games & Challenges
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/posts"
                      variant="outlined"
                      startIcon={<PostAddIcon />}
                      sx={{
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                        color: '#00ff88',
                        fontFamily: 'Orbitron, monospace',
                        '&:hover': {
                          borderColor: '#00ff88',
                          backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        }
                      }}
                    >
                      View All Posts
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/events"
                      variant="outlined"
                      startIcon={<EventIcon />}
                      sx={{
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                        color: '#00ff88',
                        fontFamily: 'Orbitron, monospace',
                        '&:hover': {
                          borderColor: '#00ff88',
                          backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        }
                      }}
                    >
                      View All Events
                    </Button>
                  </motion.div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 3fr' }, gap: 4 }}>
            {/* Members Section */}
            <motion.div variants={cardVariants}>
              <Card sx={{
                background: 'rgba(26, 26, 58, 0.3)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
                height: 'fit-content'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <UsersIcon style={{ width: 24, height: 24, color: '#00ff88', marginRight: 8 }} />
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}>
                      Quantum Members
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    <AnimatePresence>
                      {members.map((member, index) => (
                        <motion.div
                          key={member.user_id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card sx={{
                            background: 'rgba(26, 26, 58, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            borderRadius: 2,
                            mb: 1.5
                          }}>
                            <ListItem>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Avatar sx={{ 
                                  mr: 1.5,
                                  background: 'linear-gradient(135deg, #00ff88 0%, #0088ff 100%)',
                                  fontWeight: 700,
                                  color: '#0a0a1a'
                                }}>
                                  {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                              </motion.div>
                              <ListItemText 
                                primary={
                                  <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600,
                                    color: '#ffffff'
                                  }}>
                                    {member.username}
                                  </Typography>
                                } 
                                secondary={
                                  <Chip 
                                    label={member.role} 
                                    size="small" 
                                    sx={{ 
                                      backgroundColor: 'rgba(0, 255, 136, 0.2)',
                                      color: '#00ff88',
                                      fontWeight: 700,
                                      mt: 0.5
                                    }} 
                                  />
                                } 
                              />
                            </ListItem>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Section */}
            <motion.div variants={cardVariants}>
              <Card sx={{
                background: 'rgba(26, 26, 58, 0.3)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MessageCircleIcon style={{ width: 24, height: 24, color: '#00ff88', marginRight: 8 }} />
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}>
                      Quantum Posts
                    </Typography>
                  </Box>
                  
                  {/* Create Post Form */}
                  <Card sx={{
                    background: 'rgba(26, 26, 58, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: 2,
                    mb: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box component="form" onSubmit={handlePostSubmit}>
                        <TextField
                          label="Share something quantum..."
                          value={newPost}
                          onChange={e => setNewPost(e.target.value)}
                          fullWidth
                          multiline
                          rows={3}
                          sx={{
                            mb: 2,
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
                        
                        {/* File Preview */}
                        {filePreview && (
                          <Box sx={{ mb: 2, position: 'relative' }}>
                            {selectedFile?.type.startsWith('image/') ? (
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  borderRadius: 8,
                                  maxHeight: 192,
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <video 
                                src={filePreview} 
                                controls 
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  borderRadius: 8,
                                  maxHeight: 192
                                }}
                              />
                            )}
                            <Button
                              onClick={removeFile}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: '#ef4444',
                                color: 'white',
                                minWidth: 'auto',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                  backgroundColor: '#dc2626'
                                }
                              }}
                              size="small"
                            >
                              <CloseIcon style={{ width: 16, height: 16 }} />
                            </Button>
                          </Box>
                        )}
                        
                        {/* File Upload */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            sx={{
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                              color: '#00ff88',
                              fontFamily: 'Orbitron, monospace',
                              '&:hover': {
                                borderColor: '#00ff88',
                                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                              }
                            }}
                          >
                            Attach Media
                            <input
                              type="file"
                              hidden
                              accept="image/*,video/*"
                              onChange={handleFileSelect}
                            />
                          </Button>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<SendIcon />}
                              sx={{
                                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                                color: '#0a0a1a',
                                fontWeight: 600,
                                fontFamily: 'Orbitron, monospace',
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 10px 25px rgba(0, 255, 136, 0.4)'
                                }
                              }}
                            >
                              Quantum Post
                            </Button>
                          </motion.div>
                        </Box>
                        
                        {postError && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {postError}
                          </Alert>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Posts List */}
                  <AnimatePresence>
                    {posts && posts.length > 0 ? posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        style={{ marginBottom: 24 }}
                      >
                        <Card sx={{
                          background: 'rgba(26, 26, 58, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ 
                                  mr: 1.5,
                                  background: 'linear-gradient(135deg, #00ff88 0%, #0088ff 100%)',
                                  color: '#0a0a1a',
                                  fontWeight: 700
                                }}>
                                  {(post.username || post.author_username || 'U').charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600,
                                    color: '#ffffff'
                                  }}>
                                    {post.username || post.author_username || 'Unknown User'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                    {new Date(post.created_at).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Box>
                              {(post.username || post.author_username) === selectedGroup.username && (
                                <Button
                                  onClick={() => handleDeletePost(post)}
                                  size="small"
                                  sx={{ color: '#f87171', '&:hover': { color: '#fca5a5' } }}
                                >
                                  <DeleteIcon style={{ width: 16, height: 16 }} />
                                </Button>
                              )}
                            </Box>
                            
                            <Typography variant="body1" sx={{ color: '#d1d5db', mb: 2 }}>
                              {post.text}
                            </Typography>
                            
                            {(post.media_url || post.media) && (
                              <Box sx={{ mb: 2 }}>
                                {(() => {
                                  // Use media_url if available, otherwise fallback to media
                                  const mediaUrl = post.media_url || post.media;
                                  const mediaType = post.media_type;
                                  
                                  // Determine media type if not provided
                                  let isImage = false;
                                  let isVideo = false;
                                  
                                  if (mediaType) {
                                    isImage = mediaType === 'image';
                                    isVideo = mediaType === 'video';
                                  } else {
                                    // Fallback detection based on URL
                                    isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl) || 
                                             mediaUrl.includes('image/') || 
                                             mediaUrl.includes('image%2F');
                                    isVideo = /\.(mp4|avi|mov|webm|mkv)$/i.test(mediaUrl) || 
                                             mediaUrl.includes('video/') || 
                                             mediaUrl.includes('video%2F');
                                  }
                                  
                                  if (isImage) {
                                    return (
                                      <img 
                                        src={mediaUrl} 
                                        alt="Post media" 
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '400px',
                                          height: 'auto',
                                          borderRadius: 8,
                                          objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                          console.error('Failed to load image:', mediaUrl);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    );
                                  } else if (isVideo) {
                                    return (
                                      <video 
                                        src={mediaUrl} 
                                        controls 
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '400px',
                                          height: 'auto',
                                          borderRadius: 8
                                        }}
                                        onError={(e) => {
                                          console.error('Failed to load video:', mediaUrl);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    );
                                  } else {
                                    // Fallback for unknown media types
                                    return (
                                      <Box sx={{ 
                                        p: 2, 
                                        bgcolor: 'rgba(0, 255, 136, 0.1)', 
                                        borderRadius: 2,
                                        border: '1px solid rgba(0, 255, 136, 0.3)',
                                        textAlign: 'center'
                                      }}>
                                        <Typography variant="body2" sx={{ color: '#00ff88', mb: 1 }}>
                                          Media content available
                                        </Typography>
                                        <Button 
                                          variant="outlined" 
                                          size="small" 
                                          sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                                          onClick={() => window.open(mediaUrl, '_blank')}
                                        >
                                          Open Media
                                        </Button>
                                      </Box>
                                    );
                                  }
                                })()}
                              </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <ZapIcon style={{ width: 16, height: 16, color: '#00ff88' }} />
                              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                {postCounts[post.id]?.reactions || 0} reactions
                              </Typography>
                              <MessageCircleIcon style={{ width: 16, height: 16, color: '#00ff88' }} />
                              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                {postCounts[post.id]?.comments || 0} comments
                              </Typography>
                            </Box>
                            
                            {/* Reactions Component */}
                            <Reactions 
                              postId={post.id} 
                              currentUser={selectedGroup.username} 
                              onReactionChange={(count) => updatePostCounts(post.id, 'reactions', count)}
                            />
                            
                            {/* Comments Component */}
                            <Comments 
                              postId={post.id} 
                              onCommentChange={(count) => updatePostCounts(post.id, 'comments', count)}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" sx={{ 
                          color: '#00ff88',
                          fontFamily: 'Orbitron, monospace'
                        }}>
                          No posts yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
                          Be the first to share something quantum! 🚀
                        </Typography>
                      </Box>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={cancelDeletePost}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 58, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Orbitron, monospace',
          color: '#00ff88'
        }}>
          Confirm Quantum Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#e0e0e0' }}>
            Are you sure you want to delete this quantum post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeletePost} sx={{ color: '#9ca3af' }}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDeletePost}
            sx={{
              background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
              color: '#0a0a1a',
              fontWeight: 600,
              fontFamily: 'Orbitron, monospace',
              '&:hover': {
                background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 