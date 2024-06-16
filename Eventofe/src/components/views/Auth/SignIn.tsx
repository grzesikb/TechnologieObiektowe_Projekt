import { useEffect, useState, MouseEvent, useContext } from 'react';
import {
	Alert,
	Box,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {Validator} from '../../../tools/Validator';
import Form from './AuthForm';
import Navbar from '../../common/Navbar/Navbar';
import { IAuth } from '../../../shared/interfaces/auth.interface';
import { useMutation } from 'react-query';
import {
	identifyService,
	refreshService, signInGoogleService,
	signInService,
} from '../../../services/authService';
import UserContext from '../../../contexts/context/UserContext';
import { UserActions } from '../../../shared/interfaces/user.interface';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

const SignIn = () => {
	const [data, setData] = useState<IAuth>({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const validateForm = async () => {
		const emailError = await Validator.checkEmail(data.email);
		const passwordError = await Validator.checkPassword(data.password, false);
		setErrors({
			email: emailError ?? '',
			password: passwordError ?? ''
		})
		return !(emailError || passwordError)
	};

	const { state, dispatch } = useContext(UserContext);
	const navigate = useNavigate();

	const {
		mutate,
		isSuccess,
		data: responseData,
		isError,
		error,
	} = useMutation(signInService);

	const {
		mutate: googleMutate,
		isSuccess: googleSuccess,
		data: googleResponse,
		isError: googleIsError,
		error: googleError,
	} = useMutation(signInGoogleService);

	const {
		mutate: refreshMutate,
		isSuccess: refreshSuccess,
		data: refreshData,
		isError: refreshIsError,
		error: refreshError,
	} = useMutation(refreshService);

	const {
		mutate: identifyMutate,
		isSuccess: identifySuccess,
		data: identifyData,
		isError: identifyIsError,
		error: identifyError,
	} = useMutation(identifyService);

	const onSubmit = async (e: MouseEvent) => {
		e.preventDefault();
		if (await validateForm()) {
		  mutate(data);
		}
	};

	useEffect(() => {
		if (isSuccess && responseData) {
			refreshMutate(responseData as any);
		}
	}, [isSuccess, responseData]);

	useEffect(() => {
		if (googleSuccess && googleSuccess) {
			if(googleResponse) refreshMutate(googleResponse.data.refresh_token);
		}
	}, [googleSuccess, googleResponse]);
	useEffect(() => {
		if (refreshSuccess) {

			localStorage.setItem('accessToken', refreshData.data.access_token);
			localStorage.setItem('refreshToken', refreshData.data.refresh_token);

			identifyMutate(refreshData.data.access_token);
		}
	}, [refreshSuccess]);

	useEffect(() => {
		if (identifySuccess) {
			dispatch({ type: UserActions.LOAD_USER, payload: identifyData.data });
		}
	}, [identifySuccess]);

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	if (state?.user) navigate('../../app/dashboard');

	return (
		<Box>
			<Navbar hideMenu />
			<Form
				handleClick={(e) => onSubmit(e)}
				text="Sign In"
				navigateText="Don't have an account? Create account now!"
				navigatePath="../auth/signup"
			>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email address"
					name="email"
					autoComplete="email"
					autoFocus
					value={data.email}
					onChange={(e) => setData({ ...data, email: e.target.value })}
					error={!!errors.email}
					helperText={errors.email}
				/>
				<FormControl sx={{ mt: 1}} variant="outlined" error={!!errors.password}>
					<InputLabel htmlFor="outlined-adornment-password">
						Password
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label="Password"
						value={data.password}
						onChange={(e) => setData({ ...data, password: e.target.value })}
					/>
			{errors.password && (
				<FormHelperText error>{errors.password}</FormHelperText>
			)}
				</FormControl>
			{isError && (
			<Alert sx={{ minWidth: '350px', mt: 1 }} severity="error">{(error as any).response.data.detail}</Alert>
			)}
				<Box sx={{minWidth: '350px', mt: 2, display: 'flex', justifyContent: 'center'}}>
					<GoogleOAuthProvider clientId="643015372662-hkj0n07rm68jit3cfs95tg37f65a775d.apps.googleusercontent.com">
						<GoogleLogin
							onSuccess={(credentialResponse : any)=> {
								googleMutate(credentialResponse.credential)
							}}
							onError={() => {
								console.log('Login Failed');
							}}
						/>
					</GoogleOAuthProvider>
				</Box>
			</Form>
		</Box>
	);
};

export default SignIn;
