/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReceiptIcon from '@mui/icons-material/Receipt';
import { GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import {
	Alert,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogTitle,
	FormControl,
	IconButton,
	MenuItem,
	OutlinedInput,
	Select,
	useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from 'react-router-dom';

import StatusChip from '../../common/StatusChip';
import AppDataGrid from '../../common/AppDataGrid';
import { useMutation } from 'react-query';
import {
	deleteEventService,
	eventDetailService,
	getAllEventsService,
	getInvoice,
	setPriceService,
} from '../../../services/eventService';
import {
	statusFormatter,
	statusGetter,
	statuses,
} from '../../../tools/StatusFormatter';
import { createGuestListService } from '../../../services/guestListService';

const EventList = () => {
	const navigate = useNavigate();
	const [orderId, setOrderId] = useState<any>();
	const {
		mutate: muteInvoice,
		data: invoiceForOrderData,
		isSuccess: isInvoiceSuccess,
		isError: isInvoiceError,
	} = useMutation(getInvoice);

	const {
		mutate: guestListMutate,
		isSuccess: guestListSuccess,
		data: guestListData,
		isError: guestListError,
	} = useMutation(createGuestListService);

	const {
		mutate: deleteMutate,
		isSuccess: deleteSuccess,
		data: deleteData,
	} = useMutation(deleteEventService);

	const {
		mutate: updateMutate,
		data: updateData,
		isSuccess: updateSuccess,
		isLoading,
	} = useMutation(setPriceService);

	const { mutate, data, isSuccess } = useMutation(getAllEventsService);
	const [events, setEvents] = useState<any[]>([]);
	const [lastClickedOrderId, setLastClickedOrderId] = useState('');

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
		if (updateSuccess) {
			window.location.reload();
		}
	}, [updateSuccess]);

	const handleCreateGuestList = async (id: string) => {
		await setOrderId(id);
		await guestListMutate({
			access_token: localStorage.getItem('accessToken') as string,
			orderData: { order_id: id },
		});
	};

	useEffect(() => {
		const order_id = invoiceForOrderData?.data.payload.order_id;
		const invoice_id = invoiceForOrderData?.data.payload.id;
		if (isInvoiceSuccess)
			navigate(
				`/app/invoice-item?invoice_id=${invoice_id}&order_id=${order_id}`
			);
	}, [isInvoiceSuccess]);

	useEffect(() => {
		if (isInvoiceError) navigate(`/app/invoice?id=${lastClickedOrderId}`);
	}, [isInvoiceError]);

	useEffect(() => {
		if (guestListSuccess || guestListError)
			navigate(`/app/guest-list?id=${orderId}`);
	}, [guestListSuccess, guestListError]);

	const [status, setStatus] = useState<string>('');

	const handleStatusChange = async (id: string, option: string) => {
		const response = mutation.mutate({ id, option });
	};

	const columns: GridColDef[] = [
		{ field: 'lp', headerName: '#', width: 60 },
		{ field: 'id', headerName: 'ID', width: 70, sortable: false },
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'startDate', headerName: 'Start Date', width: 150 },
		{
			field: 'status',
			headerName: 'Status',
			sortable: false,
			width: 200,
			renderCell: (params: GridRenderCellParams<any>) => (
				<>
					{isLoading || mutation.isLoading ? (
						<CircularProgress />
					) : (
						<FormControl>
							<Select
								id="status-select"
								value={params.row.status}
								defaultValue={params.row.status}
								onChange={(e) =>
									handleStatusChange(params.id.toString(), e.target.value)
								}
								input={<OutlinedInput id="status-select" />}
								renderValue={(selected) => <StatusChip type={selected} />}
							>
								{statuses.map((name) => (
									<MenuItem key={name} value={name}>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</>
			),
			// valueGetter: (params: GridValueGetterParams) =>
			//   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
		},
		{
			field: 'action',
			headerName: 'Actions',
			width: 300,
			sortable: false,
			renderCell: (params: GridRenderCellParams<any>) => (
				<div>
					<IconButton
						onClick={() => navigate(`/app/order-details?id=${params.id}`)}
						title="Details"
					>
						<ArticleOutlinedIcon />
					</IconButton>
					{events.find((item) => item.id === params.id).status==='Submitted' &&
						<IconButton
							onClick={() => navigate(`/app/edit-order?id=${params.id}`)}
							title="Edit"
						>
							<EditIcon />
						</IconButton>
					}
					{events.find((item) => item.id === params.id).status!=='Rejected' && events.find((item) => item.id === params.id).type !== 1 &&
						<IconButton
						onClick={() => handleCreateGuestList(params.id as string)}
						title="Guest list"
					>
						<PeopleAltIcon />
					</IconButton>
					}

					
					{events.find((item) => item.id === params.id).status==='Wait for payment' &&
					(<IconButton
						onClick={() => navigate(`/app/pricing?id=${params.id}`)}
						title="Pricing"
					>
						<RequestQuoteIcon />
					</IconButton>)
					}

					{events.find((item) => item.id === params.id).status==='Submitted' &&
					(<IconButton
						onClick={() => navigate(`/app/pricing?id=${params.id}`)}
						title="Pricing"
					>
						<RequestQuoteIcon />
					</IconButton>)
					}


					{events.find((item) => item.id === params.id).status==='Payments accepted'&&
					(<IconButton
						onClick={() => {
							setLastClickedOrderId(params.id as string);
							muteInvoice({
								access_token: localStorage.getItem('accessToken') as string,
								invoiceData: params.id as string,
							});
						}}
						title="Invoice"
					>
						<ReceiptIcon />
					</IconButton>)
					}

					{events.find((item) => item.id === params.id).status==='Finished' &&
					(<IconButton
						onClick={() => {
							setLastClickedOrderId(params.id as string);
							muteInvoice({
								access_token: localStorage.getItem('accessToken') as string,
								invoiceData: params.id as string,
							});
						}}
						title="Invoice"
					>
						<ReceiptIcon />
					</IconButton>)
					}
					
					<IconButton
						onClick={() => setOpenDialog({ open: true, orderID: params.id })}
						title="Delete"
					>
						<DeleteIcon color="error" />
					</IconButton>
				</div>
			),
		},
	];

	useEffect(() => {
		mutate(localStorage.getItem('accessToken') as string);
	}, []);

	useEffect(() => {
		if (isSuccess) {
			const events = data.data.payload;
			const formattedEvents: any[] = [];

			events.map((event: any, index: number) => {
				formattedEvents.push({
					lp: index,
					id: event.id,
					name: event.name,
					startDate: event.start_date,
					finishDate: event.start_date,
					status: statusFormatter(event.status),
					payment_token: event.payment_token,
					type: event.type,
				});
			});
			setEvents(formattedEvents);
		}
	}, [isSuccess]);

	const theme = useTheme();
	const [openDialog, setOpenDialog] = useState<{
		open: boolean;
		orderID: GridRowId;
	}>({
		open: false,
		orderID: '',
	});

	const handleDelete = (id: string) => {
		deleteMutate({
			access_token: localStorage.getItem('accessToken') as string,
			id,
		});
	};
	useEffect(() => {
		if (deleteSuccess) {
			window.location.reload();
		}
	}, [deleteSuccess]);

	const handleClose = () => {
		setOpenDialog({
			open: false,
			orderID: '',
		});
	};

	return (
		<div>
			<AppDataGrid rows={events} columns={columns} label="Orders" mb={10} />
			<Dialog open={openDialog.open} onClose={handleClose}>
				<DialogTitle>
					Are you sure you want to cancel the order: {openDialog.orderID}
				</DialogTitle>

				<DialogActions>
					<Button
						onClick={handleClose}
						sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
					>
						No
					</Button>
					<Button
						onClick={() => handleDelete(openDialog.orderID as string)}
						variant="contained"
						color="error"
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
			{deleteSuccess && (
				<Alert sx={{mt: 2}} severity="success">
					Order deleted! Page will be refreshed in a moment...
				</Alert>
			)}
		</div>
	);
};

export default EventList;
