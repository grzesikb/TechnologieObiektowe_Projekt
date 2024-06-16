import { Dispatch } from 'react';

export interface IUserContext {
	state: IUserState | null;
	dispatch: Dispatch<any>;
}
export interface IUserState {
	user: IUser | null;
}
export interface IUser {
	id: string;
	email: string;
	role: number;
	address_data: IAddressData;
	personal_data: IPersonalData;
	login_method: string;
}
export interface IAddressData {
	city: string;
	country: string;
	house_number: string;
	postal_code: string;
	street: string;
	voivodeship: string;
}
export interface IPersonalData {
	first_name: string;
	last_name: string;
	phone: string;
}
export interface IUserAction {
	type: UserActions;
	payload: IUser;
}
export enum UserActions {
	LOAD_USER = 'loadUser',
}
