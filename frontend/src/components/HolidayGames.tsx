import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, List, ListItem, ListItemText, ListItemButton, MenuItem } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../config/api';

interface HolidayGame {
  id: number;
  holiday_type: string;
  title: string;
  description: string;
  game_type: string;
  start_date: string;
  end_date: string;
  points_reward: number;
  created_by_username: string;
  participant_count: number;
  has_participated: boolean;
  user_participation: any;
}

const HOLIDAY_TYPES = [
  { value: 'christmas', label: 'Christmas' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'valentines', label:  'Valentine\'s Day' },
  { value: 'easter', label: 'Easter' },
  { value: 'thanksgiving', label: 'Thanksgiving' },
  { value: 'new_year', label: 'New Year' },
  { value: 'custom', label: 'Custom Holiday' },
];

const GAME_TYPES = [
  { value: 'gift_exchange', label: 'Gift Exchange' },
  { value: 'costume_contest', label: 'Costume Contest' },
  { value: 'scavenger_hunt', label: 'Scavenger Hunt' },
  { value: 'trivia', label: 'Holiday Trivia' },
  { value: 'photo_contest', label: 'Photo Contest' },
  { value: 'custom', label: 'Custom Game' },
];

const HolidayGames: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [games, setGames] = useState<HolidayGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newGame, setNewGame] = useState({
    holiday_type: 'custom',
    title: '',
    description: '',
    game_type: 'custom',
    start_date: '',
    end_date: '',
    points_reward: 20,
  });
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line
  }, [groupId]);

  const fetchGames = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/games/holiday-games/?group=${groupId}`);
      setGames(res.data);
    } catch (err: any) {
      setError('Failed to load holiday games.');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    try {
      await apiClient.post('/games/holiday-games/', {
        ...newGame,
        group: groupId
      });
      setShowCreate(false);
      setNewGame({ holiday_type: 'custom', title: '', description: '', game_type: 'custom', start_date: '', end_date: '', points_reward: 20 });
      fetchGames();
    } catch (err: any) {
      setError('Failed to create holiday game.');
    }
  };

  const handleJoin = async (gameId: number) => {
    setJoiningId(gameId);
    setJoinError('');
    setJoinSuccess('');
    try {
      await apiClient.post(`/games/holiday-games/${gameId}/join/`, {});
      setJoinSuccess('Successfully joined the holiday game!');
      fetchGames();
    } catch (err: any) {
      setJoinError('Failed to join the holiday game.');
    }
    setJoiningId(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Holiday Games</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreate(true)}>
          Create
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : games.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
          <FavoriteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No holiday games yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create the first holiday game for your group!
          </Typography>
        </Card>
      ) : (
        <List>
          {games.map((game) => (
            <ListItem key={game.id} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={`🎉 ${game.title} (${HOLIDAY_TYPES.find(h => h.value === game.holiday_type)?.label || game.holiday_type})`}
                  secondary={`Type: ${GAME_TYPES.find(g => g.value === game.game_type)?.label || game.game_type} | Participants: ${game.participant_count}`}
                />
                {game.has_participated ? (
                  <Button variant="outlined" disabled>Joined</Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleJoin(game.id)}
                    disabled={joiningId === game.id}
                  >
                    {joiningId === game.id ? <CircularProgress size={20} /> : 'Join'}
                  </Button>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create Holiday Game Dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Holiday Game</DialogTitle>
        <DialogContent>
          <TextField
            label="Holiday Type"
            select
            fullWidth
            margin="normal"
            value={newGame.holiday_type}
            onChange={e => setNewGame({ ...newGame, holiday_type: e.target.value })}
          >
            {HOLIDAY_TYPES.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newGame.title}
            onChange={e => setNewGame({ ...newGame, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={newGame.description}
            onChange={e => setNewGame({ ...newGame, description: e.target.value })}
          />
          <TextField
            label="Game Type"
            select
            fullWidth
            margin="normal"
            value={newGame.game_type}
            onChange={e => setNewGame({ ...newGame, game_type: e.target.value })}
          >
            {GAME_TYPES.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date & Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newGame.start_date}
            onChange={e => setNewGame({ ...newGame, start_date: e.target.value })}
          />
          <TextField
            label="End Date & Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newGame.end_date}
            onChange={e => setNewGame({ ...newGame, end_date: e.target.value })}
          />
          <TextField
            label="Points Reward"
            type="number"
            fullWidth
            margin="normal"
            value={newGame.points_reward}
            onChange={e => setNewGame({ ...newGame, points_reward: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Join Success/Error Alerts */}
      {joinError && <Alert severity="error" sx={{ mt: 2 }}>{joinError}</Alert>}
      {joinSuccess && <Alert severity="success" sx={{ mt: 2 }}>{joinSuccess}</Alert>}
    </Box>
  );
};

export default HolidayGames; 