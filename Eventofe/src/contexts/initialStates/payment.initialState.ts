import { IPayment } from '../../shared/interfaces/payment.interface';

export const PAYMENT_INITIAL_STATE: IPayment = {
	payment_info: {
		name: '',
		surname: '',
		number: '',
		CCV: '',
		expiration_date: '',
		id:''
	},
};
