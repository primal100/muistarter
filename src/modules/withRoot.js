import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import defaultTheme from './theme';


export default function withRoot(Component) {
  function WithRoot(props) {
    let isMobile;
    if (process.env.NODE_ENV === 'production') {
        isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    }else{  /// Workaround for puppeteer useMediaQuery doesn't work jsdom
        isMobile = false;
    }
    let { theme, componentProps} = props;
    theme = theme || defaultTheme;
    return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} theme={theme} isMobile={isMobile}/>
      </ThemeProvider>
    );
  }

  return WithRoot;
}