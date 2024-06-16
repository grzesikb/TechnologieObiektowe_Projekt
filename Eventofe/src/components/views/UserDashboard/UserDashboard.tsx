import { Box, Paper } from '@mui/material';

import OrderEventsPanel from './OrderEventsPanel';
import UserEvents from './UserEvents';
import Navbar from '../../common/Navbar/Navbar';

const UserDashboard = () => {
  return (
    <Box>
      <Navbar permission="User" />
      <Paper
        variant="outlined"
        sx={{ padding: 6, marginTop: 10, borderRadius: 4 }}
      >
        <OrderEventsPanel />
        <UserEvents />
      </Paper>
    </Box>
  );
};

export default UserDashboard;
