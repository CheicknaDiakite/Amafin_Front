import PropTypes from 'prop-types';
import { ChangeEvent, FormEvent, useState } from 'react';
// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Card, TextField } from '@mui/material';
import { FormType } from '../../../typescript/FormType';
import { useParams } from 'react-router-dom';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthMdpUpdate() {
  const {slug, uid} = useParams()
  console.log("forslug ...", slug, uid)

  // const {updatePass} = useUpdatePassword(slug, uid)

  // const {login} = useAuth()

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

    // updatePass(formVal)
  };

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={onSubmit}>
          <Stack spacing={2} margin={2}>          
            <TextField variant="outlined" label="Votre Password" name='password' onChange={onChange}></TextField>
            <TextField variant="outlined" label="Password" name='repassword' onChange={onChange}></TextField>
            <Button type="submit" color="success" variant="outlined" >Envoyer</Button>
          </Stack>
        </form>
      </Card>
    </>
  );
}

AuthMdpUpdate.propTypes = { isDemo: PropTypes.bool };
