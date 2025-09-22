import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Savings as SavingsIcon,
  TrendingUp as InvestIcon,
  PieChart as PieIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../components/Auth/AuthProvider';
import firestoreService from '../services/firestoreService';

const buildBudgetPlan = ({ incomeMonthly, expensesMonthly, goals, risk }) => {
  const income = Number(incomeMonthly || 0);
  const baseExpenses = Number(expensesMonthly || 0);
  const savingsTargetPct = risk === 'conservative' ? 0.3 : risk === 'balanced' ? 0.2 : 0.15;
  const investPct = risk === 'conservative' ? 0.1 : risk === 'balanced' ? 0.2 : 0.3;
  const savingsMonthly = Math.max(0, income * savingsTargetPct);
  const investMonthly = Math.max(0, income * investPct);
  const discretionary = Math.max(0, income - baseExpenses - savingsMonthly - investMonthly);
  return {
    allocations: {
      expenses: baseExpenses,
      savings: savingsMonthly,
      investing: investMonthly,
      discretionary,
    },
    guidance: [
      `Aim to keep fixed expenses under ${(income*0.5).toFixed(0)} for a healthy 50/30/20 baseline`,
      `Automate transfers: savings on payday, investing mid-month`,
      goals ? `Align investing with goals: ${goals}` : 'Define explicit goals for better allocation',
    ],
    createdAt: new Date().toISOString(),
  };
};

export default function FinancialManager() {
  const { user } = useAuth();
  const [form, setForm] = useState({ incomeMonthly: '', expensesMonthly: '', goals: '', risk: 'balanced', portfolio: '' });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = () => {
    setError(''); setSuccess('');
    if (!form.incomeMonthly) { setError('Please enter monthly income.'); return; }
    const built = buildBudgetPlan(form);
    setPlan(built);
  };

  const handleSave = async () => {
    if (!user) { setError('You must be logged in to save.'); return; }
    try {
      const res = await firestoreService.createFinanceProfile(user.uid, { ...form, plan });
      if (res.success) setSuccess('Financial profile saved.'); else setError(res.error || 'Failed to save.');
    } catch (e) {
      setError('Failed to save.');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Financial Manager</Typography>
      <Typography variant="body1" color="text.secondary">Build a budget and income distribution plan like a pro advisor.</Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField label="Monthly Income" type="number" fullWidth value={form.incomeMonthly} onChange={(e)=>setForm({...form,incomeMonthly:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Monthly Expenses" type="number" fullWidth value={form.expensesMonthly} onChange={(e)=>setForm({...form,expensesMonthly:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Risk Profile (conservative/balanced/aggressive)" fullWidth value={form.risk} onChange={(e)=>setForm({...form,risk:e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Goals (optional)" fullWidth value={form.goals} onChange={(e)=>setForm({...form,goals:e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Portfolio (optional, summary)" fullWidth multiline rows={2} value={form.portfolio} onChange={(e)=>setForm({...form,portfolio:e.target.value})} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<PieIcon />} onClick={handleGenerate}>Generate Plan</Button>
            {plan && <Button variant="outlined" startIcon={<SavingsIcon />} onClick={handleSave}>Save Profile</Button>}
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recommended Allocations</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}><Chip icon={<WalletIcon />} label={`Expenses: $${plan.allocations.expenses}`} /></Grid>
                <Grid item xs={12} md={3}><Chip icon={<SavingsIcon />} label={`Savings: $${plan.allocations.savings}`} /></Grid>
                <Grid item xs={12} md={3}><Chip icon={<InvestIcon />} label={`Investing: $${plan.allocations.investing}`} /></Grid>
                <Grid item xs={12} md={3}><Chip icon={<PieIcon />} label={`Discretionary: $${plan.allocations.discretionary}`} /></Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">Guidance:</Typography>
              <ul>
                {plan.guidance.map((g, i)=> (<li key={i}><Typography variant="body2">{g}</Typography></li>))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}


