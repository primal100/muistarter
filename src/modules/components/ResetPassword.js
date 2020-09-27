import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, } from 'react-final-form';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { required, passwords_match } from '../form/validation';
import RFTextField from '../form/RFTextField';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import AjaxForm from '../form/AjaxForm';
import {propsParamsToObject} from "../utils";


const resetPasswordUrl = process.env.REACT_APP_RESET_PASSWORD_URL

class ResetPassword extends React.Component {

    validate = (values) => {
      const errors = required(['password', 'password_confirm'], values);

      if (!errors.password_confirm) {
          const passwordConfirmError = passwords_match(values.password, values.password_confirm);
        if (passwordConfirmError) {
            errors.password_confirm = passwordConfirmError;
          }
      }

      return errors;

    };

    render() {
      this.additionalValues = propsParamsToObject(this.props);
      const { classes } = this.props;
      const redirect = {
          pathname: "/sign-in",
      }
      return (
          <React.Fragment>
            <AppForm>
              <React.Fragment>
                <Typography variant="h3" gutterBottom marked="center" align="center">
                  Reset Password
                </Typography>
              </React.Fragment>
              <AjaxForm url={resetPasswordUrl} method="POST" redirectTo={redirect} validate={this.validate}
                        buttonText="Set New Password" showSuccessMessage classes={classes}
                        additonalValues={this.additionalValues} noAuth>
                  <Field
                      autoFocus
                      fullWidth
                      component={RFTextField}
                      required
                      name="password"
                      autoComplete="new-password"
                      label="Password"
                      type="password"
                      margin="normal"
                  />
                  <Field
                      fullWidth
                      component={RFTextField}
                      required
                      name="password_confirm"
                      autoComplete="new-password"
                      label="Confirm Password"
                      type="password"
                      margin="normal"
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
)(ResetPassword);