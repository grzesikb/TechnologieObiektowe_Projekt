/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import SendIcon from '@mui/icons-material/Send';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';

import AppContainer from '../../common/AppContainer';
import { IPersonalData } from '../../../shared/interfaces/person.interface';
import UserContext from '../../../contexts/context/UserContext';
import { useMutation } from 'react-query';
import { editUserProfileService } from '../../../services/userService';
import { Validator } from '../../../tools/Validator';

const EditPersonalData = () => {
	const { state } = useContext(UserContext);
	const [personalData, setPersonalData] = useState<IPersonalData>({
		firstName: state?.user ? state?.user.personal_data.first_name : '',
		lastName: state?.user ? state?.user.personal_data.last_name : '',
		phoneNumber: state?.user ? state?.user.personal_data.phone : '',
		street: state?.user ? state?.user.address_data.street : '',
		houseNumber: state?.user ? state?.user.address_data.house_number : '',
		city: state?.user ? state?.user.address_data.city : '',
		postalCode: state?.user ? state?.user.address_data.postal_code : '',
		voivodeship: state?.user ? state?.user.address_data.voivodeship : '',
		country: state?.user ? state?.user.address_data.country : '',
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		street: '',
		houseNumber: '',
		city: '',
		postalCode: '',
		voivodeship: '',
		country: '',
	});
	
	const validateForm = async () => {
		const firstNameError = await Validator.checkRequiredString(personalData.firstName);
		const lastNameError = await Validator.checkRequiredString(personalData.lastName);
		const phoneNumberError = await Validator.checkPhoneNumber(personalData.phoneNumber);
		const streetError = await Validator.checkRequiredString(personalData.street);
		const houseNumberError = await Validator.checkHouseNumber(personalData.houseNumber);
		const cityError = await Validator.checkRequiredString(personalData.city);
		const postalCodeError = await Validator.checkPostalCode(personalData.postalCode);
		const voivodeshipError = await Validator.checkRequiredString(personalData.voivodeship);
		const countryError = await Validator.checkRequiredString(personalData.country);
		
		setErrors({
			firstName: firstNameError ?? '',
			lastName: lastNameError ?? '',
			phoneNumber: phoneNumberError ?? '',
			street: streetError ?? '',
			houseNumber: houseNumberError ?? '',
			city: cityError ?? '',
			postalCode: postalCodeError ?? '',
			voivodeship: voivodeshipError ?? '',
			country: countryError ?? '',
		})

		return !(firstNameError || lastNameError || phoneNumberError || streetError || houseNumberError || cityError || postalCodeError || voivodeshipError || countryError)
	};

	const navigate = useNavigate();

	const { mutate, isSuccess, data } = useMutation(editUserProfileService);

	const handleEditPersonalData = async () => {
		const dataToUpdate = {
			personal_data: {
				first_name: personalData.firstName,
				last_name: personalData.lastName,
				phone: personalData.phoneNumber,
			},
			address: {
				street: personalData.street,
				postal_code: personalData.postalCode,
				city: personalData.city,
				house_number: personalData.houseNumber,
				country: personalData.country,
				voivodeship: personalData.voivodeship,
			},
		};
		if(await validateForm()){
			mutate({
				access_token: localStorage.getItem('accessToken') as string,
				userData: dataToUpdate,
			});
		}
	};

	useEffect(() => {
		if (isSuccess) {
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	}, [isSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label="Edit your personal details"
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Box component="form">
				<Grid container>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.firstName}
							margin="dense"
							required
							fullWidth
							id="firstName"
							label="First Name"
							name="firstName"
							autoComplete="given-name"
							autoFocus
							value={personalData.firstName}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									firstName: e.target.value,
								})
							}
							error={!!errors.firstName}
							helperText={errors.firstName}
						/>
					</Grid>
					<Grid item sm={1}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.street}
							margin="dense"
							required
							fullWidth
							id="street"
							label="Street"
							name="street"
							autoComplete="address-line1"
							autoFocus
							value={personalData.street}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									street: e.target.value,
								})
							}
							error={!!errors.street}
							helperText={errors.street}
						/>
					</Grid>

					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.lastName}
							margin="dense"
							required
							fullWidth
							id="lastName"
							label="Last Name"
							name="lastName"
							autoComplete="family-name"
							autoFocus
							value={personalData.lastName}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									lastName: e.target.value,
								})
							}
							error={!!errors.lastName}
							helperText={errors.lastName}
						/>
					</Grid>
					<Grid item sm={1}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.houseNumber}
							margin="dense"
							fullWidth
							id="houseNumber"
							label="House Number"
							name="houseNumber"
							autoComplete="address-line2"
							autoFocus
							value={personalData.houseNumber}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									houseNumber: e.target.value,
								})
							}
							error={!!errors.houseNumber}
							helperText={errors.houseNumber}
						/>
					</Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.phoneNumber}
							margin="dense"
							type="number"
							required
							fullWidth
							id="phone"
							label="Phone Number"
							name="phone"
							autoComplete="phone"
							autoFocus
							sx={{
								'& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
									{
										'-webkit-appearance': 'none',
										margin: 0,
									},
							}}
							value={personalData.phoneNumber}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									phoneNumber: parseInt(e.target.value, 10),
								})
							}
							error={!!errors.phoneNumber}
							helperText={errors.phoneNumber}
						/>
					</Grid>
					<Grid item sm={1}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.city}
							margin="dense"
							required
							fullWidth
							id="city"
							label="City"
							name="city"
							autoComplete="address-line3"
							autoFocus
							value={personalData.city}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									city: e.target.value,
								})
							}
							error={!!errors.city}
							helperText={errors.city}
						/>
					</Grid>
					<Grid item sm={6.5}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.postalCode}
							margin="dense"
							required
							fullWidth
							id="postalCode"
							label="Postal Code"
							name="postalCode"
							autoComplete="postal-code"
							autoFocus
							value={personalData.postalCode}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									postalCode: e.target.value,
								})
							}
							error={!!errors.postalCode}
							helperText={errors.postalCode}
						/>
					</Grid>
					<Grid item sm={6.5}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.voivodeship}
							margin="dense"
							required
							fullWidth
							id="voivodeship"
							label="Voivodeship"
							name="voivodeship"
							autoComplete="address-line4"
							autoFocus
							value={personalData.voivodeship}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									voivodeship: e.target.value,
								})
							}
							error={!!errors.voivodeship}
							helperText={errors.voivodeship}
						/>
					</Grid>
					<Grid item sm={6.5}>
						<Typography component="h5" variant="body2" sx={{ mt: 2 }}>
							* require
						</Typography>
					</Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={personalData.country}
							margin="dense"
							required
							fullWidth
							id="country"
							label="Country"
							name="country"
							autoComplete="country"
							autoFocus
							value={personalData.country}
							onChange={(e) =>
								setPersonalData({
									...personalData,
									country: e.target.value,
								})
							}
							error={!!errors.country}
							helperText={errors.country}
						/>
					</Grid>
				</Grid>
				<Button
					variant="contained"
					endIcon={<SendIcon />}
					sx={{ fontWeight: 600 }}
					onClick={() => handleEditPersonalData()}
				>
					Edit personal details
				</Button>
			</Box>
			{isSuccess && (
				<Alert sx={{mt: 2}} severity="success">
					The profile has been edited! Page will be refreshed in a moment....
				</Alert>
			)}
		</AppContainer>
	);
};
export default EditPersonalData;
