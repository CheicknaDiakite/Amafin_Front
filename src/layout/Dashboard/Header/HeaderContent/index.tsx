// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import Search from './Search';
import Profile from './Profile';

// project import

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  return (
    <>
    
      {!downLG && <Search />}
      {downLG && <Search />}
      {/* {downLG && <Box sx={{ width: '100%', ml: 1 }} />} */}

      {/* <Notification /> */}
      {!downLG && <Profile />}
      {downLG && <Profile />}
      {/* {downLG && <MobileSection />} */}
    </>
  );
}
