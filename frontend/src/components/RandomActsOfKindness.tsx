import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, List, ListItem, ListItemText, ListItemButton, Checkbox, FormControlLabel } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../config/api';

interface RandomActOfKindness {
  id: number;
  title: string;
  description: string;
  target_user: number | null;
  target_user_username: string | null;
  is_group_wide: boolean;
  points_reward: number;
  created_by_username: string;
  completed_acts_count: number;
  has_completed: boolean;
  user_completion: any;
}

interface KindnessAct {
  id: number;
  from_user: number;
  from_user_username: string;
  to_user: number | null;
  to_user_username: string | null;
  description: string;
  is_anonymous: boolean;
  points_earned: number;
  completed_at: string;
}

const RandomActsOfKindness: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [acts, setActs] = useState<RandomActOfKindness[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newAct, setNewAct] = useState({
    title: '',
    description: '',
    is_group_wide: false,
    target_user: '',
    points_reward: 15,
  });
  const [selectedAct, setSelectedAct] = useState<RandomActOfKindness | null>(null);
  const [completions, setCompletions] = useState<KindnessAct[]>([]);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const [completionDesc, setCompletionDesc] = useState('');
  const [completionAnon, setCompletionAnon] = useState(false);
  const [completionToUser, setCompletionToUser] = useState('');
  const [sendingCompletion, setSendingCompletion] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchActs();
    // eslint-disable-next-line
  }, [groupId]);

  const fetchActs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/games/random-acts-kindness/?group=${groupId}`);
      setActs(res.data);
    } catch (err: any) {
      setError('Failed to load acts of kindness.');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    try {
      await apiClient.post('/games/random-acts-kindness/', {
        ...newAct,
        group: groupId,
        target_user: newAct.is_group_wide ? null : newAct.target_user || null
      });
      setShowCreate(false);
      setNewAct({ title: '', description: '', is_group_wide: false, target_user: '', points_reward: 15 });
      fetchActs();
    } catch (err: any) {
      setError('Failed to create act of kindness.');
    }
  };

  const openCompletions = async (act: RandomActOfKindness) => {
    setSelectedAct(act);
    setCompletionLoading(true);
    setCompletionError('');
    try {
      const res = await apiClient.get(`/games/random-acts-kindness/${act.id}/completions/`);
      setCompletions(res.data);
    } catch (err: any) {
      setCompletionError('Failed to load completions.');
    }
    setCompletionLoading(false);
  };

  const handleComplete = async () => {
    if (!selectedAct) return;
    setSendingCompletion(true);
    setCompletionError('');
    setSuccessMsg('');
    try {
      await apiClient.post(`/games/random-acts-kindness/${selectedAct.id}/complete/`, {
        description: completionDesc,
        is_anonymous: completionAnon,
        to_user: selectedAct.is_group_wide ? null : completionToUser || null
      });
      setCompletionDesc('');
      setCompletionAnon(false);
      setCompletionToUser('');
      setSuccessMsg('Kindness act completed successfully!');
      openCompletions(selectedAct);
      fetchActs();
    } catch (err: any) {
      setCompletionError('Failed to complete act of kindness.');
    }
    setSendingCompletion(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Random Acts of Kindness</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreate(true)}>
          Create
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : acts.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
          <VolunteerActivismIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No acts of kindness yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create the first act of kindness for your group!
          </Typography>
        </Card>
      ) : (
        <List>
          {acts.map((act) => (
            <ListItem key={act.id} disablePadding>
              <ListItemButton onClick={() => openCompletions(act)}>
                <ListItemText
                  primary={`🤝 ${act.title} ${act.is_group_wide ? '(Group-wide)' : act.target_user_username ? `→ ${act.target_user_username}` : ''}`}
                  secondary={`Points: ${act.points_reward} | Completed: ${act.completed_acts_count}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create Act Dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Random Act of Kindness</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newAct.title}
            onChange={e => setNewAct({ ...newAct, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={newAct.description}
            onChange={e => setNewAct({ ...newAct, description: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAct.is_group_wide}
                onChange={e => setNewAct({ ...newAct, is_group_wide: e.target.checked, target_user: '' })}
              />
            }
            label="Group-wide act (not targeted at a specific user)"
          />
          {!newAct.is_group_wide && (
            <TextField
              label="Target User ID (optional)"
              fullWidth
              margin="normal"
              value={newAct.target_user}
              onChange={e => setNewAct({ ...newAct, target_user: e.target.value })}
            />
          )}
          <TextField
            label="Points Reward"
            type="number"
            fullWidth
            margin="normal"
            value={newAct.points_reward}
            onChange={e => setNewAct({ ...newAct, points_reward: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Completions Dialog */}
      <Dialog open={!!selectedAct} onClose={() => setSelectedAct(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Completions for {selectedAct?.title}</DialogTitle>
        <DialogContent>
          {completionError && <Alert severity="error" sx={{ mb: 2 }}>{completionError}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {completionLoading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress /></Box>
          ) : (
            <List>
              {completions.map((comp) => (
                <ListItem key={comp.id}>
                  <ListItemText
                    primary={comp.is_anonymous ? 'Anonymous' : comp.from_user_username}
                    secondary={comp.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Box mt={2}>
            <TextField
              label="Describe your act of kindness"
              fullWidth
              multiline
              minRows={2}
              value={completionDesc}
              onChange={e => setCompletionDesc(e.target.value)}
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={completionAnon}
                  onChange={e => setCompletionAnon(e.target.checked)}
                />
              }
              label="Complete anonymously"
            />
            {!selectedAct?.is_group_wide && (
              <TextField
                label="Target User ID (optional)"
                fullWidth
                margin="normal"
                value={completionToUser}
                onChange={e => setCompletionToUser(e.target.value)}
              />
            )}
            <Button
              variant="contained"
              onClick={handleComplete}
              disabled={sendingCompletion || !completionDesc}
              sx={{ mt: 2 }}
            >
              Complete Act
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAct(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RandomActsOfKindness; 