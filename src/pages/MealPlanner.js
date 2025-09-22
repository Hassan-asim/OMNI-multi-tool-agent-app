import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import Questionnaire from '../components/Questionnaire';
import firestoreService from '../services/firestoreService';
import { useAuth } from '../components/Auth/AuthProvider';

export default function MealPlanner() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);

  const steps = [
    { label: 'Basics', fields: [
      { name: 'age', label: 'Age', type: 'number' },
      { name: 'height_cm', label: 'Height (cm)', type: 'number' },
      { name: 'weight_kg', label: 'Weight (kg)', type: 'number' },
    ]},
    { label: 'Preferences', fields: [
      { name: 'diet', label: 'Diet Type (e.g., vegan, keto)' },
      { name: 'allergies', label: 'Allergies (comma separated)' },
      { name: 'calories', label: 'Daily Calories Target', type: 'number' },
    ]},
  ];

  const generatePlan = (profile) => {
    const calories = Number(profile.calories || 2000);
    const perMeal = Math.round(calories / 3);
    const p = {
      breakfast: `Oats, berries, yogurt (~${perMeal} kcal)`,
      lunch: `Grilled chicken, quinoa, salad (~${perMeal} kcal)`,
      dinner: `Fish/tofu, veggies, rice (~${perMeal} kcal)`,
      snacks: 'Nuts, fruits, protein shake',
      notes: `Diet: ${profile.diet || 'balanced'}; Allergies: ${profile.allergies || 'none'}`,
    };
    setPlan(p);
    if (user) {
      firestoreService.createFinanceProfile(user.uid, { meal_profile: profile, meal_plan: p });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Meal Planner</Typography>
      <Typography variant="body1" color="text.secondary">Personalized daily meal suggestions.</Typography>

      <Questionnaire title="Tell us about you" steps={steps} onComplete={generatePlan} />

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


