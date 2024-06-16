import { Api } from '../tools/Api';

export const deleteGuestService = (data: {
	access_token: string;
	id: string;
}) => {
	return Api.deleteGuest(data.access_token, data.id);
};
