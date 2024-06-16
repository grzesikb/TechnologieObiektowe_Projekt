export const convertType = (id: number) => {
	switch (id) {
		case 1:
			return 'Public';

		case 2:
			return 'Occasional';

		case 3:
			return 'Private';
	}
};

export const typeGetter = (id: string) => {
	switch (id) {
		case 'Public':
			return 1;

		case 'Occasional':
			return 2;

		case 'Private':
			return 3;
	}
};
