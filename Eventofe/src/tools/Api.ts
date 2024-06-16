import axios, { AxiosInstance } from 'axios';
import { InvoiceCreateI } from '../shared/interfaces/invoice.interface';
import { InvoiceItemCreateI } from '../shared/interfaces/invoiceItem.interface';

export class Api {
	private static axiosInstance: AxiosInstance;

	public static async initAxios() {
		Api.axiosInstance = axios.create({
			baseURL: 'http://localhost:8000',
		});
	}

	static async signup(data: any) {
		return Api.axiosInstance.post('/user/', data, {
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}
	static async signin(data: any) {
		return Api.axiosInstance.post('/auth/login/', data, {
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}
	static async signInGoogle(data: any) {
		return Api.axiosInstance.get('/auth/google_auth?token=' + data, {
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}
	static async checkEmail(email: string) {
		return Api.axiosInstance.get('/user/checkEmail', {
			params: { email },
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}
	static async refresh(refresh_token: any) {
		console.log(refresh_token.data.refresh_token, 'chuj ci w dupw');
		return Api.axiosInstance.get('/auth/refreshToken/', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${refresh_token.data.refresh_token}`,
			},
		});
	}
	static async identify(access_token: string) {
		return Api.axiosInstance.get('/user/me/', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async getUserEvents(access_token: string) {
		return Api.axiosInstance.get('/order/my/', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createEvent(access_token: string, data: any) {
		return Api.axiosInstance.post('/order/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}
	//
	static async getEventDetails(access_token: string, id: string) {
		return Api.axiosInstance.get('/order/' + id, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async updateEvent(access_token: string, data: any) {
		return Api.axiosInstance.post('/order/update/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async setPrice(access_token: string, data: any) {
		return Api.axiosInstance.post('/order/update_by_worker/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createInvoice(access_token: string, data: InvoiceCreateI) {
		return Api.axiosInstance.post('/invoice/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createInvoiceItem(
		access_token: string,
		data: InvoiceItemCreateI
	) {
		return Api.axiosInstance.post('/invoice_item/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}
	static async getInvoice(access_token: string, data: string) {
		return Api.axiosInstance.get(`/invoice/${data}`, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}
	static async deleteEvent(access_token: string, id: string) {
		return Api.axiosInstance.delete('/order/' + id, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async checkDate(date: string) {
		return Api.axiosInstance.post('/order/check_date', null, {
			params: { date },
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}

	static async getDates() {
		return Api.axiosInstance.get('/order/validation/orders_dates', {
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	}

	static async createGuestList(access_token: string, data: any) {
		return Api.axiosInstance.post('/guestList/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async getGuests(access_token: string, id: string) {
		return Api.axiosInstance.get('/order/' + id + '/guest_list', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async addGuest(access_token: string, data: any) {
		return Api.axiosInstance.post('/guest/', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async editUserProfile(access_token: string, data: any) {
		return Api.axiosInstance.post('/user/update', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async changePassword(access_token: string, data: any) {
		return Api.axiosInstance.post('/user/resetPwd', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createPaymentData(access_token: string, data: any) {
		return Api.axiosInstance.post('/payment', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async updatePaymentData(access_token: string, data: any) {
		return Api.axiosInstance.post('/payment/update', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async getAllEvents(access_token: string) {
		return Api.axiosInstance.get('/order/', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async deleteGuest(access_token: string, id: string) {
		return Api.axiosInstance.delete('/guest/' + id, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createPersonalData(access_token: string, data: any) {
		return Api.axiosInstance.post('/user/create-personal-data', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async getClientPersonalData(access_token: string, data: string) {
		return Api.axiosInstance.get('/user/user_info/'+data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async createWorker(access_token: string, data: any) {
		return Api.axiosInstance.post('/user/addWorker', data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async getWorker(access_token: string) {
		return Api.axiosInstance.get('/user/worker/workers', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	static async deleteWorker(access_token: string, id: string) {
		return Api.axiosInstance.delete('/user/worker/' + id, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				Authorization: `Bearer ${access_token}`,
			},
		});
	}
}
