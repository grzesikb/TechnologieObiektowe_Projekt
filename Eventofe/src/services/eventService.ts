import { Api } from '../tools/Api';
import {
	InvoiceCreateI,
	InvoiceI,
} from '../shared/interfaces/invoice.interface';
import {
	InvoiceItemCreateI,
	InvoiceItemI,
} from '../shared/interfaces/invoiceItem.interface';

export const userEventsService = async (access_token: string) => {
	return Api.getUserEvents(access_token);
};

export const createEventService = async (data: {
	access_token: string;
	orderData: any;
}) => {
	return Api.createEvent(data.access_token, data.orderData);
};

export const eventDetailService = async (data: {
	access_token: string;
	id: string;
}) => {
	return Api.getEventDetails(data.access_token, data.id);
};

export const updateEventService = async (data: {
	access_token: string;
	orderData: any;
}) => {
	return Api.updateEvent(data.access_token, data.orderData);
};
export const setPriceService = async (data: {
	access_token: string;
	orderData: any;
}) => {
	return Api.setPrice(data.access_token, data.orderData);
};
export const createInvoiceService = async (data: {
	access_token: string;
	invoiceData: InvoiceCreateI;
}) => {
	return Api.createInvoice(data.access_token, data.invoiceData);
};
export const createInvoiceItemService = async (data: {
	access_token: string;
	invoiceData: InvoiceItemCreateI;
}) => {
	return Api.createInvoiceItem(data.access_token, data.invoiceData);
};
export const getInvoice = async (data: {
	access_token: string;
	invoiceData: string;
}) => {
	return Api.getInvoice(data.access_token, data.invoiceData);
};

export const deleteEventService = async (data: {
	access_token: string;
	id: string;
}) => {
	return Api.deleteEvent(data.access_token, data.id);
};

export const checkDateService = async (date: string) => {
	return Api.checkDate(date);
};

export const getDatesService = async () => {
	return Api.getDates();
};

export const getAllEventsService = async (access_token: string) => {
	return Api.getAllEvents(access_token);
};
