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
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import { UserContext } from "../contexts";


const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const userProfileUrl = process.env.REACT_APP_USER_PROFILE_URL
const changeEmailUrl = process.env.REACT_APP_CHANGE_EMAIL_URL


class UserProfile extends React.Component {
    state = {
        enabled: null
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

    createRequest = (values) => {
        if (values.email){
            return {
                method: 'POST',
                url: changeEmailUrl,
                data: {email: values.email}
            }
        }
        return {
            method: 'PATCH',
            url: userProfileUrl,
            data: values
        }
    }

    getSuccessMessage = (request, data) => {
        if (data[responseKey] && data[responseKey].length > 0){
            return data[responseKey];
        }
        return 'Your details have been updated';
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
              <React.Fragment>
              <UserContext.Consumer>
                {({user, updater}) => (
              <AjaxForm createRequest={this.createRequest} loadInitialValuesFromURL={userProfileUrl}
                        getSuccessMessage={this.getSuccessMessage} noSubmitButton={true} updateInitialValuesOnResponse
                        submitModifiedValuesOnly onSuccess={updater} classes={classes}>
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
                  <EditableField
                          component={RFTextField}
                          autoComplete="email"
                          fullWidth
                          label="Email"
                          margin="normal"
                          name="email"
                          required
                  />
              </AjaxForm>
              )}
              </UserContext.Consumer>
              <Typography variant="body2" align="center">
                <Link id="change_password_link" underline="always" component={RouterLink} to="/change-password">
                    Click here to change your password
                </Link>
            </Typography>
            </React.Fragment>
            </AppForm>
          </React.Fragment>
      );
    }
}

export default compose(
  withStyles(useStyles),
  withRoot
)(UserProfile);