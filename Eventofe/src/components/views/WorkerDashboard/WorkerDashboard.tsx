import React from 'react';
import { Box, Paper } from '@mui/material';
import Navbar from '../../common/Navbar/Navbar';
import EventList from './EventList';

const WorkerDashboard = () => {
  return (
    <Box>
      <Navbar permission="Worker" />
      <Paper
        variant="outlined"
        sx={{ padding: 3, marginTop: 10, borderRadius: 4 }}
      >
        <EventList />
      </Paper>
    </Box>
  );
};

export default WorkerDashboard;
