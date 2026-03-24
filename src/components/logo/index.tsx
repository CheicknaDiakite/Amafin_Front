import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

// project import
import config from '../../config';
import { Githubicon } from '../../_components/icons/Githubicon';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }: any) => {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <Logo /> */}
        <Githubicon size={32} className='inline' />
        <Chip
          // label={import.meta.env.VITE_APP_VERSION}
          label={"Diakite Digital"}
          variant="outlined"
          size="small"
          color="secondary"
          sx={{ mt: 0.5, ml: 1, fontSize: '0.725rem', height: 20, '& .MuiChip-label': { px: 0.5 } }}
        />
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
