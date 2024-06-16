import { Chip } from '@mui/material';
import React from 'react';

interface IProps {
	type: string;
}
const StatusChip = ({ type }: IProps) => {
	return (
		<div>
			{type === 'Submitted' && (
				<Chip label="Submitted" size="small" color="success" />
			)}
			{type === 'Wait for payment' && (
				<Chip label="Waiting for payment" size="small" color="warning" />
			)}
			{type === 'Payments accepted' && (
				<Chip
					label="Payment accepted"
					size="small"
					color="primary"
					sx={{ backgroundColor: 'dodgerblue' }}
				/>
			)}

			{type === 'Finished' && <Chip label="Finished" size="small" />}
			{type === 'Rejected' && <Chip label="Rejected" size="small" color="error" />}
		</div>
	);
};

export default StatusChip;
