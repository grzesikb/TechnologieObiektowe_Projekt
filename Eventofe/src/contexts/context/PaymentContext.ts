import { createContext } from 'react';
import { PAYMENT_INITIAL_STATE } from '../initialStates/payment.initialState';
import { IPaymentContext } from '../../shared/interfaces/payment.interface';

const PaymentContext = createContext<IPaymentContext>({
	state: PAYMENT_INITIAL_STATE,
	dispatch: () => null,
});

export default PaymentContext;
