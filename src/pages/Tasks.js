import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Fab,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    service: 'auto',
  });

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    addTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      service: 'auto',
    });
    setCreateDialogOpen(false);
  };

  const handleToggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { completed: !task.completed });
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case 'todoist': return '📝';
      case 'google_tasks': return '📋';
      case 'asana': return '🎯';
      default: return '📌';
    }
  };

  const getServiceColor = (service) => {
    switch (service) {
      case 'todoist': return '#E44332';
      case 'google_tasks': return '#4285F4';
      case 'asana': return '#F06A6A';
      default: return '#666';
    }
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
          Task Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organize and prioritize your tasks across all platforms
        </Typography>
        
        {/* Quick Action Chips */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckIcon />}
            label="Mark All Complete"
            color="success"
            variant="outlined"
            clickable
            onClick={() => {
              tasks.forEach(task => {
                if (!task.completed) {
                  updateTask(task.id, { completed: true });
                }
              });
            }}
          />
          <Chip
            icon={<PriorityIcon />}
            label="High Priority"
            color="error"
            variant="outlined"
            clickable
            onClick={() => {
              const highPriorityTasks = tasks.filter(task => task.priority === 'high');
              console.log('High priority tasks:', highPriorityTasks);
            }}
          />
          <Chip
            icon={<ScheduleIcon />}
            label="Schedule Tasks"
            color="info"
            variant="outlined"
            clickable
            onClick={() => {
              const scheduledTasks = tasks.filter(task => task.due_date);
              console.log('Scheduled tasks:', scheduledTasks);
            }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Pending (${pendingTasks.length})`} />
          <Tab label={`Completed (${completedTasks.length})`} />
        </Tabs>
      </Box>

      {/* Task List */}
      <Card>
        <CardContent>
          <List>
            {(activeTab === 0 ? pendingTasks : completedTasks).map((task, index) => (
              <motion.div
                key={task.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: task.completed ? 'action.hover' : 'background.paper',
                  }}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.6 : 1,
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(task.priority) + '20',
                            color: getPriorityColor(task.priority),
                            fontWeight: 500,
                          }}
                        />
                        <Chip
                          icon={<TaskIcon />}
                          label={task.service}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            backgroundColor: getServiceColor(task.service) + '20',
                            borderColor: getServiceColor(task.service),
                            color: getServiceColor(task.service)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        {task.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {task.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {task.due_date && (
                            <Chip
                              icon={<ScheduleIcon />}
                              label={new Date(task.due_date).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                              color={new Date(task.due_date) < new Date() ? 'error' : 'default'}
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(task.created_at || task.createdAt || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => console.log('Edit task:', task.title)}
                        title="Edit task"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this task?')) {
                            handleDeleteTask(task.id);
                          }
                        }}
                        title="Delete task"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>

          {tasks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No tasks yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create your first task to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Task
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Service</InputLabel>
                <Select
                  value={newTask.service}
                  onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                  label="Service"
                >
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="todoist">Todoist</MenuItem>
                  <MenuItem value="google_tasks">Google Tasks</MenuItem>
                  <MenuItem value="asana">Asana</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              fullWidth
              type="datetime-local"
              label="Due Date (Optional)"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={!newTask.title.trim()}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Tasks;
