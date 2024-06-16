import { useContext } from 'react';
import UserContext from '../contexts/context/UserContext';
import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom';
import Payment from '../components/views/UserAcitons/Payment';
import AccountSettings from '../components/views/AccountSettings/AccountSettings';
import AdminDashboard from '../components/views/AdminDashboard/AdminDashboard';
import EditAppEmails from '../components/views/AdminDashboard/EditAppEmails';
import AddUserData from '../components/views/Auth/AddUserData';
import SignIn from '../components/views/Auth/SignIn';
import SignUp from '../components/views/Auth/SignUp';
import EditPersonalData from '../components/views/EditPersonalData/EditPersonalData';
import OrderEvent from '../components/views/OrderEvents/OrderEvents';
import EditOrder from '../components/views/UserAcitons/EditOrder';
import GuestList from '../components/views/UserAcitons/GuestList';
import OrderDetails from '../components/views/UserAcitons/OrderDetails';
import UserDashboard from '../components/views/UserDashboard/UserDashboard';
import Pricing from '../components/views/WorkerDashboard/Pricing';
import WorkerDashboard from '../components/views/WorkerDashboard/WorkerDashboard';
import GuestRoute from './GuestRoute';
import AuthRoute from './AuthRoute';
import Success from '../components/views/PaymentStatus/Success';
import Invoice from "../components/views/WorkerDashboard/Invoice";
import InvoiceItem from "../components/views/WorkerDashboard/InvoiceItem";
import { userActions } from '../contexts/actions/user.actions';
import PrintingInvoice from "../components/views/WorkerDashboard/PrintingInvoice";
import Emails from '../components/common/Emails';

const Router = () => {
	const { state } = useContext(UserContext);

	if (state?.user === null) return <></>;

	const router = createBrowserRouter([
		{
			path: '/auth',
			element: <GuestRoute />,
			children: [
				{
					path: 'signin',
					element: <SignIn />,
				},
				{
					path: 'signup',
					element: <SignUp />,
				},
				{
					path: 'add-user-data',
					element: <AddUserData isCreateAccount={true} />,
				},
			],
		},
		{
			path: '/app',
			element: <AuthRoute />,
			children: [
				{
					path: 'dashboard',
					element:
						(state?.user && state?.user.role === 1 && <UserDashboard />) ||
						(state?.user && state?.user.role === 2 && <WorkerDashboard />) ||
						(state?.user && state?.user.role === 3 && <AdminDashboard />),
				},
				{
					path: 'edit-personal-data',
					element: <EditPersonalData />,
				},
				{
					path: 'account-settings',
					element: state?.user?.login_method==='Google' ? <Navigate to="/" replace /> : <AccountSettings />,
				},
				{
					path: 'order-event',
					element: <OrderEvent />,
				},
				{
					path: 'order-details',
					element: <OrderDetails />,
				},
				{
					path: 'invoice',
					element: <Invoice />,
				},
				{
					path: 'invoice-item',
					element: <InvoiceItem />,
				},
				{
					path: 'print-invoice',
					element: <PrintingInvoice />,
				},
				{
					path: 'edit-order',
					element: <EditOrder />,
				},
				{
					path: 'guest-list',
					element: <GuestList />,
				},
				{
					path: 'payment',
					element: <Payment />,
				},
				{
					path: 'pricing',
					element: <Pricing />,
				},
				{
					path: 'edit-app-emails',
					element: <EditAppEmails />,
				},
				{
					path: 'payment/success',
					element: <Success />,
				},
				{
					path: 'add-user-data',
					element: state?.user?.personal_data! ? <Navigate to="/" replace /> : <AddUserData isCreateAccount={false}/>,
				},
				{
					path: 'emails',
					element: <Emails />,
				},
			],
		},
		{ path: '/', element: <Navigate to="/auth/signin" /> },
	]);

	return <RouterProvider router={router} />;
};

export default Router;
