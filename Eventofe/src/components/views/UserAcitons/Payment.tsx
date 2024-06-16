import React, { useContext, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, Grid, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AppContainer from '../../common/AppContainer';
import {
	IPayment,
	IPaymentDetails,
	IPaymentInfo,
} from '../../../shared/interfaces/payment.interface';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from 'react-query';
import { eventDetailService, setPriceService } from '../../../services/eventService';
import {
	statusFormatter,
	statusGetter,
	statuses,
} from '../../../tools/StatusFormatter';
import UserContext from '../../../contexts/context/UserContext';
const stripePromise = loadStripe(
	'pk_test_51NGhtFCx3j1gch1GW7UZ1fU5YAc9Cw1hvRPmehqnNmIeqlECsQxft8xdNnTRUzH5LjfdRqNVZLNptk23VCY8GgV200Ll4DxgVl'
);

const Payment = () => {
	const theme = useTheme();
	const { state } = useContext(UserContext);
	const urlParams = new URLSearchParams(window.location.search);
	const typeParam = urlParams.get('id');

	const isPaymentMethod = true;

	const { mutate, isSuccess, data } = useMutation(eventDetailService);

	const {
		mutate: updateMutate,
		data: updateData,
		isSuccess: updateSuccess,
		isLoading,
	} = useMutation(setPriceService);

	const [openDialog, setOpenDialog] = useState<{
		open: boolean;
	}>({
		open: false,
	});

	const mutation = useMutation({
		mutationFn: (data: { id: string; option: string }) =>
			eventDetailService({
				access_token: localStorage.getItem('accessToken') as string,
				id: data.id,
			}),
		onMutate: () => {},
		onSuccess(data, variables, context) {
			const eventData = data.data.payload[0];
			eventData.status = statusGetter(variables.option);

			updateMutate({
				access_token: localStorage.getItem('accessToken') as string,
				orderData: eventData,
			});
		},
		onError(error, variables, context) {},
	});

	useEffect(() => {
		mutate({
			access_token: localStorage.getItem('accessToken') as string,
			id: typeParam as string,
		});
	}, []);

	useEffect(() => {
		console.log(window.location.pathname);
	}, []);

	useEffect(() => {
		if (isSuccess) {
			setPaymentDetails({
				id: typeParam as string,
				name: data.data.payload[0].name,
				startDate: data.data.payload[0].start_date,
				cost: data.data.payload[0].cost,
			});
		}
	}, [isSuccess]);

	const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({
		id: typeParam,
		name: '',
		startDate: '',
		cost: '',
	});

	const navigate = useNavigate();

	const handlePayment = async () => {
		const stripe = await stripePromise;
		await stripe?.redirectToCheckout({
			lineItems: [
				{
					price: 'price_1NJNYlCx3j1gch1Gs6lGhWny', // Replace with the ID of your price
					quantity: +paymentDetails.cost,
				},
			],
			mode: 'payment',
			successUrl: `http://localhost:3000/app/payment/success?id=${paymentDetails.id}&cost=${paymentDetails.cost}`,
			cancelUrl: 'http://localhost:3000/app/dashboard',
			clientReferenceId: typeParam!
		});
	};

	const handleRejectPayment = async () => {
		const response = await mutation.mutate({ id: paymentDetails?.id!, option: 'Rejected'});
		navigate('/app/dashboard');
	};

	const handleClose = () => {
		setOpenDialog({
			open: false,
		});
	};

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Payment order: ${typeParam}`}
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Dialog open={openDialog.open} onClose={handleClose}>
				<DialogTitle>
					Are you sure you want to reject order?
				</DialogTitle>

				<DialogActions>
					<Button
						onClick={handleClose}
						sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
					>
						No
					</Button>
					<Button
						onClick={() => handleRejectPayment()}
						variant="contained"
						color="error"
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
			<Grid container>
				<Grid item xs={12}>
					{`Name:  ${paymentDetails.name}`}
				</Grid>

				<Grid item xs={12}>
					{`Start date:  ${paymentDetails.startDate}`}
				</Grid>

				<Grid item xs={12} sx={{ mt: 2 }}>
					Cost:
				</Grid>
				<Grid
					item
					xs={12}
					sx={{ fontSize: 25, fontWeight: 700, color: 'green' }}
				>
					{`${paymentDetails.cost}zł`}
				</Grid>
						<Button
							variant="contained"
							sx={{ fontWeight: 600, mt: 3 }}
							onClick={handlePayment}
						>
							Pay for the order
						</Button>
						<Button
							variant="text"
							sx={{
								fontWeight: 600,
								mt: 3,
								ml: 2,
								color: theme.palette.mode === 'dark' ? '#fff' : '#000',
							}}
							onClick={() => setOpenDialog({ open: true})}
						>
							Reject the order
						</Button>
			</Grid>
		</AppContainer>
	);
};

export default Payment;
