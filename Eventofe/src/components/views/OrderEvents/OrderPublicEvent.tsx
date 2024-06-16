import React, { useEffect, useState } from 'react';
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
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

import AppContainer from '../../common/AppContainer';
import {
	IOrder,
	IOrderDatesProps,
} from '../../../shared/interfaces/order.interface';
import { useMutation } from 'react-query';
import {
	createEventService,
	userEventsService,
} from '../../../services/eventService';
import { Validator } from '../../../tools/Validator';

const OrderPublicEvent = (props: IOrderDatesProps) => {
	const [data, setData] = useState<IOrder>({
		name: '',
		startDate: props.startDate,
		type: '1',
		status: '1',
		additionalInfo: '',
		securityOption: true,
		barOption: false,
		artist: '',
		maxPeople: '',
		minAge: '',
		numberOfSeats: '',
		companyName: '',
		cateringOption: false,
		cateringName: '',
		types: '',
	});

	const navigate = useNavigate();
	const { mutate, isSuccess } = useMutation(createEventService);

	const [errors, setErrors] = useState({
		name: '',
		maxPeople: '',
		age: ''
	});

	const validateForm = async () => {
		const nameError = await Validator.checkRequiredString(data.name);
		const maxPeopleError = await Validator.checkRequiredNumber(data.maxPeople, 'public');
		const ageError = data.minAge ? await Validator.checkAge(data.minAge) : '';
		
		
		setErrors({
			name: nameError ?? '',
			maxPeople: maxPeopleError ?? '',
			age: ageError ?? '',
		})
		return !(nameError || maxPeopleError || ageError)
	};

	const handleOrderEvent = async () => {
		const orderEntity = {
			name: data.name,
			bar_option: data.barOption,
			security: data.securityOption,
			type: +data.type!,
			start_date: data.startDate,
			additional_info: data.additionalInfo,
			status: 1,
			artist_name: data.artist,
			max_nr_of_people: +data.maxPeople!,
			minimal_age: +data.minAge!,
			company_name: data.companyName,
			catering: data.cateringOption,
			number_of_seats: +data.numberOfSeats!,
		};

		// add order
		if(await validateForm()){
			mutate({
				access_token: localStorage.getItem('accessToken') as string,
				orderData: orderEntity,
			});
		}
	};

	useEffect(() => {
		let isMounted = true;

		isMounted &&
			isSuccess &&
			setTimeout(() => {
				navigate('/app/dashboard');
			}, 3000);
		return () => {
			isMounted = false;
		};
	}, [isSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label="Order Public Event"
			additionalLabel="Dance parties, Concerts, Club events"
			navbar
		>
			<Typography
				component="h2"
				variant="h5"
				sx={{
					fontWeight: 400,
					mb: 1,
					fontSize: 15,
					color: 'grey',
				}}
			>
				{`Selected date: ${props.startDate}`}
			</Typography>

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
							error={!!errors.name}
							helperText={errors.name}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							margin="dense"
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
							id="maxPeople"
							label="Maximum number of people"
							name="maxPeople"
							value={data.maxPeople}
							onChange={(e) => setData({ ...data, maxPeople: e.target.value })}
							error={!!errors.maxPeople}
							helperText={errors.maxPeople}
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
							onChange={(e) => setData({ ...data, minAge: e.target.value })}
							error={!!errors.age}
							helperText={errors.age ? errors.age : "Minimum age of a person to let him or her into the party"}
						/>
					</Grid>
					<Grid item sm={12}>
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
							<FormControlLabel
								sx={{ mt: 5 }}
								control={
									<Checkbox
										value={data.barOption}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setData({
												...data,
												barOption: event.target.checked,
											})
										}
										color="success"
									/>
								}
								label="Bar option with bartending service"
							/>

							<FormControlLabel
								control={<Checkbox color="success" disabled checked />}
								label="* Security and bodyguards"
								value={data.securityOption}
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
					endIcon={<SendIcon />}
					sx={{ fontWeight: 600 }}
					onClick={handleOrderEvent}
					disabled={isSuccess}
				>
					Order public event
				</Button>
			</Box>
			{isSuccess && (
				<Alert sx={{mt: 2}} severity="success">
					The event has been created! You are about to be redirected...
				</Alert>
			)}
		</AppContainer>
	);
};

export default OrderPublicEvent;
