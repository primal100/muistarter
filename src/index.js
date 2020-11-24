import React from 'react'
import mockBackend from "./modules/backend";
import App from "./App";
import ReactDOM from 'react-dom'
import {BrowserRouter as Router } from "react-router-dom";


function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Router>
      <App />
    </Router>
  );
}


export const selector = "#react-authentication-app"


if (module.hot && document.querySelector(selector)) {
    mockBackend();
    ReactDOM.render(<Main/>, document.querySelector(selector))
}


export { default as AuthenticationApp } from './App'
export { default as VisibleApp } from "./modules/VisibleApp"
export { default as ProtectedRoute} from "./modules/components/ProtectedRoute"
export { default as AppRoutes } from "./routes"
export { CustomSnackbarProvider } from './snackbars'
export { UserContext, SetUserContext } from './modules/contexts'
export { default as mockAuthenticationBackend, mock, mockRaw, mockBackendCheckIsStaff,
    mockBackendDecodeAccessTokenFromAxiosConfig, mockBackendRefreshTokenMock } from './modules/backend';
export { API, APINoAuthentication } from './modules/api'
export { default as AjaxForm } from './modules/form/AjaxForm'
export { default as AjaxRequest } from './modules/components/AjaxRequest'
export { default as Typography } from './modules/components/Typography'
export { default as AppForm } from './modules/views/AppForm'
export { default as RFTextField } from './modules/form/RFTextField'
export { default as AppBar} from './modules/views/AppAppBar'
export { default as Paper } from './modules/components/Paper'
export { default as AppFooter } from './modules/views/AppFooter';
export { default as withRoot } from './modules/withRoot'
export { default as FormButton } from './modules/form/FormButton'
export Announcement from './modules/components/Announcement'
export { default as FormFeedback } from './modules/form/FormFeedback'
export { email as emailValidator, required } from './modules/form/validation'
export { Analytics, sendAnalyticsError, sendAnalyticsException, sendAnalyticsModalView, sendAnalyticsOutboundLink,
    setAnalyticsFields, pageViewAnalytics} from "./modules/analytics"
export { paramsToObject, propsParamsToObject, parseBool } from './modules/utils'
export MarkdownFileView from './modules/components/MarkdownFileView'
