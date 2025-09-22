import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FlightTakeoff as FlightIcon,
  Hotel as HotelIcon,
  Cloud as WeatherIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../components/Auth/AuthProvider';
import firestoreService from '../services/firestoreService';
import { addEvent as addCalendarEvent } from '../services/calendarService';
import { scheduleNotifications } from '../services/notificationService';

const fakeFetchWeather = async (destination, dateRange) => {
  // Placeholder: Replace with real weather API later
  await new Promise(r => setTimeout(r, 600));
  return {
    summary: 'Mild with occasional showers',
    avgTempC: 22,
    rainChancePct: 30,
  };
};

const fakeSearchGroundedDeals = async (destination, budget) => {
  // Placeholder: Replace with real scraping/grounding later
  await new Promise(r => setTimeout(r, 800));
  return {
    stays: [
      { name: 'Central Comfort Inn', pricePerNight: 85, rating: 4.3 },
      { name: 'Budget Suites', pricePerNight: 60, rating: 4.0 },
    ],
    attractions: [
      { name: 'Old Town Walk', cost: 0 },
      { name: 'City Museum', cost: 15 },
    ],
    flights: [
      { airline: 'AirFast', price: 320 },
      { airline: 'SkyWays', price: 350 },
    ],
  };
};

const buildPlan = ({ destination, agenda, budget, startDate, endDate }, weather, deals) => {
  const nights = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000*60*60*24)));
  const stay = deals.stays[0];
  const flight = deals.flights[0];
  const estimatedCost = flight.price + nights * stay.pricePerNight + deals.attractions.reduce((s,a)=>s+(a.cost||0),0);
  const budgetNote = budget ? (estimatedCost <= budget ? 'Within budget' : 'Exceeds budget') : 'No budget provided';
  // weatherFlag can be used to suggest alternatives; not required for rendering
  const alternatives = weather.rainChancePct > 50 ? [`Consider adjusting dates for lower rain chance`, `Pack rain gear`] : [`Consider off-peak attractions for better rates`];
  return {
    destination,
    agenda,
    dates: { startDate, endDate, nights },
    weather,
    stay,
    flight,
    attractions: deals.attractions,
    estimatedCost,
    budgetNote,
    recommendations: alternatives,
    status: 'proposed',
    createdAt: new Date().toISOString(),
  };
};

export default function TripPlanner() {
  const { user } = useAuth();
  const [form, setForm] = useState({ destination: '', agenda: '', budget: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async () => {
    setError(''); setSuccess(''); setPlan(null);
    if (!form.destination || !form.startDate || !form.endDate) {
      setError('Destination and date range are required.');
      return;
    }
    setLoading(true);
    try {
      const weather = await fakeFetchWeather(form.destination, { start: form.startDate, end: form.endDate });
      const deals = await fakeSearchGroundedDeals(form.destination, Number(form.budget) || undefined);
      const built = buildPlan(form, weather, deals);
      setPlan(built);
    } catch (e) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (accept) => {
    if (!plan || !user) { setError('You must be logged in to save a plan.'); return; }
    try {
      const payload = { ...plan, status: accept ? 'accepted' : 'rejected' };
      const res = await firestoreService.createTripPlan(user.uid, payload);
      if (res.success) {
        setSuccess(accept ? 'Plan accepted and saved.' : 'Plan rejected and saved.');
        if (accept) {
          // Add to calendar and schedule notifications
          await addCalendarEvent({
            title: `Trip to ${plan.destination}`,
            description: plan.agenda || 'Trip plan',
            start: plan.dates.startDate,
            end: plan.dates.endDate,
            location: plan.destination,
          });
          scheduleNotifications(plan.dates.startDate, `Upcoming Trip: ${plan.destination}`, 'Your trip starts soon.');
        }
      } else {
        setError(res.error || 'Failed to save plan.');
      }
    } catch (e) {
      setError('Failed to save plan.');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Trip Planner</Typography>
      <Typography variant="body1" color="text.secondary">Plan trips with budget, weather, and optimal suggestions.</Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Destination" fullWidth value={form.destination} onChange={(e)=>setForm({...form,destination:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField label="Agenda / Purpose" fullWidth value={form.agenda} onChange={(e)=>setForm({...form,agenda:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Budget (optional)" type="number" fullWidth value={form.budget} onChange={(e)=>setForm({...form,budget:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Start Date" type="date" fullWidth InputLabelProps={{shrink:true}} value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="End Date" type="date" fullWidth InputLabelProps={{shrink:true}} value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<ExploreIcon />} onClick={handleGenerate} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Generate Plan'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Proposed Itinerary</Typography>
              <Chip icon={<WeatherIcon />} label={`Weather: ${plan.weather.summary}, ${plan.weather.avgTempC}°C, Rain ${plan.weather.rainChancePct}%`} sx={{ mr: 1, mb: 1 }} />
              <Chip icon={<HotelIcon />} label={`Stay: ${plan.stay.name} ($${plan.stay.pricePerNight}/night)`} sx={{ mr: 1, mb: 1 }} />
              <Chip icon={<FlightIcon />} label={`Flight: ${plan.flight.airline} ($${plan.flight.price})`} sx={{ mr: 1, mb: 1 }} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>Attractions:</Typography>
              <ul>
                {plan.attractions.map((a, idx) => (
                  <li key={idx}><Typography variant="body2">{a.name} {a.cost ? `(cost: $${a.cost})` : ''}</Typography></li>
                ))}
              </ul>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">Estimated Total: ${plan.estimatedCost}</Typography>
              <Typography variant="body2" color="text.secondary">{plan.budgetNote}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Recommendations: {plan.recommendations.join('; ')}</Typography>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="success" startIcon={<AcceptIcon />} onClick={() => handleDecision(true)}>Accept Plan</Button>
                <Button variant="outlined" color="error" startIcon={<RejectIcon />} onClick={() => handleDecision(false)}>Reject Plan</Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}


