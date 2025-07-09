import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, List, ListItem, ListItemText, ListItemButton, IconButton } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../config/api';

interface BirthdayCelebration {
  id: number;
  birthday_person: number;
  birthday_person_username: string;
  birthday_date: string;
  celebration_date: string;
  wish_count: number;
  has_wished: boolean;
  user_wish: any;
}

interface BirthdayWish {
  id: number;
  from_user: number;
  from_user_username: string;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

const BirthdayCelebrations: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [celebrations, setCelebrations] = useState<BirthdayCelebration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCelebration, setNewCelebration] = useState({
    birthday_person: '',
    birthday_date: '',
    celebration_date: ''
  });
  const [selectedCelebration, setSelectedCelebration] = useState<BirthdayCelebration | null>(null);
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishError, setWishError] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishAnon, setWishAnon] = useState(false);
  const [sendingWish, setSendingWish] = useState(false);

  useEffect(() => {
    fetchCelebrations();
    // eslint-disable-next-line
  }, [groupId]);

  const fetchCelebrations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/games/birthday-celebrations/?group=${groupId}`);
      setCelebrations(res.data);
    } catch (err: any) {
      setError('Failed to load birthday celebrations.');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    try {
      await apiClient.post('/games/birthday-celebrations/', {
        ...newCelebration,
        group: groupId
      });
      setShowCreate(false);
      setNewCelebration({ birthday_person: '', birthday_date: '', celebration_date: '' });
      fetchCelebrations();
    } catch (err: any) {
      setError('Failed to create birthday celebration.');
    }
  };

  const openWishes = async (celebration: BirthdayCelebration) => {
    setSelectedCelebration(celebration);
    setWishLoading(true);
    setWishError('');
    try {
      const res = await apiClient.get(`/games/birthday-celebrations/${celebration.id}/wishes/`);
      setWishes(res.data);
    } catch (err: any) {
      setWishError('Failed to load wishes.');
    }
    setWishLoading(false);
  };

  const handleSendWish = async () => {
    if (!selectedCelebration) return;
    setSendingWish(true);
    setWishError('');
    try {
      await apiClient.post(`/games/birthday-celebrations/${selectedCelebration.id}/wish/`, {
        message: wishMessage,
        is_anonymous: wishAnon
      });
      setWishMessage('');
      setWishAnon(false);
      openWishes(selectedCelebration);
      fetchCelebrations();
    } catch (err: any) {
      setWishError('Failed to send wish.');
    }
    setSendingWish(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Birthday Celebrations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreate(true)}>
          Create
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : celebrations.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
          <CakeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No birthday celebrations yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create the first birthday celebration for your group!
          </Typography>
        </Card>
      ) : (
        <List>
          {celebrations.map((celebration) => (
            <ListItem key={celebration.id} disablePadding>
              <ListItemButton onClick={() => openWishes(celebration)}>
                <ListItemText
                  primary={`🎂 ${celebration.birthday_person_username} - ${celebration.celebration_date}`}
                  secondary={`Wishes: ${celebration.wish_count}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create Celebration Dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Birthday Celebration</DialogTitle>
        <DialogContent>
          <TextField
            label="Birthday Person (User ID)"
            fullWidth
            margin="normal"
            value={newCelebration.birthday_person}
            onChange={e => setNewCelebration({ ...newCelebration, birthday_person: e.target.value })}
          />
          <TextField
            label="Birthday Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newCelebration.birthday_date}
            onChange={e => setNewCelebration({ ...newCelebration, birthday_date: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Wishes Dialog */}
      <Dialog open={!!selectedCelebration} onClose={() => setSelectedCelebration(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Birthday Wishes for {selectedCelebration?.birthday_person_username}</DialogTitle>
        <DialogContent>
          {wishError && <Alert severity="error" sx={{ mb: 2 }}>{wishError}</Alert>}
          {wishLoading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress /></Box>
          ) : (
            <List>
              {wishes.map((wish) => (
                <ListItem key={wish.id}>
                  <ListItemText
                    primary={wish.is_anonymous ? 'Anonymous' : wish.from_user_username}
                    secondary={wish.message}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Box mt={2}>
            <TextField
              label="Your Wish"
              fullWidth
              multiline
              minRows={2}
              value={wishMessage}
              onChange={e => setWishMessage(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="contained"
                onClick={handleSendWish}
                disabled={sendingWish || !wishMessage}
              >
                Send Wish
              </Button>
              <Button
                variant={wishAnon ? 'contained' : 'outlined'}
                onClick={() => setWishAnon(!wishAnon)}
              >
                {wishAnon ? 'Anonymous' : 'Not Anonymous'}
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

export default BirthdayCelebrations; 