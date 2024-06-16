export const statusFormatter = (statusNumber: number) => {
	switch (statusNumber) {
		case 1:
			return 'Submitted';
		case 2:
			return 'Wait for payment';
		case 3:
			return 'Payments accepted';
		case 4:
			return 'Finished';
		case 5:
			return 'Rejected';
	}
};
export const statusGetter = (statusText: string) => {
	switch (statusText) {
		case 'Submitted':
			return 1;
		case 'Wait for payment':
			return 2;
		case 'Payments accepted':
			return 3;
		case 'Finished':
			return 4;
		case 'Rejected':
			return 5;
	}
};

export const statuses = [
	'Submitted',
	'Wait for payment',
	'Payments accepted',
	'Finished',
	'Rejected'
];
