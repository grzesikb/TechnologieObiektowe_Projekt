import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AppContainer from '../../common/AppContainer';
import { IOrder } from '../../../shared/interfaces/order.interface';
import { useMutation } from 'react-query';
import {
	eventDetailService,
	setPriceService,
	updateEventService,
} from '../../../services/eventService';
import { statusFormatter, statusGetter } from '../../../tools/StatusFormatter';
import { convertType, typeGetter } from '../../../tools/TypeConverter';
import UserContext from '../../../contexts/context/UserContext';

const EditOrder = () => {
	const { state } = useContext(UserContext);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const typeParam = urlParams.get('id');

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

	const {
		mutate,
		data: responseData,
		isSuccess,
		isLoading,
	} = useMutation(eventDetailService);

	const {
		mutate: updateMutate,
		data: updateData,
		isSuccess: updateSuccess,
	} = useMutation(
		state!.user?.role === 2 ? setPriceService : updateEventService
	);

	useEffect(() => {
		mutate({
			access_token: localStorage.getItem('accessToken') as string,
			id: typeParam as string,
		});
	}, []);

	useEffect(() => {
		if (isSuccess) {
				const orderDetails = responseData.data.payload;
				setData({
					id: '',
					name: orderDetails.name,
					startDate: orderDetails.start_date,
					type: convertType(orderDetails.type) as string,
					status: statusFormatter(orderDetails.status) as string,
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
	}, [isSuccess]);

	const navigate = useNavigate();
	const handleEditOrder = async () => {
		const dataToUpdate = {
			name: data.name,
			bar_option: data.barOption,
			security: data.securityOption,
			type: typeGetter(data.type),
			start_date: data.startDate,
			additional_info: data.additionalInfo,
			status: statusGetter(data.status),
			artist_name: data.artist,
			max_nr_of_people: data.maxPeople,
			minimal_age: data.minAge,
			company_name: data.companyName,
			catering: data.cateringOption,
			number_of_seats: data.numberOfSeats,
			cost: data.price,
			id: typeParam,
			payment_token: data.payment_token
		};

		updateMutate({
			access_token: localStorage.getItem('accessToken') as string,
			orderData: dataToUpdate,
		});
	};

	useEffect(() => {
		if (updateSuccess) {
			setTimeout(() => {
				navigate('/app/dashboard');
			}, 3000);
		}
	}, [updateSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Edit order: ${typeParam}`}
			additionalLabel={`Type: ${data.type} | Date: ${data.startDate}`}
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Box component="form">
				<Grid container>
					<Grid item sm={12}>
						<TextField
							margin="dense"
							required
							fullWidth
							id="name"
							label="Event Name"
							name="name"
							value={data.name}
							onChange={(e) => setData({ ...data, name: e.target.value })}
						/>
					</Grid>

					{/* ---------------- Detailed data ---------------- */}

					{data.type === 'Public' && (
						<>
							<Grid item sm={12}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="artist"
									label="Artist Names"
									name="artist"
									helperText="If you want to order artists, enter their names and artistic pseudonym"
									multiline
									value={data.artist}
									onChange={(e) => setData({ ...data, artist: e.target.value })}
								/>
							</Grid>

							<Grid item sm={5.5}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="numberOfPeople"
									label="Maximum number of people"
									name="numberOfPeople"
									value={data.maxPeople}
									onChange={(e) =>
										setData({ ...data, maxPeople: e.target.value })
									}
								/>
							</Grid>
							<Grid item sm={1}></Grid>
							<Grid item sm={5.5}>
								<TextField
									margin="dense"
									fullWidth
									id="minAge"
									label="Minimal Age"
									name="minAge"
									value={data.minAge}
									helperText="Minimum age of a person to let him or her into the party"
									onChange={(e) => setData({ ...data, minAge: e.target.value })}
								/>
							</Grid>
						</>
					)}

					{data.type === 'Private' && (
						<>
							<Grid item sm={12}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="numberOfSeats"
									label="Number of seats"
									name="numberOfSeats"
									value={data.numberOfSeats}
									onChange={(e) =>
										setData({ ...data, numberOfSeats: e.target.value })
									}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="company"
									label="Company Name"
									name="company"
									value={data.companyName}
									onChange={(e) =>
										setData({ ...data, companyName: e.target.value })
									}
								/>
							</Grid>
						</>
					)}

					{data.type === 'Celebration' && (
						<>
							<Grid item sm={12}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="numberOfSeats"
									label="Number of seats"
									name="numberOfSeats"
									value={data.numberOfSeats}
									onChange={(e) =>
										setData({ ...data, numberOfSeats: e.target.value })
									}
								/>
							</Grid>

							<Grid item sm={12}>
								<TextField
									margin="dense"
									required
									fullWidth
									id="catering"
									label="Catering Name"
									name="catering"
									value={data.cateringName}
									onChange={(e) =>
										setData({ ...data, cateringName: e.target.value })
									}
								/>
							</Grid>

							<Grid item sm={12} sx={{ mt: 1, mb: 1, ml: 0.5 }}>
								<Typography component="h5" variant="body2">
									Type: {data.types}
								</Typography>
							</Grid>
						</>
					)}

					<Grid item sm={12} sx={{ mt: 1 }}>
						<TextField
							margin="dense"
							fullWidth
							id="additionalInfo"
							label="Aditional info / Expectations"
							name="additionalInfo"
							multiline
							value={data.additionalInfo}
							onChange={(e) =>
								setData({ ...data, additionalInfo: e.target.value })
							}
						/>
					</Grid>
					<Grid item sm={12}>
						<FormGroup className="noSelect">
							{data.type === 'Public' && (
								<FormControlLabel
									control={<Checkbox color="success" disabled checked />}
									label="* Security and bodyguards"
								/>
							)}
							{data.type === 'Private' && (
								<>
									<FormControlLabel
										control={
											<Checkbox
												color="success"
												value={data.cateringOption}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													setData({
														...data,
														cateringOption: event.target.checked,
													})
												}
												checked={data.cateringOption}
											/>
										}
										label="Catering package"
									/>
									<FormControlLabel
										control={
											<Checkbox
												color="success"
												value={data.securityOption}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													setData({
														...data,
														securityOption: event.target.checked,
													})
												}
												checked={data.securityOption}
											/>
										}
										label="Security and bodyguards"
									/>
								</>
							)}
							{data.type === 'Celebration' && (
								<FormControlLabel
									control={
										<Checkbox
											color="success"
											value={data.securityOption}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setData({
													...data,
													securityOption: event.target.checked,
												})
											}
											checked={data.securityOption}
										/>
									}
									label="Security and bodyguards"
								/>
							)}
							<FormControlLabel
								control={
									<Checkbox
										color="success"
										value={data.barOption}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setData({
												...data,
												barOption: event.target.checked,
											})
										}
										checked={data.barOption}
									/>
								}
								label="Bar option with bartending service"
							/>
						</FormGroup>
					</Grid>
					<Grid item sm={12}>
						<Typography component="h5" variant="body2" sx={{ mt: 2, mb: 2 }}>
							* require
						</Typography>
					</Grid>
					<Grid item sm={5.5}></Grid>
				</Grid>
				<Button
					variant="contained"
					endIcon={<EditIcon />}
					sx={{ fontWeight: 600 }}
					onClick={handleEditOrder}
				>
					Edit Order
				</Button>
			</Box>
			{updateSuccess && (
				<Alert sx={{mt:2}} severity="success">
					Order updated! You will be redirected in a moment...
				</Alert>
			)}
		</AppContainer>
	);
};

export default EditOrder;
