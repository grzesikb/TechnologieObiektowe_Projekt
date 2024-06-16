import { useContext } from 'react';
import UserContext from '../contexts/context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
	const { state } = useContext(UserContext);

	if (state?.user) {
		return (
			<>
				<Outlet />
			</>
		);
	} else return <Navigate to="/auth/signin" replace />;
};

export default AuthRoute;
