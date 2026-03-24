import PropTypes from 'prop-types';
import { ChangeEvent, FormEvent, useState } from 'react';
// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Card, TextField } from '@mui/material';
import { FormType } from '../../../typescript/FormType';
import { useForgotUser } from '../../../usePerso/fonction.user';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthMdp() {

  // const {login} = useAuth()

  const {forgout} = useForgotUser()
  
  const [formVal, setFormValues] = useState<FormType>({
    username: '',
    password: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formVal,
      [name]: value,
    });
  };


  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    forgout(formVal)
  };

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={onSubmit}>
          <Stack spacing={2} margin={2}>          
            <TextField variant="outlined" label="Votre email" name='email' onChange={onChange}></TextField>
            {/* <TextField variant="outlined" label="Domain" name='frontend_domain' onChange={onChange}></TextField> */}
            <Button type="submit" color="success" variant="outlined" >Envoyer</Button>
          </Stack>
        </form>
      </Card>
    </>
  );
}

AuthMdp.propTypes = { isDemo: PropTypes.bool };
