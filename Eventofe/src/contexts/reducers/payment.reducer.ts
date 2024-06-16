import {
	IPayment,
	IPaymentAction,
} from '../../shared/interfaces/payment.interface';
import { paymentActions } from '../actions/payment.actions';

export const paymentReducer = (state: IPayment, action: IPaymentAction) => {
	const handler = paymentActions[action.type];

	return handler(state, action);
};
