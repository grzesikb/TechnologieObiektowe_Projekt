import { Api } from '../tools/Api';

export const createWorkerService = async (data: {
	accessToken: string;
	data: any;
}) => {
	return Api.createWorker(data.accessToken, data.data);
};

export const getWorkersService = async (accessToken: string) => {
	return Api.getWorker(accessToken);
};

export const deleteWorkerService = async (data: {
	accessToken: string;
	id: string;
}) => {
	return Api.deleteWorker(data.accessToken, data.id);
};
