import {
	IUser,
	IUserAction,
	IUserState,
} from '../../shared/interfaces/user.interface';

export const userActions = {
	loadUser: (state: IUserState, action: IUserAction): IUserState => {
		return { ...state, user: action.payload as IUser };
	},
};
