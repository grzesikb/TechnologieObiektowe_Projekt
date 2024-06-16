import { ReactNode, useMemo, useReducer } from 'react';
import { paymentReducer } from '../reducers/payment.reducer';
import { PAYMENT_INITIAL_STATE } from '../initialStates/payment.initialState';
import PaymentContext from '../context/PaymentContext';

interface IPaymentContextProviderProps {
	children: ReactNode;
}

export const PaymentContextProvider = ({
	children,
}: IPaymentContextProviderProps) => {
	const [state, dispatch] = useReducer(paymentReducer, PAYMENT_INITIAL_STATE);

	const value = useMemo(() => ({ state, dispatch }), [state]);

	return (
		<PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
	);
};
