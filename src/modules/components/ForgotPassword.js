import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { withStyles } from '@material-ui/core/styles';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import useStyles from '../form/styles';
import compose from "recompose/compose";


class ForgotPassword extends React.Component {
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
                Forgot your password?
              </Typography>
              <Typography variant="body2" align="center">
                {"Enter your email address below and we'll " +
                  'send you a link to reset your password.'}
              </Typography>
            </React.Fragment>
            <Form onSubmit={this.handleSubmit} subscription={{ submitting: true }} validate={this.validate}>
              {({ handleSubmit2, submitting }) => (
                <form onSubmit={handleSubmit2} className={classes.form} noValidate>
                  <Field
                    autoFocus
                    autoComplete="email"
                    component={RFTextField}
                    disabled={submitting || this.state.sent}
                    fullWidth
                    label="Email"
                    margin="normal"
                    name="email"
                    required
                    size="large"
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
                    {submitting || this.state.sent ? 'In progress…' : 'Send reset link'}
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
)(ForgotPassword);