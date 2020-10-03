import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import { Field } from 'react-final-form';
import { withStyles } from '@material-ui/core/styles';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import useStyles from '../form/styles';
import compose from "recompose/compose";
import AjaxForm from "../form/AjaxForm";


const sendResetPasswordUrl = process.env.REACT_APP_SEND_RESET_PASSWORD_URL


class SendResetPasswordURL extends React.Component {

    validate = (values) => {
      const errors = required(['login'], values);

      if (!errors.error) {
        const emailError = email(values.login, values);
      if (emailError) {
          errors.login = emailError;
        }
      }

    return errors;
  };

    render() {
       const { classes } = this.props
       const redirect = {
          pathname: "/",
       }
       return (
        <React.Fragment>
          <AppForm>
            <React.Fragment>
              <Typography variant="h3" gutterBottom marked="center" align="center">
                Forgot your password?
              </Typography>
              <Typography variant="body2" align="center">
                {"Enter your email address below and we'll " +
                  'send you a link to reset your password.'}
              </Typography>
            </React.Fragment>
             <AjaxForm formID="send-reset-password-url-form" url={sendResetPasswordUrl} method="POST" redirectTo={redirect}
                       validate={this.validate} showSuccessMessage buttonText="Send Reset Password E-mail"
                       classes={classes} noAuth>
                  <Field
                    autoFocus
                    autoComplete="email"
                    component={RFTextField}
                    fullWidth
                    label="Email"
                    margin="normal"
                    name="login"
                    required
                    size="large"
                  />
            </AjaxForm>
          </AppForm>
        </React.Fragment>
      );
    }
}


export default compose(
  withStyles(useStyles),
  withRoot
)(SendResetPasswordURL);