import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../config/api';

interface AnniversaryCelebration {
  id: number;
  title: string;
  description: string;
  anniversary_date: string;
  celebration_date: string;
  anniversary_type: string;
  message_count: number;
  has_messaged: boolean;
  user_message: any;
}

interface AnniversaryMessage {
  id: number;
  from_user: number;
  from_user_username: string;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

const AnniversaryCelebrations: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [celebrations, setCelebrations] = useState<AnniversaryCelebration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCelebration, setNewCelebration] = useState({
    title: '',
    description: '',
    anniversary_date: '',
    celebration_date: '',
    anniversary_type: 'custom',
  });
  const [selectedCelebration, setSelectedCelebration] = useState<AnniversaryCelebration | null>(null);
  const [messages, setMessages] = useState<AnniversaryMessage[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageAnon, setMessageAnon] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchCelebrations();
    // eslint-disable-next-line
  }, [groupId]);

  const fetchCelebrations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/games/anniversary-celebrations/?group=${groupId}`);
      setCelebrations(res.data);
    } catch (err: any) {
      setError('Failed to load anniversary celebrations.');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    try {
      await apiClient.post('/games/anniversary-celebrations/', {
        ...newCelebration,
        group: groupId
      });
      setShowCreate(false);
      setNewCelebration({ title: '', description: '', anniversary_date: '', celebration_date: '', anniversary_type: 'custom' });
      fetchCelebrations();
    } catch (err: any) {
      setError('Failed to create anniversary celebration.');
    }
  };

  const openMessages = async (celebration: AnniversaryCelebration) => {
    setSelectedCelebration(celebration);
    setMessageLoading(true);
    setMessageError('');
    try {
      const res = await apiClient.get(`/games/anniversary-celebrations/${celebration.id}/messages/`);
      setMessages(res.data);
    } catch (err: any) {
      setMessageError('Failed to load messages.');
    }
    setMessageLoading(false);
  };

  const handleSendMessage = async () => {
    if (!selectedCelebration) return;
    setSendingMessage(true);
    setMessageError('');
    try {
      await apiClient.post(`/games/anniversary-celebrations/${selectedCelebration.id}/message/`, {
        message: messageText,
        is_anonymous: messageAnon
      });
      setMessageText('');
      setMessageAnon(false);
      openMessages(selectedCelebration);
      fetchCelebrations();
    } catch (err: any) {
      setMessageError('Failed to send message.');
    }
    setSendingMessage(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Anniversary Celebrations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreate(true)}>
          Create
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : celebrations.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
          <FavoriteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No anniversary celebrations yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create the first anniversary celebration for your group!
          </Typography>
        </Card>
      ) : (
        <List>
          {celebrations.map((celebration) => (
            <ListItem key={celebration.id} disablePadding>
              <ListItemButton onClick={() => openMessages(celebration)}>
                <ListItemText
                  primary={`💖 ${celebration.title} - ${celebration.celebration_date}`}
                  secondary={`Messages: ${celebration.message_count}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create Celebration Dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Anniversary Celebration</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newCelebration.title}
            onChange={e => setNewCelebration({ ...newCelebration, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={newCelebration.description}
            onChange={e => setNewCelebration({ ...newCelebration, description: e.target.value })}
          />
          <TextField
            label="Anniversary Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newCelebration.anniversary_date}
            onChange={e => setNewCelebration({ ...newCelebration, anniversary_date: e.target.value })}
          />
          <TextField
            label="Celebration Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newCelebration.celebration_date}
            onChange={e => setNewCelebration({ ...newCelebration, celebration_date: e.target.value })}
          />
          <TextField
            label="Anniversary Type"
            select
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
            value={newCelebration.anniversary_type}
            onChange={e => setNewCelebration({ ...newCelebration, anniversary_type: e.target.value })}
          >
            <option value="group_creation">Group Creation</option>
            <option value="first_post">First Post</option>
            <option value="member_milestone">Member Milestone</option>
            <option value="custom">Custom Anniversary</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Messages Dialog */}
      <Dialog open={!!selectedCelebration} onClose={() => setSelectedCelebration(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Anniversary Messages for {selectedCelebration?.title}</DialogTitle>
        <DialogContent>
          {messageError && <Alert severity="error" sx={{ mb: 2 }}>{messageError}</Alert>}
          {messageLoading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress /></Box>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={msg.is_anonymous ? 'Anonymous' : msg.from_user_username}
                    secondary={msg.message}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Box mt={2}>
            <TextField
              label="Your Message"
              fullWidth
              multiline
              minRows={2}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageText}
              >
                Send Message
              </Button>
              <Button
                variant={messageAnon ? 'contained' : 'outlined'}
                onClick={() => setMessageAnon(!messageAnon)}
              >
                {messageAnon ? 'Anonymous' : 'Not Anonymous'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCelebration(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnniversaryCelebrations; 