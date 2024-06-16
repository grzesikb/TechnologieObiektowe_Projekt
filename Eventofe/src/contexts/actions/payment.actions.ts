import {
	IPayment,
	IPaymentAction,
	IPaymentInfo,
} from '../../shared/interfaces/payment.interface';
import {
	IUser,
	IUserAction,
	IUserState,
} from '../../shared/interfaces/user.interface';

export const paymentActions = {
	createData: (state: IPayment, action: IPaymentAction): IPayment => {
		return { ...state, payment_info: action.payload as IPaymentInfo };
	},
};
