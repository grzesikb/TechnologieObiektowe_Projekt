export interface IOrder {
	id?: string;
	name: string;
	startDate: string | null | undefined;
	type: string;
	status: string;
	additionalInfo?: string;
	securityOption?: boolean | undefined;
	barOption?: boolean | undefined;
	artist?: string;
	maxPeople?: number | string;
	minAge?: number | string;
	numberOfSeats?: number | string;
	companyName?: string;
	cateringOption?: boolean | undefined;
	cateringName?: string;
	clientId?: string;
	types?: 'Birthdays' | 'Name days' | 'Bachelorette parties' | '';
	price?: number | string;
	payment_token?: string;
}

export interface IOrderDatesProps {
	startDate?: string | null | undefined;
}

export interface IOrderEventsDataGrid {
	lp: number;
	id: string;
	name: string;
	startDate: string;
	status: string;
}
