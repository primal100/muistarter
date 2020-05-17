import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import { Field, Form, FormSpy } from 'react-final-form';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import {Link as RouterLink} from "react-router-dom";

const useStyles = (theme) => ({
  form: {
    marginTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  feedback: {
    marginTop: theme.spacing(2),
  },
})


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
                Sign In
              </Typography>
              <Typography variant="body2" align="center">
                {'Not a member yet? '}
                <Link align="center" underline="always" component={RouterLink} to="/sign-up">
                  Sign Up here
                </Link>
              </Typography>
            </React.Fragment>
            <Form onSubmit={this.handleSubmit} subscription={{ submitting: true }} validate={this.validate}>
              {({ handleSubmit2, submitting }) => (
                <form onSubmit={handleSubmit2} className={classes.form} noValidate>
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


// export default withRoot(React.mapStateToProps, React.mapDispatchToProps)(withStyles(useStyles)(SignIn));

