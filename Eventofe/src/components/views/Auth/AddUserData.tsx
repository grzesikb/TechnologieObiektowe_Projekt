import {
	Alert,
	Box,
	Button,
	Grid,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../../common/Navbar/Navbar';
import { IPersonalData } from '../../../shared/interfaces/person.interface';
import { signUpService } from '../../../services/authService';
import { useMutation } from 'react-query';
import { Validator } from '../../../tools/Validator';
import { createPersonalDataService } from '../../../services/userService';

interface IAddUserDataProps{
	isCreateAccount: any;
}

const AddUserData = ({isCreateAccount}:IAddUserDataProps) => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [registerError, setRegisterError] = useState('');

	const { mutate, isSuccess, isError, error } = useMutation(signUpService);
	const { mutate:createPersonalDataMutate, isSuccess:createPersonalDataSuccess, isError:createPersonalDataIsError, error:createPersonalDataError} = useMutation(createPersonalDataService);

	const [personalData, setPersonalData] = useState<IPersonalData>({
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

	const handleClick = async () => {
		if(isCreateAccount){
			const signUpData = {
				email: state.email,
				password: state.password,
				role: 1,
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
				mutate(signUpData);
			}
		} else{
			const createPersonalData = {
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
				createPersonalDataMutate({access_token: localStorage.getItem('accessToken') as string, userData: createPersonalData});
			}
		}	
	};

	useEffect(() => {
		isSuccess && isCreateAccount && navigate('/auth/signin');
		createPersonalDataSuccess && !isCreateAccount && setTimeout(()=> window.location.replace('http://localhost:3000/'), 3000);
	}, [isSuccess, navigate, createPersonalDataSuccess]);


	return (
		<Box>
			<Navbar hideMenu />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					mt: 12,
				}}
			>
				<Paper variant="outlined" sx={{ padding: 6, borderRadius: 4 }}>
					<Typography
						component="h1"
						variant="h5"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Complete your personal details
					</Typography>
					<Box component="form">
						<Grid container>
							<Grid item sm={5.5}>
								<TextField
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
									required
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
							onClick={handleClick}
						>
							Add personal details
						</Button>
					</Box>
				</Paper>
			</Box>
			{isError && (
				<Alert severity="error">{(error as any).response.data.detail}</Alert>
			)}
			{createPersonalDataSuccess && (
				<Alert sx={{mt: 2}} severity="success">
					The personal data completed! Page will be refreshed in a moment....
				</Alert>
			)}
		</Box>
	);
};
export default AddUserData;
