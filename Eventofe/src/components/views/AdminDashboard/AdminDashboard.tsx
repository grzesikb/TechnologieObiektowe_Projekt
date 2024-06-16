import React, { useEffect, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	TextField,
	useTheme,
} from '@mui/material';
import Navbar from '../../common/Navbar/Navbar';
import WorkerList from './WorkerList';
import { IWorkersList } from '../../../shared/interfaces/admin.interface';
import { useMutation } from 'react-query';
import { createWorkerService } from '../../../services/workerService';
import { Validator } from '../../../tools/Validator';

const AdminDashboard = () => {
	const theme = useTheme();
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [worker, setWorker] = useState<IWorkersList>({
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		repeatPassword: '',
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		repeatPassword: '',
	});

	const validateForm = async () => {
		const emailError = await Validator.checkEmail(worker.email);
		const passwordError = await Validator.checkPassword(worker.password, true);
		const repeatPassword = await Validator.checkRepeatPassword(worker.password, worker.repeatPassword)
		setErrors({
			email: emailError ?? '',
			password: passwordError ?? '',
			repeatPassword: repeatPassword ?? '',
		})
		return !(emailError || passwordError || repeatPassword)
	};

	const handleCloseDialog = async () => {
		setOpenDialog(false);
	};

	const {
		mutate: addMutate,
		isSuccess: addSuccess,
		data: addData,
		isError,
		error
	} = useMutation(createWorkerService);

	const handleAddWorker = async () => {
		const datatoSend = {
			email: worker.email,
			password: worker.password,
			role: 2,
		};
		if(await validateForm()){
			addMutate({
				accessToken: localStorage.getItem('accessToken') as string,
				data: datatoSend,
			});
		}
	};

	useEffect(() => {
		if (addSuccess) {
			setTimeout(() => window.location.reload(), 2000);
		}
	}, [addSuccess]);

	return (
		<Box>
			<Navbar permission="Admin" />
			<Paper
				variant="outlined"
				sx={{ padding: 3, marginTop: 10, borderRadius: 4 }}
			>
				<Button
					variant="contained"
					sx={{ fontWeight: 600, float: 'right' }}
					onClick={() => setOpenDialog(true)}
				>
					Add Worker
				</Button>
				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogTitle>Add new worker</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							id="email"
							label="Email Address"
							type="email"
							fullWidth
							required
							value={worker.email}
							onChange={(e) => setWorker({ ...worker, email: e.target.value })}
							error={!!errors.email}
							helperText={errors.email}
						/>

						<TextField
							margin="dense"
							id="password"
							label="Password"
							type="password"
							fullWidth
							required
							value={worker.password}
							onChange={(e) =>
								setWorker({ ...worker, password: e.target.value })
							}
							error={!!errors.password}
							helperText={errors.password}
						/>

						<TextField
							margin="dense"
							id="repeatPassword"
							label="Repeat your password"
							type="password"
							fullWidth
							required
							value={worker.repeatPassword}
							onChange={(e) =>
								setWorker({ ...worker, repeatPassword: e.target.value })
							}
							error={!!errors.repeatPassword}
							helperText={errors.repeatPassword}
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
							onClick={handleAddWorker}
							sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
						>
							Add
						</Button>
						
					</DialogActions>
					{addSuccess && (
						<Alert  severity="success">
							Worker created! Page will be refreshed in a moment....
						</Alert>
						)}
						{isError && (
						<Alert severity="error">{(error as any).response.data.detail}</Alert>
						)}
				</Dialog>
				<WorkerList />
				
			</Paper>
		</Box>
	);
};

export default AdminDashboard;
