import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from './theme';
import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
    return query => ({
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {},
    });
}

//window.matchMedia = createMatchMedia(window.innerWidth);

export default function withRoot(Component) {
  function WithRoot(props) {
    const isMobile = false; // Needs to be fixed but very difficult to test using media query
    return (
      <ThemeProvider theme={theme} isMobile={false}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} theme={theme}/>
      </ThemeProvider>
    );
  }

  return WithRoot;
}