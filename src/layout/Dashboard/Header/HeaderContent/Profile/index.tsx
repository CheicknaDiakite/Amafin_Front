import PropTypes from 'prop-types';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// project import
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

import MainCard from '../../../../../components/MainCard';
import Transitions from '../../../../../components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import { connect } from '../../../../../_services/account.service';
import { Alert, Avatar, CircularProgress } from '@mui/material';
import { useFetchUser } from '../../../../../usePerso/fonction.user';
import { logout, stringAvatar } from '../../../../../usePerso/fonctionPerso';
import { useStoreUuid } from '../../../../../usePerso/store';

// tab panel wrapper
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const [errorCount, setErrorCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('errorCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const { unUser, isLoading, isError } = useFetchUser()

  useEffect(() => {
    if (isError) {
      const newCount = errorCount + 1;
      setErrorCount(newCount);
      localStorage.setItem('errorCount', newCount.toString());
    }
  }, [isError]);

  useEffect(() => {
    if (errorCount >= 2) {
      logout();
    }
  }, [errorCount]);

  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const uuid = useStoreUuid((state) => state.selectedId)
  // const anchorRef = useRef(null);
  const anchorRef = useRef<HTMLButtonElement>(null); // Ajustez le type selon votre usage
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => { // Changez le type si besoin
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  // const [value] = useState(0);


  if (isLoading) {
    return (
      <Box sx={{ width: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    if (errorCount < 2) {
      window.location.reload();
    }
    return <Alert severity="error">Probleme de connexion !</Alert>
  }

  if (unUser) {
    return (
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <ButtonBase
          sx={{
            p: 0.5,
            px: { xs: 0.5, sm: 1.5 },
            borderRadius: '50px',
            transition: 'all 0.3s ease',
            backgroundColor: open ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-1px)'
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2
            }
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar 
              {...stringAvatar(`${unUser.last_name} ${unUser.first_name}`)} 
              sx={{ 
                width: 32, 
                height: 32,
                fontSize: '0.875rem'
              }} 
            />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                textTransform: 'capitalize',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' },
                color: 'text.primary'
              }}
            >
              {unUser.last_name} {unUser.first_name}
            </Typography>
          </Stack>
        </ButtonBase>

        <Popper
          placement="bottom-end"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 9]
                }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
              <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" {...stringAvatar(`${unUser.last_name} ${unUser.first_name}`)} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6">{unUser.last_name} {unUser.first_name}</Typography>

                              {/* <Typography variant="body2" color="text.secondary">
                                {unEntreprise.nom}
                              </Typography> */}

                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Logout">
                            <IconButton size="large" onClick={logout} sx={{ color: 'text.primary' }}>
                              <LogoutOutlined />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </CardContent>

                    {uuid && <>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                          <Tab
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textTransform: 'capitalize'
                            }}
                            icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                            label="Profile"
                            {...a11yProps(0)}
                          />
                          <Tab
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textTransform: 'capitalize'
                            }}
                            icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                            label="Facture / Depense"
                            {...a11yProps(1)}
                          />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        <ProfileTab />
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <SettingTab />
                      </TabPanel>
                    </>}

                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </Box>
    );
  }
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
