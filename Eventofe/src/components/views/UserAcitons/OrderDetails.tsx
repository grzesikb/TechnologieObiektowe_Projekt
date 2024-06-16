import React, { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';

import AppContainer from '../../common/AppContainer';
import StatusChip from '../../common/StatusChip';
import { IOrder } from '../../../shared/interfaces/order.interface';
import { useMutation } from 'react-query';
import { eventDetailService } from '../../../services/eventService';
import { convertType } from '../../../tools/TypeConverter';
import { statusFormatter } from '../../../tools/StatusFormatter';
import UserContext from '../../../contexts/context/UserContext';

const OrderDetails = () => {
	const { state } = useContext(UserContext);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const typeParam = urlParams.get('id');
	const {
		mutate,
		data: responseData,
		isSuccess,
		isLoading,
	} = useMutation(eventDetailService);

	const [data, setData] = useState<IOrder>({
		id:'',
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
		price: 0
	});

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
					id:'',
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
					types: 'Birthdays',
					price: orderDetails.cost
				});
		}
	}, [isSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Order details: ${typeParam}`}
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Grid container>
				{!isLoading ? (
					<>
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
								{data.type}
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
							<StatusChip type={data.status} />
						</Grid>


						{/* ---------------- Detailed data ---------------- */}

						{data.type === 'Public' && (
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
										{data.minAge ? data.minAge : 'Not specified'}
									</Typography>
								</Grid>
								<Grid item sx={{ ml: 10 }}>
									<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
										Artist:
									</Typography>
									<Typography variant="h6" sx={{ fontSize: 16 }}>
										{data.artist ? data.artist : 'Not specified'}
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
									</Typography>
								</Grid>
								<Grid item sx={{ ml: 5 }}>
									<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
										Company name:
									</Typography>
									<Typography variant="h6" sx={{ fontSize: 16 }}>
										{data.companyName}
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
								{data.cateringOption && ' Catering option, '}
							</Typography>
						</Grid>
						<Grid item xs={12} sx={{ mt: 2 }}>
							<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
								Additional info:
							</Typography>
							<Typography variant="h6" sx={{ fontSize: 16 }}>
								{data.additionalInfo ? data.additionalInfo : ''}
							</Typography>
						</Grid>
						{data.price!==null && (
						<Grid item xs={12} sx={{ mt: 2 }}>
							<Typography variant="h6" sx={{ fontSize: 16, color: 'grey' }}>
								Cost:
							</Typography>
							<Typography variant="h6" sx={{ fontSize: 16 }}>
								{data.price} zł
							</Typography>
						</Grid>)}
					</>
				) : (
					<CircularProgress />
				)}
			</Grid>
		</AppContainer>
	);
};

export default OrderDetails;
