import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, useTheme } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AppDataGrid from '../../common/AppDataGrid';
import { useMutation } from 'react-query';
import {
	deleteWorkerService,
	getWorkersService,
} from '../../../services/workerService';
import { GridRowId } from '@mui/x-data-grid-pro';

const WorkerList = () => {
	const theme = useTheme();
	const [workers, setWorkers] = useState<any[]>([]);
	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 475 },
		{
			field: 'email',
			headerName: 'Email',
			width: 475,
			sortable: false,
			editable: true,
		},

		{
			field: 'actions',
			headerName: 'Actions',
			width: 100,
			sortable: false,
			renderCell: (params: GridRenderCellParams<any>) => (
				<IconButton
					onClick={() => setOpenDialog({ open: true, workerID: params.id })}
					title="Delete Guest"
				>
					<DeleteIcon color="error" />
				</IconButton>
			),
		},
	];

	const handleClose = () => {
		setOpenDialog({
			open: false,
			workerID: '',
		});
	};


	const {
		mutate: getMutate,
		isSuccess: getSuccess,
		data: getData,
	} = useMutation(getWorkersService);

	const {
		mutate: deleteMutate,
		isSuccess: deleteSuccess,
		data: deleteData,
	} = useMutation(deleteWorkerService);

	useEffect(() => {
		getMutate(localStorage.getItem('accessToken') as string);
	}, []);

	useEffect(() => {
		if (deleteSuccess) {
			window.location.reload();
		}
	}, [deleteSuccess]);

	useEffect(() => {
		let isMounted = true;

		if (getSuccess && isMounted) {
			setWorkers(getData.data);
		}
		return () => {
			isMounted = false;
		};
	});

	const handleDelete = (id: string) => {
		deleteMutate({
			accessToken: localStorage.getItem('accessToken') as string,
			id,
		});
	};

	const [openDialog, setOpenDialog] = useState<{
		open: boolean;
		workerID: GridRowId;
	}>({
		open: false,
		workerID: '',
	});

	return (
		<>
		<AppDataGrid rows={workers} columns={columns} label="Workers" mb={10} />
		<Dialog open={openDialog.open} onClose={handleClose}>
						<DialogTitle>
							Are you sure you want to delete worker?
						</DialogTitle>

						<DialogActions>
							<Button
								onClick={handleClose}
								sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
							>
								No
							</Button>
							<Button
								onClick={() => handleDelete(openDialog.workerID as string)}
								variant="contained"
								color="error"
							>
								Yes
							</Button>
					</DialogActions>
			</Dialog>
		</>
	);
};

export default WorkerList;
