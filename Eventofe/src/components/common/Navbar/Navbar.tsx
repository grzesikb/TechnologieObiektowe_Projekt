import React, { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Switch } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { SettingsContext } from '../../../contexts/context/SettingsContext';
import UserAccountMenu from './UserAccountMenu';

interface INavbar {
  hideMenu?: boolean;
  email?: string | undefined;
  permission?: 'User' | 'Worker' | 'Admin';
}

const Navbar = (props: INavbar) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { theme, dispatch } = useContext(SettingsContext);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = () => {
    dispatch({
      type: 'SET_THEME',
      payload: theme === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="noSelect">
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              marginLeft: 1,
              letterSpacing: -0.8,
            }}
          >
            Evento
          </Typography>
          <div>
            <IconButton onClick={() => handleThemeChange()}>
              {theme === 'dark' ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon sx={{ color: 'white' }} />
              )}
            </IconButton>
            {!props.hideMenu && (
              <UserAccountMenu
                email={props.email}
                permission={props.permission}
              />
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
