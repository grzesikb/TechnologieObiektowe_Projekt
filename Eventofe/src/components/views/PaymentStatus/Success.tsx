import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AppContainer from '../../common/AppContainer';
import { IPaymentDetails } from '../../../shared/interfaces/payment.interface';
import { useMutation } from 'react-query';
import { eventDetailService } from '../../../services/eventService';
import UserContext from '../../../contexts/context/UserContext';

// eslint-disable react/prop-types
const Success = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const typeParam = urlParams.get('id');
	const cost = urlParams.get('cost');
	const { state } = useContext(UserContext);

	const { mutate, isSuccess, data } = useMutation(eventDetailService);

	useEffect(() => {
		mutate({
			access_token: localStorage.getItem('accessToken') as string,
			id: typeParam as string,
		});
	}, []);

	useEffect(() => {
		if (isSuccess) {
			setPaymentDetails({
				id: typeParam as string,
				name: data.data.payload[0].name,
				startDate: data.data.payload[0].start_date,
				cost: 69000,
			});
		}
	}, [isSuccess]);

	const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({
		id: null,
		name: '',
		startDate: '',
		cost: '',
	});

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Transaction for order: ${paymentDetails.id}`}
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Grid container>
				<Grid
					item
					xs={12}
					sx={{ fontSize: 25, fontWeight: 700, color: 'green' }}
				>
					Successfuly
				</Grid>
				<Grid item xs={12} sx={{ mt: 2 }}>
					Cost:
				</Grid>
				<Grid item xs={12} sx={{ fontSize: 25, fontWeight: 700, mb: 4}}>
					{`${cost}zł`}
				</Grid>
				<Grid item xs={5.5}>
					Name: Płatność za zamówione wydarzenie
				</Grid>
				<Grid item xs={1}></Grid>
				<Grid item xs={5.5}>
					Order date: {paymentDetails.startDate}
				</Grid>
			</Grid>
		</AppContainer>
	);
};

export default Success;
