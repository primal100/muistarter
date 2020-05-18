import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, } from 'react-final-form';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {Link as RouterLink} from "react-router-dom";
import AjaxForm from '../form/AjaxForm';


const sign_in_url = process.env.REACT_APP_SIGN_IN_URL


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

    onSuccess = (values) => {
        window.location.reload();
    }

    render() {
      return (
        <React.Fragment>
          <AppForm>
            <React.Fragment>
              <Typography variant="h3" gutterBottom marked="center" align="center">
                Sign In
              </Typography>
              <Typography variant="body2" align="center">
                {'Not a member yet? '}
                <Link align="center" underline="always" component={RouterLink} to="/sign-up">
                  Sign Up here
                </Link>
              </Typography>
            </React.Fragment>
            <AjaxForm url={sign_in_url} method="POST" success_status="200" onSuccess={this.onSuccess} validate={this.validate} submit_str="sign in" classes={this.props.classes}>
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
              <Link underline="always" component={RouterLink} to="/forgot-password">
                Forgot password?
              </Link>
            </Typography>
          </AppForm>
        </React.Fragment>
      );
    }
}


export default compose(
  withStyles(useStyles),
  withRoot
)(SignIn);