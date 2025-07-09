import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import apiClient from '../config/api';

interface ReactionsProps {
  postId: number;
  currentUser: string;
  onReactionChange?: (count: number) => void;
}

const Reactions: React.FC<ReactionsProps> = ({ postId, currentUser, onReactionChange }) => {
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
      // Trigger parent refresh to update reaction count
      if (onReactionChange) {
        setTimeout(() => {
          // Calculate the new count after the reaction change
          const newCount = userReaction === type ? reactions.length - 1 : reactions.length + 1;
          onReactionChange(Math.max(0, newCount));
        }, 500); // Small delay to ensure backend processes the change
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const reactionTypes = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
  const reactionEmojis = { like: '👍', love: '❤️', laugh: '😂', wow: '😮', sad: '😢', angry: '😠' };
  const reactionColors = { 
    like: '#00ff88', 
    love: '#ff6b9d', 
    laugh: '#ffd93d', 
    wow: '#6bcf7f', 
    sad: '#4d9de0', 
    angry: '#e15759' 
  };

  return (
    <Box sx={{ mt: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          background: 'rgba(26, 26, 58, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 3,
          p: 2,
          boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)'
        }}>
          {reactionTypes.map((type, index) => {
            const count = reactions.filter(r => r.type === type).length;
            const isActive = userReaction === type;
            const color = reactionColors[type as keyof typeof reactionColors];
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => handleReact(type)}
                  size="small"
                  sx={{
                    background: isActive 
                      ? `linear-gradient(45deg, ${color} 0%, ${color}dd 100%)`
                      : 'rgba(0, 255, 136, 0.1)',
                    color: isActive ? '#0a0a1a' : '#00ff88',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    minWidth: 'fit-content',
                    border: isActive 
                      ? `2px solid ${color}`
                      : '2px solid rgba(0, 255, 136, 0.3)',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive 
                      ? `0 4px 16px ${color}40`
                      : '0 2px 8px rgba(0, 255, 136, 0.2)',
                    '&:hover': {
                      background: isActive 
                        ? `linear-gradient(45deg, ${color}dd 0%, ${color} 100%)`
                        : 'rgba(0, 255, 136, 0.2)',
                      borderColor: color,
                      boxShadow: `0 6px 20px ${color}50`,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ 
                    mr: 0.5, 
                    fontSize: '1.1rem',
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
                  }}>
                    {reactionEmojis[type as keyof typeof reactionEmojis]}
                  </Typography>
                  {count > 0 && (
                    <Typography variant="caption" sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      textShadow: isActive ? '0 0 8px rgba(255,255,255,0.8)' : 'none'
                    }}>
                      {count}
                    </Typography>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </Box>
      </motion.div>
      
      {reactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: 1,
            color: 'rgba(0, 255, 136, 0.6)',
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.8rem'
          }}>
            No reactions yet. Show some quantum love! ⚡
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default Reactions; 