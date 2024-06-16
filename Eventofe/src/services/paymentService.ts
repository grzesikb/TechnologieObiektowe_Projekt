import { Api } from '../tools/Api';

export const createPaymentDataService = async (data: {
	access_token: string;
	paymentData: any;
}) => {
	return Api.createPaymentData(data.access_token, data.paymentData);
};

export const updatePaymentDataService = async (data: {
	access_token: string;
	paymentData: any;
}) => {
	return Api.createPaymentData(data.access_token, data.paymentData);
};
