import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { CssBaseline, Direction, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Palette from './palette'; // Assurez-vous que cela retourne un objet palette correct
import Typography from './typography'; // Assurez-vous que cela retourne un objet Typography correct
import CustomShadows from './shadows'; // Assurez-vous que cela retourne un objet shadows correct
import componentsOverride from './overrides';
import { ChildrenProps } from '../typescript/Account';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }: ChildrenProps) {
  const theme = Palette('dark');
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440,
        },
      },
      direction: 'ltr' as Direction, // ou 'rtl' selon le besoin
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography,
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node,
};
