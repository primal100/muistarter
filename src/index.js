import React from 'react'
import {render} from 'react-dom'
import './index.css';
import mockBackend from "./modules/backend";
import App from "./App";


const selector = "#react-authentication-app"
if (document.querySelector(selector)) {
    mockBackend();
    render(<App/>, document.querySelector(selector))
}


export { default as AuthenticationApp } from './App'
export { ProtectedRoute, AppRoutes } from "./routes"
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
export { paramsToObject, propsParamsToObject } from './modules/utils'
