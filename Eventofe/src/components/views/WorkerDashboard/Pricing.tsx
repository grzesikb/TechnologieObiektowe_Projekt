import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Alert,
	Box,
	Button,
	Grid,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';

import AppContainer from '../../common/AppContainer';
import { IOrder } from '../../../shared/interfaces/order.interface';
import StatusChip from '../../common/StatusChip';
import { IPaymentDetails } from '../../../shared/interfaces/payment.interface';
import { useMutation } from 'react-query';
import {
	eventDetailService,
	setPriceService,
	updateEventService,
} from '../../../services/eventService';
import { statusFormatter } from '../../../tools/StatusFormatter';
import { convertType } from '../../../tools/TypeConverter';
import { Validator } from '../../../tools/Validator';
import UserContext from '../../../contexts/context/UserContext';

// eslint-disable react/prop-types
const Pricing = () => {
	const theme = useTheme();
	const { state } = useContext(UserContext);
	const urlParams = new URLSearchParams(window.location.search);
	const typeParam = urlParams.get('id');

	const {
		mutate,
		data: responseData,
		isSuccess,
		isLoading,
	} = useMutation(eventDetailService);

	const {
		mutate: editMutate,
		data: editData,
		isSuccess: editSuccess,
		isLoading: editLoading,
	} = useMutation(setPriceService);

	const [errors, setErrors] = useState({
		price: '',
	});

	const [data, setData] = useState<IOrder>({
		id: '',
		name: '',
		startDate: null,
		type: '',
		status: '',
		additionalInfo: '',
		securityOption: false,
		barOption: false,
		artist: '',
		maxPeople: '',
		minAge: '',
		numberOfSeats: '',
		companyName: '',
		cateringOption: false,
		cateringName: '',
		types: '',
		price: 0,
		payment_token: ''
	});

	const validateForm = async () => {
		if (data.price !== null) {
			const priceError = await Validator.checkPrice(data.price?.toString());
			setErrors({
			  price: priceError ?? '',
			});
			return !(priceError);
		} else{
			setErrors({
				price: 'This field is required',
			});
		}
	};

	useEffect(() => {
		mutate({
			access_token: localStorage.getItem('accessToken') as string,
			id: typeParam as string,
		});
	}, []);

	useEffect(() => {
		if (isSuccess) {
			if (responseData.data.payload.length > 0) {
				const orderDetails = responseData.data.payload[0];
				setData({
					id: '',
					name: orderDetails.name,
					startDate: orderDetails.start_date,
					type: orderDetails.type,
					status: orderDetails.status,
					additionalInfo: orderDetails.additional_info,
					securityOption: orderDetails.security,
					barOption: orderDetails.bar_option,
					artist: orderDetails.artist_name,
					maxPeople: orderDetails.max_nr_of_people,
					minAge: orderDetails.minimal_age,
					numberOfSeats: orderDetails.number_of_seats,
					companyName: orderDetails.company_name,
					cateringOption: orderDetails.catering,
					cateringName: orderDetails.company_name,
					price: orderDetails.cost,
					types: 'Birthdays',
					payment_token: orderDetails.payment_token
				});
			}
		}
	}, [isSuccess]);

	const navigate = useNavigate();

	const handleSendQuote = async () => {
		const dataToUpdate = {
			name: data.name,
			bar_option: data.barOption,
			security: data.securityOption,
			type: data.type,
			start_date: data.startDate,
			additional_info: data.additionalInfo,
			status: 2,
			artist_name: data.artist,
			max_nr_of_people: data.maxPeople,
			minimal_age: data.minAge,
			company_name: data.companyName,
			catering: data.cateringOption,
			number_of_seats: data.numberOfSeats,
			cost: +data.price!,
			payment_token: data.payment_token,
			id: typeParam,
		};
		if(await validateForm()){
			editMutate({
				access_token: localStorage.getItem('accessToken') as string,
				orderData: dataToUpdate,
			});
		}
	};

	useEffect(() => {
		if(editSuccess){
			setTimeout(() => {
				navigate('/app/dashboard');
			}, 3000);
		}
	}, [editSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Pricing order: ${typeParam}`}
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Box component="form">
				<Grid container>
					<Grid item xs={5.5}>
						<Typography
							variant="h6"
							sx={{ fontSize: 16, color: 'grey', minWidth: 300 }}
						>
							Name:
						</Typography>
						<Typography variant="h6" sx={{ fontSize: 16 }}>
							{data.name}
						</Typography>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={5.5}>
						<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
							Type:
						</Typography>
						<Typography variant="h6" sx={{ fontSize: 16 }}>
							{data.type ? convertType(+data.type) : data.type}
						</Typography>
					</Grid>

					<Grid item xs={5.5} sx={{ mt: 2 }}>
						<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
							Start date:
						</Typography>
						<Typography variant="h6" sx={{ fontSize: 16 }}>
							{data.startDate}
						</Typography>
					</Grid>
					<Grid item xs={1}></Grid>
					
					<Grid item xs={5.5} sx={{ mt: 2 }}>
						<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
							Status:
						</Typography>
						<StatusChip
							type={data ? (statusFormatter(+data.status) as string) : ''}
						/>
					</Grid>
					

					{/* ---------------- Detailed data ---------------- */}

					{convertType(+data.type) === 'Public' && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								mt: 7,
							}}
						>
							<Grid item>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Maximum number of people:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.maxPeople}
								</Typography>
							</Grid>
							<Grid item sx={{ ml: 5 }}>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Minimal age:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.minAge}
								</Typography>
							</Grid>
							<Grid item sx={{ ml: 10 }}>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Artist:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.artist}
								</Typography>
							</Grid>
						</Box>
					)}
					{data.type === 'Private' && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								mt: 7,
							}}
						>
							<Grid item>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Number of seats:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.numberOfSeats}
									{/* numberOfSeats */}
								</Typography>
							</Grid>
							<Grid item sx={{ ml: 5 }}>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Company name:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.types}
									{/* companyName */}
								</Typography>
							</Grid>
						</Box>
					)}
					{data.type === 'Celebration' && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								mt: 7,
							}}
						>
							<Grid item>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Number of seats:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.numberOfSeats}
								</Typography>
							</Grid>
							<Grid item sx={{ ml: 5 }}>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Type:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.types}
								</Typography>
							</Grid>
							<Grid item sx={{ ml: 15 }}>
								<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
									Catering Name:
								</Typography>
								<Typography variant="h6" sx={{ fontSize: 16 }}>
									{data.cateringName}
								</Typography>
							</Grid>
						</Box>
					)}
					<Grid item xs={12} sx={{ mt: 5 }}>
						<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
							Additional Options:
						</Typography>
						<Typography variant="h6" sx={{ fontSize: 16 }}>
							{data.barOption && ' Bar service option, '}
							{data.securityOption && ' Security option, '}
							{/* detailedData.cateringOption && ' Catering option, ' */}
						</Typography>
					</Grid>
					<Grid item xs={12} sx={{ mt: 2 }}>
						<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
							Additional info:
						</Typography>
						<Typography variant="h6" sx={{ fontSize: 16 }}>
							{data.additionalInfo}
						</Typography>
					</Grid>
				</Grid>
				<TextField
					margin="dense"
					required
					fullWidth
					id="price"
					label="Price (zł)"
					name="price"
					value={data.price ?? ''}
					onChange={(e) => setData({ ...data, price: e.target.value })}
					sx={{ mt: 3 }}
					error={!!errors.price}
					helperText={errors.price}
				/>
				<Button
					variant="contained"
					sx={{ fontWeight: 600, mt: 3 }}
					onClick={handleSendQuote}
				>
					Send quote
				</Button>
			</Box>
			{editSuccess && (
				<Alert sx={{mt:2}} severity="success">Price saved successfully! Page will be refreshed in a moment...</Alert>
			)}
		</AppContainer>
	);
};

export default Pricing;
