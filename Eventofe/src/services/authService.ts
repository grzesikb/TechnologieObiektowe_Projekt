import { Api } from '../tools/Api';

export const signUpService = async (data: any) => {
	return Api.signup(data);
};
export const signInService = async (data: any) => {
	return Api.signin(data);
};

export const signInGoogleService = async (data: any) => {
	return Api.signInGoogle(data);
};
export const refreshService = async (refresh_token: string) => {
	return Api.refresh(refresh_token);
};
export const identifyService = async (access_token: string) => {
	return Api.identify(access_token);
};
export const checkEmailService = async (email: string)=>{
	return Api.checkEmail(email)
}
