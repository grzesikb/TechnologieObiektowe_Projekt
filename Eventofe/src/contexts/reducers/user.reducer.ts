import {
	IUserAction,
	IUserState,
} from '../../shared/interfaces/user.interface';
import { userActions } from '../actions/user.actions';

export const userReducer = (state: IUserState, action: IUserAction) => {
	const handler = userActions[action.type];

	return handler(state, action);
};
