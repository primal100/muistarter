import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import defaultTheme from './theme';
import { parseBool } from "./utils";

export default function withRoot(Component, theme) {
  theme = theme || defaultTheme;
  function WithRoot(props) {
    let { componentProps} = props;
    return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} theme={theme}/>
      </ThemeProvider>
    );
  }

  return WithRoot;
}