import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import {required, email} from '../form/validation';
import RFTextField from '../form/RFTextField';
import EditableField from '../form/EditableField';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import AjaxForm from '../form/AjaxForm';
import Grid from "@material-ui/core/Grid";


const user_profile_url = process.env.REACT_APP_USER_PROFILE_URL
//const change_email_url = process.env.REACT_APP_CHANGE_EMAIL_URL
//const change_password_url = process.env.REACT_APP_CHANGE_PASSWORD_URL


class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            enabled: null
        }
    }

    validate = (values) => {
      const errors = required(['email'], values);

      if (!errors.email) {
        const emailError = email(values.email, values);
      if (emailError) {
          errors.email = emailError;
        }
      }
      return errors;
    };

    handleChange = async (values) => {
        console.log(values);
        this.setState({enabled: null});
    }

    render() {
      const { classes } = this.props;
      return (
          <React.Fragment>
            <AppForm>
              <React.Fragment>
                <Typography variant="h3" gutterBottom marked="center" align="center">
                  User Details
                </Typography>
              </React.Fragment>
              <AjaxForm url={user_profile_url} method="PATCH" loadInitialValuesFromURL={user_profile_url}
                        noSubmitButton={true} submitModifiedValuesOnly={true} classes={classes}>
                  <Grid container spacing={2}>
                     <Grid item xs={12} sm={6}>
                        <EditableField
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
                        <EditableField
                           component={RFTextField}
                           autoComplete="lname"
                           fullWidth
                           label="Last name"
                           name="last_name"
                           required
                        />
                     </Grid>
                  </Grid>
              </AjaxForm>
            </AppForm>
          </React.Fragment>
      );
    }
}

export default compose(
  withStyles(useStyles),
  withRoot
)(UserProfile);