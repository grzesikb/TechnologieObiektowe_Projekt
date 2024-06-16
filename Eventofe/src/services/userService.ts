import { Api } from '../tools/Api';

export const editUserProfileService = async (data: {
	access_token: string;
	userData: any;
}) => {
	return Api.editUserProfile(data.access_token, data.userData);
};

export const changePasswordService = async (data: {
	access_token: string;
	userData: any;
}) => {
	return Api.changePassword(data.access_token, data.userData);
};

export const createPersonalDataService = async (data: {
	access_token: string;
	userData: any;
}) => {
	return Api.createPersonalData(data.access_token, data.userData)
}
export const GetClientData = async (data: {
	access_token: string;
	userData: string;
}) => {
	return Api.getClientPersonalData(data.access_token, data.userData)
}
