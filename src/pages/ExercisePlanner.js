import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import Questionnaire from '../components/Questionnaire';
import firestoreService from '../services/firestoreService';
import { useAuth } from '../components/Auth/AuthProvider';

function bmi(height_cm, weight_kg) {
  const h = Number(height_cm) / 100;
  const w = Number(weight_kg);
  if (!h || !w) return null;
  return (w / (h*h)).toFixed(1);
}

export default function ExercisePlanner() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);

  const steps = [
    { label: 'Body', fields: [
      { name: 'height_cm', label: 'Height (cm)', type: 'number' },
      { name: 'weight_kg', label: 'Weight (kg)', type: 'number' },
      { name: 'age', label: 'Age', type: 'number' },
    ]},
    { label: 'Goals', fields: [
      { name: 'goal', label: 'Goal (lose, maintain, gain)' },
      { name: 'experience', label: 'Experience (beginner/intermediate/advanced)' },
      { name: 'days_per_week', label: 'Days per week', type: 'number' },
    ]},
  ];

  const generatePlan = (values) => {
    setProfile(values);
    const routine = values.goal === 'gain' ? 'Strength + Progressive Overload' : values.goal === 'lose' ? 'Cardio + HIIT + Strength' : 'Balanced Strength + Cardio';
    const p = {
      summary: `${values.days_per_week || 3} days/week • ${routine}`,
      day1: 'Full body strength (45m)',
      day2: 'Cardio/HIIT (30m)',
      day3: 'Mobility + Core (30m)',
    };
    setPlan(p);
    if (user) firestoreService.createFinanceProfile(user.uid, { exercise_profile: values, exercise_plan: p });
  };

  const bmiValue = bmi(profile?.height_cm, profile?.weight_kg);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Exercise Planner</Typography>
      <Typography variant="body1" color="text.secondary">Personalized routine with BMI calculation.</Typography>

      <Questionnaire title="Tell us about you" steps={steps} onComplete={generatePlan} />

      {bmiValue && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">BMI: {bmiValue}</Typography>
          </CardContent>
        </Card>
      )}

      {plan && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {Object.entries(plan).map(([k,v]) => (
                <Grid item xs={12} md={6} key={k}>
                  <Chip label={k.toUpperCase()} sx={{ mb: 1 }} />
                  <Typography variant="body2">{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}


