import React, { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	useTheme,
} from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

import AppContainer from '../../common/AppContainer';
import AppDataGrid from '../../common/AppDataGrid';
import { IGuestList } from '../../../shared/interfaces/guest-list.interface';
import { useMutation } from 'react-query';
import {
	addGuestService,
	getGuestsService,
} from '../../../services/guestListService';
import { deleteGuestService } from '../../../services/guestService';
import { Validator } from '../../../tools/Validator';

const GuestList = () => {
	const [guests, setGuests] = useState<any[]>([]);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const typeParam = urlParams.get('id');
	const [showAddGuestSuccess, setShowAddGuestSuccess] = useState(false);
	const [showDeleteGuestSuccess, setShowDeleteGuestSuccess] = useState(false);
	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
	});

	const {
		mutate: getGuestMutate,
		data: getGuestData,
		isSuccess: getGuestSuccess,
	} = useMutation(getGuestsService);

	const {
		mutate: addGuestMutate,
		data: addGuestData,
		isSuccess: addGuestSuccess,
	} = useMutation(addGuestService);

	const {
		mutate: deleteGuestMutate,
		data: deleteGuestData,
		isSuccess: deleteGuestSuccess,
	} = useMutation(deleteGuestService);

	const validateForm = async () => {
		const firstNameError = await Validator.checkRequiredString(guest.firstName);
		const lastNameError = await Validator.checkRequiredString(guest.lastName);
		setErrors({
			firstName: firstNameError ?? '',
			lastName: lastNameError ?? '',
		})
		return !(firstNameError || lastNameError)
	};

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 80 },
		{
			field: 'fisrtName',
			headerName: 'First Name',
			width: 230,
			editable: true,
		},
		{ field: 'lastName', headerName: 'Last Name', width: 230, editable: true },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 100,
			sortable: false,
			renderCell: (params: GridRenderCellParams<any>) => (
				<IconButton
					onClick={() => deleteGuestHandler(params.id as string)}
					title="Delete Guest"
				>
					<DeleteIcon color="error" />
				</IconButton>
			),
		},
	];

	const deleteGuestHandler = (id: string) => {
		setGuests(guests.filter((guest) => guest.id !== id));
		deleteGuestMutate({
			access_token: localStorage.getItem('accessToken') as string,
			id,
		});
	};

	useEffect(() => {
		getGuestMutate({
			access_token: localStorage.getItem('accessToken') as string,
			id: typeParam as string,
		});
	}, []);

	useEffect(() => {
		let isMounted = true;
		if (getGuestSuccess) {
			const formattedGuests: any[] = [];

			getGuestData.data.payload.map((item: any) => {
				formattedGuests.push({
					id: item?.id,
					fisrtName: item?.name,
					lastName: item?.surname,
					table: item.table_number,
				});
			});
			isMounted && setGuests(formattedGuests);
		}

		return () => {
			isMounted = false;
		};
	}, [getGuestSuccess]);
	const theme = useTheme();
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [guest, setGuest] = useState<IGuestList>({
		id: '',
		firstName: '',
		lastName: '',
		table: undefined,
	});

	const handleCloseDialog = async () => {
		setOpenDialog(false);
	};

	const handleAddGuest = async () => {
		const guestEnitity = {
			name: guest.firstName,
			surname: guest.lastName,
			table_number: 1,
			order_id: typeParam,
		};

		if(await validateForm()){
			addGuestMutate({
				access_token: localStorage.getItem('accessToken') as string,
				guestData: guestEnitity,
			});
		}
	};

	useEffect(() => {
		if (addGuestSuccess) {
			setOpenDialog(false);
			getGuestMutate({
				access_token: localStorage.getItem('accessToken') as string,
				id: typeParam as string,
			});
			setGuest({
				id: '',
				firstName: '',
				lastName: '',
				table: undefined,
			})
			setShowAddGuestSuccess(true);

			setTimeout(() => {
				setShowAddGuestSuccess(false);
			}, 1000);
		}
	}, [addGuestSuccess]);

	useEffect(() => {
		if (deleteGuestSuccess) {
			setShowDeleteGuestSuccess(true);

			setTimeout(() => {
				setShowDeleteGuestSuccess(false);
			}, 1000);
		}
	}, [deleteGuestSuccess]);

	return (
		<AppContainer
			back="/app/dashboard"
			label={`Guest list for order: ${typeParam}`}
			navbar
		>
			<Button
				variant="contained"
				sx={{ fontWeight: 600, width: '100%', mt: 1, mb: 1 }}
				onClick={() => setOpenDialog(true)}
			>
				Add Guest
			</Button>
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Add guest</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						id="firstName"
						label="First Name"
						type="firstName"
						fullWidth
						required
						value={guest.firstName}
						onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
						error={!!errors.firstName}
						helperText={errors.firstName}
					/>
					<TextField
						margin="dense"
						id="lastName"
						label="Last Name"
						type="lastName"
						fullWidth
						required
						value={guest.lastName}
						onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
						error={!!errors.lastName}
						helperText={errors.lastName}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseDialog}
						sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
					>
						Cancel
					</Button>
					<Button
						onClick={handleAddGuest}
						sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<AppDataGrid
				rows={guests}
				columns={columns}
				exportOption
			/>
			{showAddGuestSuccess && (
				<Alert sx={{mt: 2}} severity="success">Guest added!</Alert>
			)}
			{showDeleteGuestSuccess && (
				<Alert sx={{mt: 2}} severity="success">Guest deleted!</Alert>
			)}
		</AppContainer>
		
	);
};

export default GuestList;
