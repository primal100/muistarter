import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, Form, FormSpy } from 'react-final-form';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {Link as RouterLink} from "react-router-dom";
import { FORM_ERROR } from "final-form";


const response_key = process.env.REACT_APP_GENERAL_KEY_ERRORS


class SignIn extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          sent: false
      }
    };

    validate = (values) => {
      const errors = required(['email', 'password'], values);

      if (!errors.email) {
        const emailError = email(values.email, values);
      if (emailError) {
          errors.email = email(values.email, values);
        }
      }

      return errors;
    };

    handleSubmit = async (values) => {
        console.log(values)
        this.setState({sent: true})

        let response = await fetch(process.env.REACT_APP_SIGN_IN_URL, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(values)
        })
        let status = response.status;
        let data = await response.json()
        console.log(status)
        console.log(data)
        if (status === 200) {
            window.location.reload();
        }else{
            this.setState({sent: false})
            console.log('returning')
            if (data[response_key]) {
                return {[FORM_ERROR]: data[response_key]}
            }else{
                return data;
            }
        }
    }

    render() {
      const { classes } = this.props
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
            <Form onSubmit={this.handleSubmit} subscription={{ submitting: true }} validate={this.validate}
              render={({ submitError, handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  <Field
                    autoComplete="email"
                    autoFocus
                    component={RFTextField}
                    disabled={submitting || this.state.sent}
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
                    disabled={submitting || this.state.sent}
                    required
                    name="password"
                    autoComplete="current-password"
                    label="Password"
                    type="password"
                    margin="normal"
                  />
                  <FormSpy subscription={{ submitError: true }}>
                    {({ submitError }) =>
                      submitError ? (
                        <FormFeedback className={classes.feedback} error>
                          {submitError}
                        </FormFeedback>
                      ) : null
                    }
                  </FormSpy>
                  <FormButton
                    className={classes.button}
                    disabled={submitting || this.state.sent}
                    size="large"
                    color="secondary"
                    fullWidth
                  >
                    {submitting || this.state.sent ? 'In progress…' : 'Sign In'}
                  </FormButton>
                </form>
              )}
            >
            </Form>
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