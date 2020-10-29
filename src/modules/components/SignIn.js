import React from 'react';
import { Field } from 'react-final-form';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import {Link as RouterLink} from "react-router-dom";
import AjaxForm from '../form/AjaxForm';


const signInUrl = process.env.REACT_APP_SIGN_IN_URL


class SignIn extends React.Component {

    validate = (values) => {
      const errors = required(['email', 'password'], values);

      if (!errors.email) {
        const emailError = email(values.email, values);
      if (emailError) {
          errors.email = emailError;
        }
      }
      return errors;
    };

    render() {
      const redirect = {
              pathname: this.props.redirectTo || "/",
        }
      console.log('Signin Redirect', redirect);
      return (
        <React.Fragment>
          <AppForm>
            <React.Fragment>
              <Typography variant="h3" gutterBottom marked="center" align="center">
                Sign In
              </Typography>
              <Typography variant="body2" align="center">
                {'Not a member yet? '}
                <Link id="sign-up2" align="center" underline="always" component={RouterLink} to="/sign-up">
                  Sign Up here
                </Link>
              </Typography>
            </React.Fragment>
            <AjaxForm formID="sign-in-form" url={signInUrl} method="POST" validate={this.validate} noAuth
                      redirectTo={redirect} buttonText="sign in" updateUserDetails
            analyticsEventArgs={{category: 'User', action: 'Sign in'}}>
                  <Field
                    autoComplete="email"
                    autoFocus
                    component={RFTextField}
                    fullWidth
                    label="Email"
                    margin="normal"
                    name="email"
                    required
                    size="large"
                  />
                  <Field
                    fullWidth
                    size="large"
                    component={RFTextField}
                    required
                    name="password"
                    autoComplete="current-password"
                    label="Password"
                    type="password"
                    margin="normal"
                  />
            </AjaxForm>
            <Typography variant="body2" align="center">
              <Link id="send_reset_password_link" underline="always" component={RouterLink} to="/send-reset-password-url">
                Forgot password?
              </Link>
            </Typography>
          </AppForm>
        </React.Fragment>
      );
    }
}


export default SignIn;