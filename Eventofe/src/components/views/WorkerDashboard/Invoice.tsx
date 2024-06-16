import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AppContainer from '../../common/AppContainer';
import { IOrder } from '../../../shared/interfaces/order.interface';
import { useMutation } from 'react-query';
import {
    createInvoiceService,
    eventDetailService,
    updateEventService,
} from '../../../services/eventService';
import { statusFormatter } from '../../../tools/StatusFormatter';
import { convertType } from '../../../tools/TypeConverter';
import {InvoiceI} from "../../../shared/interfaces/invoice.interface";
import UserContext from '../../../contexts/context/UserContext';
import { Validator } from '../../../tools/Validator';

const Invoice = () => {
    const { state } = useContext(UserContext);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const typeParam = urlParams.get('id');

    const [invoiceData, setInvoiceData] = useState<InvoiceI>({
        order_id: '',
        client_id: '',
        invoice_nr: '',
        nip: '',
        created_at: '',
    })

    const [errors, setErrors] = useState({
		invoice_nr: '',
		nip: '',
	});

    const validateForm = async () => {
		const invoice_nrError = await Validator.checkRequiredString(invoiceData.invoice_nr);
		const nipError = await Validator.checkNip(invoiceData.nip);
		setErrors({
			invoice_nr: invoice_nrError ?? '',
			nip: nipError ?? '',
		})
		return !(invoice_nrError || nipError)
	};

    const [data, setData] = useState<IOrder>({
        id: '',
        name: '',
        startDate: null,
        type: '',
        status: '',
        additionalInfo: '',
        securityOption: false,
        barOption: false,
        artist: '',
        maxPeople: '',
        minAge: '',
        numberOfSeats: '',
        companyName: '',
        cateringOption: false,
        cateringName: '',
        clientId: '',
        types: '',
        payment_token: ''
    });

    const {
        mutate,
        data: responseData,
        isSuccess,
        isLoading,
    } = useMutation(eventDetailService);

    const {
        mutate: createInvoiceMutate,
        data: createInvoiceData,
        isSuccess: createInvoiceSuccess,
    } = useMutation(createInvoiceService);

    useEffect(() => {
        mutate({
            access_token: localStorage.getItem('accessToken') as string,
            id: typeParam as string,
        });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            if (responseData.data.payload.length > 0) {
                const orderDetails = responseData.data.payload[0];
                setData({
                    id: orderDetails.id,
                    name: orderDetails.name,
                    startDate: orderDetails.start_date,
                    type: convertType(orderDetails.type) as string,
                    status: statusFormatter(orderDetails.status) as string,
                    additionalInfo: orderDetails.additional_info,
                    securityOption: orderDetails.security,
                    barOption: orderDetails.bar_option,
                    artist: orderDetails.artist_name,
                    maxPeople: orderDetails.max_nr_of_people,
                    minAge: orderDetails.minimal_age,
                    numberOfSeats: orderDetails.number_of_seats,
                    companyName: orderDetails.company_name,
                    cateringOption: orderDetails.catering,
                    cateringName: orderDetails.company_name,
                    clientId: orderDetails.client_id,
                    types: 'Birthdays',
                    payment_token: orderDetails.payment_token
                });
                setInvoiceData(prevState => ({
                    ...prevState,
                    order_id: (orderDetails.id as string),
                    client_id: (orderDetails.client_id as string),
                }))
            }
        }
    }, [isSuccess]);

    const navigate = useNavigate();
    const handleEditOrder = async () => {
        const now = new Date();
        if(await validateForm()){
            createInvoiceMutate({
                access_token: localStorage.getItem('accessToken') as string,
                invoiceData: {
                    ...invoiceData,
                    nip: parseFloat(invoiceData.nip),
                    created_at: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
                 },
            });
        }
    };

    useEffect(() => {
        if (createInvoiceSuccess) {
            setTimeout(() => {
                navigate(`/app/invoice-item?invoice_id=${createInvoiceData.data.payload.id}&order_id=${createInvoiceData.data.payload.order_id}`);
            }, 3000);
        }
    }, [createInvoiceSuccess]);

    return (
        <AppContainer
            back="/app/dashboard"
            label={`Create Invoice For Order: ${typeParam}`}
            additionalLabel={`Type: ${data.type} | Date: ${data.startDate}`}
            navbar
            permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
        >
            <Box component="form">
                <Grid container>
                    <Grid item sm={12}>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="name"
                            label="Invoice Number"
                            name="name"
                            value={invoiceData.invoice_nr}
                            onChange={(e) => setInvoiceData({ ...invoiceData, invoice_nr: e.target.value })}
                            error={!!errors.invoice_nr}
					        helperText={errors.invoice_nr}
                        />
                    </Grid>

                    {/* ---------------- Detailed data ---------------- */}

                    {data.type === 'Public' && (
                        <>
                            <Grid item sm={12}>
                                <TextField
                                    margin="dense"
                                    required
                                    type='number'
                                    fullWidth
                                    id="artist"
                                    label="NIP"
                                    name="artist"
                                    multiline
                                    value={invoiceData.nip.replace(/\D/g, '')}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, nip: e.target.value })}
                                    error={!!errors.nip}
					                helperText={errors.nip}
                                />
                            </Grid>

                        </>
                    )}




                    <Grid item sm={12}>

                    </Grid>
                    <Grid item sm={12}>
                        <Typography component="h5" variant="body2" sx={{ mt: 2, mb: 2 }}>
                            * require
                        </Typography>
                    </Grid>
                    <Grid item sm={5.5}></Grid>
                </Grid>
                <Button
                    variant="contained"
                    endIcon={<EditIcon />}
                    sx={{ fontWeight: 600 }}
                    onClick={handleEditOrder}
                >
                    Edit Order
                </Button>
            </Box>
            {createInvoiceSuccess && (
                <Alert sx={{mt:2 }} severity="success">
                    Invoice created! Page will be refreshed soon..
                </Alert>
            )}
        </AppContainer>
    );
};

export default Invoice;
