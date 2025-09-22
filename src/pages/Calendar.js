import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import firestoreService from '../services/firestoreService';
import { scheduleNotifications } from '../services/notificationService';
import { useAuth } from '../components/Auth/AuthProvider';

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', description: '' });

  const refresh = useCallback(async () => {
    if (!user) return;
    const res = await firestoreService.listCalendarEvents(user.uid);
    if (res.success) setEvents(res.events);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleAdd = async () => {
    if (!user || !form.title || !form.date) return;
    const startIso = form.time ? `${form.date}T${form.time}` : `${form.date}T00:00`;
    const res = await firestoreService.createCalendarEvent(user.uid, {
      title: form.title,
      description: form.description,
      location: form.location,
      start: startIso,
    });
    if (res.success) {
      scheduleNotifications(startIso, form.title, form.description || 'Event reminder');
      setForm({ title: '', date: '', time: '', location: '', description: '' });
      refresh();
    }
  };

  const handleDelete = async (id) => {
    await firestoreService.deleteCalendarEvent(id);
    refresh();
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Calendar</Typography>
      <Typography variant="body1" color="text.secondary">Add events and get cross-device notifications.</Typography>

      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Title" fullWidth value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Date" type="date" fullWidth InputLabelProps={{shrink:true}} value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Time" type="time" fullWidth InputLabelProps={{shrink:true}} value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Location" fullWidth value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline rows={2} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>Add Event</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <List>
            {events.map((ev) => (
              <ListItem key={ev.id} secondaryAction={
                <IconButton edge="end" onClick={()=>handleDelete(ev.id)}><DeleteIcon/></IconButton>
              }>
                <ListItemText
                  primary={`${ev.title} • ${ev.start ? new Date(ev.start).toLocaleString() : ''}`}
                  secondary={ev.location ? `${ev.location} — ${ev.description || ''}` : (ev.description || '')}
                />
              </ListItem>
            ))}
            {events.length === 0 && (
              <ListItem>
                <ListItemText primary="No events yet" secondary="Add your first event above" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}


