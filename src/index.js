import './index.css'

import React from 'react'
import {render} from 'react-dom'

//import App from './App'

//render(<App/>, document.querySelector('#app'))
export { default as AuthenticationApp, ProtectedRoute } from './App'
export { default as mockAuthenticationBackend, mock, mockRaw } from './modules/backend';
export { API, APINoHeader } from './modules/api'
export { default as AjaxForm } from './modules/form/AjaxForm'
export { default as Typography } from './modules/components/Typography'
export { default as AppForm } from './modules/views/AppForm'
export { default as RFTextField } from './modules/form/RFTextField'
export { default as useStyles } from './modules/form/styles'
export { default as withRoot } from './modules/withRoot'
export { default as FormButton } from './modules/form/FormButton'
export { default as FormFeedback } from './modules/form/FormFeedback'
export { Field } from 'react-final-form';
export { changeLocationState } from './modules/utils'