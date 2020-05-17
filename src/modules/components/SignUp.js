import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, Form, FormSpy } from 'react-final-form';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required, passwords_match } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {Link as RouterLink} from "react-router-dom";
import Grid from '@material-ui/core/Grid';


class SignUp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          sent: false
      }
    };

    validate = (values) => {
      const errors = required(['firstName', 'lastName', 'email', 'password', 'password_confirm'], values);

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

    handleSubmit = () => {
      this.setState({sent: true})
    }

    render() {
      const { classes } = this.props
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
              <Form onSubmit={this.handleSubmit} subscription={{submitting: true}} validate={this.validate}>
                {({handleSubmit2, submitting}) => (
                    <form onSubmit={handleSubmit2} className={classes.form} noValidate>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                              autoFocus
                              component={RFTextField}
                              autoComplete="fname"
                              fullWidth
                              label="First name"
                              name="firstName"
                              required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                              component={RFTextField}
                              autoComplete="lname"
                              fullWidth
                              label="Last name"
                              name="lastName"
                              required
                          />
                        </Grid>
                      </Grid>
                      <Field
                          autoComplete="email"
                          component={RFTextField}
                          disabled={submitting || this.state.sent}
                          fullWidth
                          label="Email"
                          margin="normal"
                          name="email"
                          required
                      />
                      <Field
                          fullWidth
                          component={RFTextField}
                          disabled={submitting || this.state.sent}
                          required
                          name="password"
                          autoComplete="current-password"
                          label="Password"
                          type="password"
                          margin="normal"
                      />
                      <Field
                          fullWidth
                          component={RFTextField}
                          disabled={submitting || this.state.sent}
                          required
                          name="password_confirm"
                          autoComplete="current-password"
                          label="Confirm Password"
                          type="password"
                          margin="normal"
                      />
                      <FormSpy subscription={{submitError: true}}>
                        {({submitError}) =>
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
                          color="secondary"
                          fullWidth
                      >
                        {submitting || this.state.sent ? 'In progress…' : 'Sign Up'}
                      </FormButton>
                    </form>
                )}
              </Form>
            </AppForm>
          </React.Fragment>
      );
    }
}

export default compose(
  withStyles(useStyles),
  withRoot
)(SignUp);