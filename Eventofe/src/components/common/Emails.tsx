/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import AppContainer from './AppContainer';
import UserContext from '../../contexts/context/UserContext';
import { IEmailsApp } from '../../shared/interfaces/admin.interface';
import { FileCopy } from '@mui/icons-material';

const Emails = () => {
    const { state } = useContext(UserContext);
    const [isCopied, setIsCopied] = useState<boolean>(false)

    const [emails, setEmails] = useState<IEmailsApp>({
        securityEmail: '',
        accountantEmail: '',
      });
      useEffect(() => {
        const storedSecurityEmail = localStorage.getItem('securityEmail');
        const storedAccountantEmail = localStorage.getItem('accountantEmail');
        if (storedSecurityEmail && storedAccountantEmail) {
          setEmails({
            securityEmail: storedSecurityEmail,
            accountantEmail: storedAccountantEmail,
          });
        } else {
          setEmails({
            securityEmail: 'security@gmail.com',
            accountantEmail: 'accountant@gmail.com',
          });
        }
      }, []);

      const handleCopyEmail = (email: string) => {
        setIsCopied(true)
        navigator.clipboard.writeText(email);
        };

    useEffect(()=>{
        if(isCopied){
            setTimeout(()=>{
                setIsCopied(false)
            }, 2000)
        }
    }, [isCopied])

	return (
		<AppContainer
			back="/app/dashboard"
			label="Emails"
			navbar
			permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}
		>
			<Box component="form">
				<Grid container>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={emails.securityEmail}
							margin="dense"
							fullWidth
							id="securityEmail"
							label="Security email"
							name="securityEmail"
                            value={emails.securityEmail}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <IconButton title="Copy" onClick={() => handleCopyEmail(emails.securityEmail)}>
                                        <FileCopy />
                                    </IconButton>
                                ),
                            }}
                            />
					</Grid>
					<Grid item sm={1}></Grid>
					<Grid item sm={5.5}>
						<TextField
							defaultValue={emails.accountantEmail}
							margin="dense"
							fullWidth
							id="accountantEmail"
							label="Accountant email"
							name="accountantEmail"
                            value={emails.accountantEmail}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <IconButton title="Copy" onClick={() => handleCopyEmail(emails.accountantEmail)}>
                                        <FileCopy />
                                    </IconButton>
                                ),
                            }}
						/>
					</Grid>
				</Grid>
                {isCopied && (
                <Alert sx={{ maxWidth: '120px', mt: 1 }} severity="info">Copied!</Alert>
                )}
			</Box>
		</AppContainer>
	);
};
export default Emails;
