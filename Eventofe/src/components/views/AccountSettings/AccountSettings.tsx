import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';

import AppContainer from '../../common/AppContainer';

import { IAccountSettings } from '../../../shared/interfaces/auth.interface';
import { useMutation } from 'react-query';
import { changePasswordService } from '../../../services/userService';
import { Validator } from '../../../tools/Validator';
import UserContext from '../../../contexts/context/UserContext';

const AccountSettings = () => {
	const { state } = React.useContext(UserContext);
	const [accountSettings, setAccountSettings] = useState<IAccountSettings>({
		oldPassword: '',
		newPassword: '',
		repeatPassword: '',
	});

	const { mutate, isSuccess, data, error, isError } = useMutation(
		changePasswordService
	);

	const [errors, setErrors] = useState({
		oldPassword: '',
		newPassword: '',
		repeatPassword: '',
	});

	const [samePasswords, setSamePasswords] = useState(false)

	const validateForm = async () => {
		const oldPasswordError = await Validator.checkPassword(accountSettings.oldPassword, false);
		const newPasswordError = await Validator.checkPassword(accountSettings.newPassword, true);
		const repeatPasswordError = await Validator.checkRepeatPassword(accountSettings.newPassword, accountSettings.repeatPassword);
		setErrors({
			oldPassword: oldPasswordError ?? '',
			newPassword: newPasswordError ?? '',
			repeatPassword: repeatPasswordError ?? '',
		})

		return !(oldPasswordError || newPasswordError || repeatPasswordError)
	};

	const navigate = useNavigate();
	const handleResetPassword = async () => {
		setSamePasswords(false)
		if(await validateForm()){
			if(accountSettings.oldPassword === accountSettings.newPassword){
				setSamePasswords(true)
			} else {
				mutate({
					access_token: localStorage.getItem('accessToken') as string,
					userData: {
						password: accountSettings.newPassword,
						old_password: accountSettings.oldPassword,
					},
				});
			}		
		}
	};

	useEffect(() => {
		if (isSuccess && data.data.payload === null) {
			console.log(data);
			setTimeout(() => {
				navigate('/app/dashboard');
			}, 3000);
		}
	});

	useEffect(() => {
		if (isError) {
			console.log(error);
		}
	});
	return (
		<AppContainer back="/app/dashboard" label="Account Settings" navbar permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}>
			<Box component="form">
				<Grid container sx={{ width: 400 }}>
					<Grid item sm={12}>
						<TextField
							margin="dense"
							required
							fullWidth
							id="oldPassword"
							label="Old password"
							name="oldPassword"
							value={accountSettings.oldPassword}
							onChange={(e) =>
								setAccountSettings({
									...accountSettings,
									oldPassword: e.target.value,
								})
							}
							error={!!errors.oldPassword}
							helperText={errors.oldPassword}
							type="password"
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							margin="dense"
							required
							fullWidth
							id="newPassword"
							label="New password"
							name="newPassword"
							value={accountSettings.newPassword}
							onChange={(e) =>
								setAccountSettings({
									...accountSettings,
									newPassword: e.target.value,
								})
							}
							error={!!errors.newPassword}
							helperText={errors.newPassword}
							type="password"
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							margin="dense"
							required
							fullWidth
							id="repeatPassword"
							label="Repeat new password"
							name="repeatPassword"
							value={accountSettings.repeatPassword}
							onChange={(e) =>
								setAccountSettings({
									...accountSettings,
									repeatPassword: e.target.value,
								})
							}
							error={!!errors.repeatPassword}
							helperText={errors.repeatPassword}
							type="password"
						/>
					</Grid>
				</Grid>
				<Button
					variant="contained"
					sx={{ fontWeight: 600, mt: 3 }}
					onClick={handleResetPassword}
				>
					Reset password
				</Button>
			</Box>
			{isSuccess && data.data.payload === null && (
				<Alert sx={{mt: 2}} severity="success">
					The profile has been edited! Page will be refreshed in a moment....
				</Alert>
			)}
			{samePasswords ? (
			<Alert sx={{ mt: 2 }} severity="error">Old and new passwords are the same</Alert>
			) : (
			isSuccess && data.data.payload === 'Unauthorized' && (
				<Alert sx={{ mt: 2 }} severity="error">Wrong old password</Alert>
			)
			)}
		</AppContainer>
	);
};

export default AccountSettings;
