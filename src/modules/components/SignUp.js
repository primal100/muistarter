import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, } from 'react-final-form';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required, passwords_match } from '../form/validation';
import RFTextField from '../form/RFTextField';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {Link as RouterLink} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import AjaxForm from '../form/AjaxForm';


const signUpUrl = process.env.REACT_APP_SIGN_UP_URL


class SignUp extends React.Component {

    validate = (values) => {
      const errors = required(['first_name', 'last_name', 'email', 'password', 'password_confirm'], values);

      if (!errors.email) {
        const emailError = email(values.email);
        if (emailError) {
            errors.email = emailError;
          }
      }

      if (!errors.password_confirm) {
          const passwordConfirmError = passwords_match(values.password, values.password_confirm);
        if (passwordConfirmError) {
            errors.password_confirm = passwordConfirmError;
          }
      }

      return errors;
    };

    render() {
      const { classes } = this.props
      const successMessage = "We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link.\n" +
          "\n" +
          "If you do not receive a confirmation email, please check your spam folder. Also, please verify that you entered a valid email address in our sign-up form."
      const redirect = {
          pathname: "/",
      }
      return (
          <React.Fragment>
            <AppForm>
              <React.Fragment>
                <Typography variant="h3" gutterBottom marked="center" align="center">
                  Sign Up
                </Typography>
                <Typography variant="body2" align="center">
                  <Link component={RouterLink} to="/sign-in" underline="always">
                    Already have an account?
                  </Link>
                </Typography>
              </React.Fragment>
              <AjaxForm formID="sign-up-form" url={signUpUrl} method="POST" redirectTo={redirect}
                        successMessage={successMessage} validate={this.validate} buttonText="Sign Up" classes={classes}
                        noAuth analyticsEventArgs={{category: 'User', action: 'Sign Up'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                              autoFocus
                              component={RFTextField}
                              autoComplete="fname"
                              fullWidth
                              label="First name"
                              name="first_name"
                              required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                              component={RFTextField}
                              autoComplete="lname"
                              fullWidth
                              label="Last name"
                              name="last_name"
                              required
                          />
                        </Grid>
                      </Grid>
                      <Field
                          autoComplete="email"
                          component={RFTextField}
                          fullWidth
                          label="Email"
                          margin="normal"
                          name="email"
                          required
                      />
                      <Field
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
)(SignUp);