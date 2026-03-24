// project import

// import Navigation from './Navigation';
import SimpleBar from '../../../../components/third-party/SimpleBar';
import NavSide from './Navigation/NavSide';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        {/* <Navigation /> */}
        <NavSide />
        {/* <NavCard /> */}
      </SimpleBar>
    </>
  );
}
