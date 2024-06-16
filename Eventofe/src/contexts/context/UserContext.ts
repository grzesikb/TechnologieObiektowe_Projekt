import { createContext } from 'react';
import { USER_INITIAL_STATE } from '../initialStates/user.initialState';
import { IUserContext } from '../../shared/interfaces/user.interface';

const UserContext = createContext<IUserContext>({
	state: USER_INITIAL_STATE,
	dispatch: () => null,
});

export default UserContext;
