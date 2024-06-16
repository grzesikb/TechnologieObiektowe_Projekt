import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import AppContainer from '../../common/AppContainer';
import { IEmailsApp } from '../../../shared/interfaces/admin.interface';
import UserContext from '../../../contexts/context/UserContext';
import { Validator } from '../../../tools/Validator';

const EditAppEmails = () => {
  const { state } = useContext(UserContext);
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [emails, setEmails] = useState<IEmailsApp>({
    securityEmail: '',
    accountantEmail: '',
  });
  React.useEffect(() => {
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

  const [errors, setErrors] = useState({
		securityEmail: '',
		accountantEmail: '',
	});

	const validateForm = async () => {
		const securityEmailError = await Validator.checkEmail(emails.securityEmail);
		const accountantEmailError = await Validator.checkEmail(emails.accountantEmail);
		setErrors({
			securityEmail: securityEmailError ?? '',
			accountantEmail: accountantEmailError ?? ''
		})
		return !(securityEmailError || accountantEmailError)
	};

  const handleEditEmails = async () =>{
    if(await validateForm()){
      setIsSuccess(true)
      localStorage.setItem('securityEmail', emails.securityEmail);
      localStorage.setItem('accountantEmail', emails.accountantEmail);
    }
  }

  useEffect(()=>{
    if(isSuccess){
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  },[isSuccess])

  return (
    <AppContainer 
      back="/app/dashboard" 
      label="Edit app emails"
      navbar
      permission={state?.user?.role===1 ? 'User' : (state?.user?.role===2 ? 'Worker' : 'Admin')}>
      <TextField
        margin="dense"
        required
        fullWidth
        id="securityEmail"
        label="Security Email"
        name="securityEmail"
        value={emails.securityEmail}
        onChange={(e) =>
          setEmails({ ...emails, securityEmail: e.target.value })
        }
        error={!!errors.securityEmail}
				helperText={errors.securityEmail}
      />
      <TextField
        margin="dense"
        required
        fullWidth
        id="accountantEmail"
        label="Accountant Email"
        name="accountantEmail"
        value={emails.accountantEmail}
        onChange={(e) =>
          setEmails({ ...emails, accountantEmail: e.target.value })
        }
        error={!!errors.accountantEmail}
				helperText={errors.accountantEmail}
      />
      <Button variant="contained" sx={{ fontWeight: 600, mt: 3 }} onClick={handleEditEmails}>
        Edit emails
      </Button>
      {isSuccess && (
          		<Alert sx={{ maxWidth: '600px', mt: 1 }} severity="success">Emails edited</Alert>
        	)}
    </AppContainer>
  );
};

export default EditAppEmails;
