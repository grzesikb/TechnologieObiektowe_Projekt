import React, { useContext, useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import { SettingsContext } from './contexts/context/SettingsContext';
import { Api } from './tools/Api';
import Router from './routes/Router';
import { useMutation } from 'react-query';
import { identifyService } from './services/authService';
import UserContext from './contexts/context/UserContext';
import { UserActions } from './shared/interfaces/user.interface';
import { PaymentActions } from './shared/interfaces/payment.interface';
import PaymentContext from './contexts/context/PaymentContext';

const App = () => {
	const { theme } = useContext(SettingsContext);
	const { state, dispatch } = useContext(UserContext);
	const { dispatch: paymentDispatch } = useContext(PaymentContext);

	const { mutate, data, isSuccess, isError } = useMutation(identifyService);

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			dispatch({ type: UserActions.LOAD_USER, payload: undefined });
		} else {
			mutate(localStorage.getItem('accessToken') as string);
		}
	}, []);

	useEffect(() => {
		if (isSuccess)
			dispatch({ type: UserActions.LOAD_USER, payload: data.data });
		if (isError) dispatch({ type: UserActions.LOAD_USER, payload: undefined });
	}, [isSuccess, isError]);

	const Theme = createTheme({
		palette: {
			mode: theme,
			primary: {
				main: theme === 'light' ? '#081a2d' : '#272727',
			},
		},
	});

	useEffect(() => {
		(async () => {
			await Api.initAxios();
		})();
	}, []);

	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<Container fixed maxWidth="lg">
				<Router />
			</Container>
		</ThemeProvider>
	);
};

export default App;
