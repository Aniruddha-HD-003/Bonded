import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Card, 
  Avatar, 
  Typography 
} from '@mui/material';
import { Comment as CommentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiClient from '../config/api';

interface CommentsProps {
  postId: number;
  onCommentChange?: (count: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ postId, onCommentChange }) => {
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
      // Trigger parent refresh to update comment count
      if (onCommentChange) {
        setTimeout(() => onCommentChange(comments.length + 1), 500); // Small delay to ensure backend processes the change
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Comment Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 2,
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 3,
          p: 2,
          boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)'
        }}>
          <TextField
            label="Add a quantum comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            fullWidth
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 255, 136, 0.05)',
                color: '#00ff88',
                fontFamily: 'Orbitron, monospace',
                '& fieldset': { 
                  borderColor: 'rgba(0, 255, 136, 0.3)',
                  borderWidth: '2px'
                },
                '&:hover fieldset': { 
                  borderColor: 'rgba(0, 255, 136, 0.6)',
                  boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
                },
                '&.Mui-focused fieldset': { 
                  borderColor: '#00ff88',
                  boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)'
                }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(0, 255, 136, 0.8)',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 500
              },
              '& .MuiInputBase-input': { 
                color: '#00ff88',
                fontFamily: 'Orbitron, monospace'
              }
            }}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              variant="contained" 
              size="small"
              disabled={loading}
              startIcon={<CommentIcon />}
              sx={{ 
                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                color: '#0a0a1a',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderRadius: 2,
                px: 3,
                py: 1,
                minWidth: 'fit-content',
                boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                  boxShadow: '0 6px 20px rgba(0, 255, 136, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'rgba(0, 255, 136, 0.3)',
                  color: 'rgba(0, 255, 136, 0.6)'
                }
              }}
            >
              {loading ? 'Sending...' : 'Comment'}
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Comments List */}
      <List sx={{ p: 0 }}>
        {comments.map((c: any, index: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card sx={{ 
              mb: 1, 
              background: 'rgba(26, 26, 58, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.15)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 255, 136, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(0, 255, 136, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
                transform: 'translateY(-1px)'
              }
            }}>
              <ListItem sx={{ py: 1.5, px: 2 }}>
                <Avatar sx={{ 
                  mr: 2, 
                  width: 32, 
                  height: 32, 
                  fontSize: '0.9rem',
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#0a0a1a',
                  boxShadow: '0 2px 8px rgba(0, 255, 136, 0.3)'
                }}>
                  {c.user_username?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <ListItemText 
                  primary={
                    <Typography variant="body2" sx={{ 
                      color: '#00ff88',
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                    }}>
                      {c.user_username || 'Unknown User'}
                    </Typography>
                  } 
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: '#e0e0e0',
                      fontFamily: 'Orbitron, monospace',
                      fontSize: '0.85rem',
                      mt: 0.5,
                      lineHeight: 1.4
                    }}>
                      {c.text}
                    </Typography>
                  } 
                />
              </ListItem>
            </Card>
          </motion.div>
        ))}
      </List>
      
      {comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: 2,
            color: 'rgba(0, 255, 136, 0.6)',
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.9rem'
          }}>
            No comments yet. Be the first to share your thoughts! 🚀
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default Comments; 