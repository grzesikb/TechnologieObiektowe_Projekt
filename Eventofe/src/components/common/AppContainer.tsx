import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import Back from './Back';
import Navbar from './Navbar/Navbar';

interface IAppContainerProps {
  children: React.ReactNode;
  back: string;
  label?: string;
  additionalLabel?: string;
  navbar?: boolean;
  email?: string | undefined;
  permission?: 'User' | 'Worker' | 'Admin';
  nested?: boolean; // if true hide first Box with margin
}

const AppContainer: React.FC<IAppContainerProps> = ({
  children,
  back,
  label,
  additionalLabel,
  navbar,
  email,
  permission,
  nested,
}) => {
  return (
    <div>
      {navbar && <Navbar email={email} permission={permission} />}
      <Box
        sx={
          nested
            ? {}
            : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 12,
              }
        }
      >
        <Paper variant="outlined" sx={{ padding: 6, borderRadius: 4 }}>
          <Back to={back} />
          <Box style={{ display: 'flex' }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: 600, mb: 2, mr: 2 }}
            >
              {label}
            </Typography>

            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 2,
                fontSize: 15,
                lineHeight: 2.5,
                color: 'grey',
              }}
            >
              {additionalLabel}
            </Typography>
          </Box>
          {children}
        </Paper>
      </Box>
    </div>
  );
};

export default AppContainer;
