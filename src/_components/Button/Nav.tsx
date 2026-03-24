import { Button, CardActions } from '@mui/material';
import { FC, ReactNode } from 'react';
import ReturnIcon from '@mui/icons-material/KeyboardReturn';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

interface NavProps {
  children?: ReactNode;
}

const Nav: FC<NavProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoHome = () => {
    navigate('/entreprise');
  };

  return (
    <CardActions className='flex justify-center'>
      <Button size="small" className='rounded-full shadow-md shadow-blue-500/50' onClick={handleGoBack}>
        <ReturnIcon fontSize='small' />
      </Button>
      <Button size="small" className='rounded-full shadow-md shadow-blue-500/50' onClick={handleGoHome}>
        <HomeIcon fontSize='small' />
      </Button>
      {children}
      {/* <Button size="small">Learn More</Button> */}
    </CardActions>
  );
};

export default Nav;
