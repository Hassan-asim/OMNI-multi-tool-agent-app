import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stepper, Step, StepLabel } from '@mui/material';

export default function Questionnaire({ title, steps, onComplete }) {
  const [active, setActive] = useState(0);
  const [values, setValues] = useState({});

  const current = steps[active] || { fields: [] };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <Stepper activeStep={active} sx={{ mb: 2 }}>
          {steps.map((s, i) => (
            <Step key={i}><StepLabel>{s.label}</StepLabel></Step>
          ))}
        </Stepper>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {current.fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              type={f.type || 'text'}
              value={values[f.name] || ''}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              InputLabelProps={f.type === 'date' || f.type === 'datetime-local' ? { shrink: true } : undefined}
            />
          ))}
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          {active > 0 && <Button onClick={() => setActive(active-1)}>Back</Button>}
          {active < steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActive(active+1)}>Next</Button>
          ) : (
            <Button variant="contained" onClick={() => onComplete(values)}>Finish</Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}


