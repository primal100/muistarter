import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import defaultTheme from './theme';
import { parseBool } from "./utils";

const mediaQueries = parseBool(process.env.REACT_APP_USE_MEDIA_QUERIES)


export default function withRoot(Component, theme) {
  theme = theme || defaultTheme;
  function WithRoot(props) {
    let isMobile;
    if (mediaQueries) {
        isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    }else{  /// Workaround for puppeteer useMediaQuery doesn't work jsdom
        isMobile = false;
    }
    let { componentProps} = props;
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