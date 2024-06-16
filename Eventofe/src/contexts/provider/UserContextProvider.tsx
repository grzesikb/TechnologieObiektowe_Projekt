import { ReactNode, useMemo, useReducer } from 'react';
import { userReducer } from '../reducers/user.reducer';
import { USER_INITIAL_STATE } from '../initialStates/user.initialState';
import UserContext from '../context/UserContext';

interface IUserContextProviderProps {
	children: ReactNode;
}

export const UserContextProvider = ({
	children,
}: IUserContextProviderProps) => {
	const [state, dispatch] = useReducer(userReducer, USER_INITIAL_STATE);

	const value = useMemo(() => ({ state, dispatch }), [state]);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
