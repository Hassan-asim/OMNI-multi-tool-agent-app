import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  AutoAwesome as AutoIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Automations = () => {
  const { dashboardData, createAutomation } = useAppStore();
  const automations = dashboardData.automations || [];
  const [activeTab, setActiveTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: 'time_based',
    condition: '',
    actions: [],
  });

  const activeAutomations = automations.filter(auto => auto.enabled);
  const inactiveAutomations = automations.filter(auto => !auto.enabled);

  const triggerTypes = [
    { value: 'time_based', label: 'Time Based', icon: <ScheduleIcon /> },
    { value: 'event_based', label: 'Event Based', icon: <EventIcon /> },
    { value: 'condition_based', label: 'Condition Based', icon: <CheckIcon /> },
    { value: 'manual', label: 'Manual', icon: <PlayIcon /> },
  ];


  const handleCreateAutomation = async () => {
    if (!newAutomation.name.trim()) return;

    try {
      const result = await createAutomation(newAutomation);
      if (result.success) {
        setNewAutomation({
          name: '',
          description: '',
          trigger: 'time_based',
          condition: '',
          actions: [],
        });
        setCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating automation:', error);
    }
  };

  const getTriggerIcon = (type) => {
    const trigger = triggerTypes.find(t => t.value === type);
    return trigger?.icon || <AutoIcon />;
  };

  const getStatusColor = (enabled) => {
    return enabled ? 'success' : 'default';
  };

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Smart Automations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create intelligent workflows that connect your digital services
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {activeAutomations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Automations
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {automations.reduce((sum, auto) => sum + auto.run_count, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Executions
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {Math.round(automations.reduce((sum, auto) => sum + auto.success_rate, 0) / automations.length * 100) || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Active (${activeAutomations.length})`} />
          <Tab label={`Inactive (${inactiveAutomations.length})`} />
        </Tabs>
      </Box>

      {/* Automation List */}
      <Grid container spacing={3}>
        {(activeTab === 0 ? activeAutomations : inactiveAutomations).map((automation, index) => (
          <Grid item xs={12} md={6} key={automation.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {automation.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {automation.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={automation.enabled ? 'Active' : 'Inactive'}
                      color={getStatusColor(automation.enabled)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getTriggerIcon(automation.trigger_type || automation.trigger)}
                    <Typography variant="body2" color="text.secondary">
                      {(automation.trigger_type || automation.trigger || 'manual').replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Chip
                      label={automation.actions_count + ' actions'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last run: {automation.last_run ? new Date(automation.last_run).toLocaleDateString() : 'Never'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Runs: {automation.run_count} • Success: {Math.round(automation.success_rate * 100)}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => console.log('Run automation:', automation.name)}
                        title="Run automation"
                      >
                        <PlayIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => console.log('Edit automation:', automation.name)}
                        title="Edit automation"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this automation?')) {
                            console.log('Delete automation:', automation.name);
                          }
                        }}
                        title="Delete automation"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {automations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <AutoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No automations yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first automation to start connecting your digital services
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Automation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Automation Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Automation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Automation Name"
              value={newAutomation.name}
              onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={newAutomation.description}
              onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Trigger Type</InputLabel>
              <Select
                value={newAutomation.trigger}
                onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value })}
                label="Trigger Type"
              >
                {triggerTypes.map((trigger) => (
                  <MenuItem key={trigger.value} value={trigger.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {trigger.icon}
                      {trigger.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Trigger Condition"
              value={newAutomation.condition}
              onChange={(e) => setNewAutomation({ ...newAutomation, condition: e.target.value })}
              placeholder="e.g., 0 8 * * * (8 AM daily) or task_completed"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Actions will be added in the next step
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAutomation}
            disabled={!newAutomation.name.trim()}
          >
            Create Automation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setCreateDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          borderRadius: '50px',
          px: 3,
          zIndex: 1000,
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Create Automation
      </Button>
    </Box>
  );
};

export default Automations;
