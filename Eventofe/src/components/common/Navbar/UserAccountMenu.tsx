import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MailIcon from '@mui/icons-material/Mail';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppsIcon from '@mui/icons-material/Apps';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditIcon from '@mui/icons-material/Edit';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../contexts/context/UserContext';
import { useContext, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';

interface IUserAccountMenuProps {
	email?: string;
	permission?: 'User' | 'Worker' | 'Admin';
}

const UserAccountMenu = (props: IUserAccountMenuProps) => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const logoutHandler = () => {
		localStorage.setItem('accessToken', '');
		localStorage.setItem('refreshToken', '');
		window.location.reload();
	};

	const { state } = useContext(UserContext);
	const { permission } = props;
	const email = state?.user ? state?.user.email : 'Error';

	return (
		<>
			<Tooltip title="Account">
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 1 }}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<AccountCircleIcon sx={{ color: 'white' }} />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Box sx={{ pl: 2, pr: 2, pb: 1, fontSize: 14 }}>
					<ListItemIcon className="noSelect">
						<PersonOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
						{permission}:
					</ListItemIcon>
					<Typography> {email}</Typography>
				</Box>
				<Divider />
				<MenuItem onClick={() => navigate('/app/dashboard')} sx={{ mt: 1 }}>
					<ListItemIcon>
						<AppsIcon fontSize="small" />
					</ListItemIcon>
					Dashboard
				</MenuItem>
				<Divider />
				{permission === 'User' && (
					<>
						<MenuItem onClick={() => {state?.user?.personal_data ? navigate('/app/edit-personal-data') : navigate('/app/add-user-data')}}>
							<ListItemIcon>
								<EditIcon fontSize="small" />
							</ListItemIcon>
							Edit Personal Data
						</MenuItem>
						<MenuItem onClick={() => navigate('/app/emails')}>
							<ListItemIcon>
								<EmailIcon fontSize="small" />
							</ListItemIcon>
							Emails
						</MenuItem>
					</>
				)}

				{permission === 'Admin' && (
					<MenuItem onClick={() => navigate('/app/edit-app-emails')}>
						<ListItemIcon>
							<MailIcon fontSize="small" />
						</ListItemIcon>
						Edit app e-mails
					</MenuItem>
				)}
				{state?.user?.login_method==='Password' && (<MenuItem onClick={() => navigate('/app/account-settings')}>
					<ListItemIcon>
						<ManageAccountsIcon fontSize="small" />
					</ListItemIcon>
					Account settings
				</MenuItem>)}
				<MenuItem onClick={() => logoutHandler()}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
};

export default UserAccountMenu;
