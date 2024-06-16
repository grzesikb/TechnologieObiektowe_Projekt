import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {InvoiceI} from "../../../shared/interfaces/invoice.interface";
import {InvoiceItemCreateI, InvoiceItemI} from "../../../shared/interfaces/invoiceItem.interface";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import {createInvoiceItemService, getInvoice} from "../../../services/eventService";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {IPersonalData} from "../../../shared/interfaces/person.interface";
import {editUserProfileService, GetClientData} from "../../../services/userService";
import userEvents from "../UserDashboard/UserEvents";


function getCurrentDateAsString() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export default function PrintingInvoice() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const invoiceId = urlParams.get('invoice_id');
    const orderId = urlParams.get('order_id');
    console.log(invoiceId)
    console.log(orderId)

    const [personalData, setPersonalData] = useState<IPersonalData>({
        firstName:  '',
        lastName:  '',
        phoneNumber: '',
        street: '',
        houseNumber: '',
        city: '',
        postalCode: '',
        voivodeship: '',
        country: '',
    });

    const { mutate: clientMutate, isSuccess: clientDataSuccess, data: clientData } = useMutation(GetClientData);


    const [invoiceData, setInvoiceData] = useState<InvoiceI>({
        order_id: '',
        client_id: '',
        invoice_nr: '',
        nip: '',
        created_at: '',
    })

    const  [invoiceItems, setInvoiceItems] = useState<InvoiceItemI[]>([{
        name:'',
        invoice_id:'',
        count:'',
        price_per_item:'',
    }])

    const navigate = useNavigate();

    const {
        mutate,
        data: responseData,
        isSuccess,
        isLoading,
    } = useMutation(getInvoice);


    useEffect(() => {
        mutate({
            access_token: localStorage.getItem('accessToken') as string,
            invoiceData: orderId as string,
        });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            setInvoiceData(prevState => ({
                ...prevState,
                order_id: (responseData.data.payload.order_id as string),
                client_id: (responseData.data.payload.client_id as string),
                id: (responseData.data.payload.id as string),
                invoice_nr: (responseData.data.payload.invoice_nr as string),
                created_at: (responseData.data.payload.created_at as string),
                nip: (responseData.data.payload.nip),
            }))
            if (responseData?.data.payload.items.length)
                setInvoiceItems(prevState => (responseData.data.payload.items.map((item :InvoiceItemI)=>(
                    {
                        name: item.name,
                        price_per_item: item.price_per_item,
                        invoice_id:item.invoice_id,
                        count: item.count,
                    }))))
            clientMutate({
                access_token: localStorage.getItem('accessToken') as string,
                userData: responseData.data.payload.client_id as string,
            })
        }
    }, [isSuccess]);
    console.log((clientData?.data), 'Client');





    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={'h4'} sx={{textAlign:'center'}}>{clientData?.data.payload}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'h6'} sx={{textAlign:'center'}}>{responseData?.data.payload.invoice_nr}</Typography>
                </Grid>

                <Grid container xs={12} sx={{marginBottom: 5, marginTop: 5}}>
                    <Grid item xs={12}>
                        <Typography sx={{textAlign:'right'}}>Issue Place: Warszawa</Typography>
                        <Typography sx={{textAlign:'right'}}>Issue Date: {getCurrentDateAsString()}</Typography>
                        <Typography sx={{textAlign:'right'}}>Sel Date: {getCurrentDateAsString()}</Typography>
                    </Grid>
                </Grid>

                <Grid container xs={12} sx={{marginBottom: 5}}>
                    <Grid item xs={6} >
                        <Typography sx={{textAlign:'left'}}>Evento sp.zoo</Typography>
                        <Typography sx={{textAlign:'left'}}>Nowowiejska 12a</Typography>
                        <Typography sx={{textAlign:'left'}}>Warwszawa</Typography>
                        <Typography sx={{textAlign:'left'}}>NIP: {responseData?.data.payload.nip}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{textAlign:'right'}}>{clientData?.data.personal_data.first_name}   {clientData?.data.personal_data.last_name}</Typography>
                        <Typography sx={{textAlign:'right'}}>{clientData?.data.address_data.city+'   ul.'+clientData?.data.address_data.street}</Typography>
                        <Typography sx={{textAlign:'right'}}>{clientData?.data.address_data.house_number+',   '+clientData?.data.address_data.postal_code+'   '+clientData?.data.address_data.city}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{padding: 0, margin:0}}>
                    <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 450 }} aria-label="simple table" >
                        <TableHead >
                            <TableRow>
                                <TableCell>LP.</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell>U.M</TableCell>
                                <TableCell align="right">Price Per One</TableCell>
                                <TableCell align="right">Count</TableCell>
                                <TableCell align="right">Net value</TableCell>
                                <TableCell align="right">Gross value</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{padding:0}}>
                            {invoiceItems.length && invoiceItems.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">Szt.</TableCell>
                                    <TableCell align="right">{row.price_per_item}</TableCell>
                                    <TableCell align="right">{row.count}</TableCell>
                                    <TableCell align="right">{parseFloat(row.price_per_item as string) * parseFloat(row.count as string) }</TableCell>
                                    <TableCell align="right">{(parseFloat(row.price_per_item as string) * parseFloat(row.count as string) * 1.23) }</TableCell>
                                    <TableCell align="right">{(parseFloat(row.price_per_item as string) * parseFloat(row.count as string) * 1.23) }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer></Grid>
       </Grid>
        </Box>
    );
}
