import { Dispatch } from 'react';

export interface IPaymentDetails {
	id: string | null;
	name: string;
	startDate: string | null | undefined;
	cost: number | string;
}
export interface IPaymentContext {
	state: IPayment;
	dispatch: Dispatch<any>;
}
export interface IPayment {
	payment_info: IPaymentInfo;
}
export interface IPaymentInfo {
	name: string;
	surname: string;
	number: string | number;
	CCV: string | number;
	expiration_date: string | Date;
	id: string;
}
export interface IPaymentAction {
	type: PaymentActions;
	payload: IPaymentInfo;
}
export enum PaymentActions {
	CREATE_DATA = 'createData',
}
