import React from 'react';
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
import { Switches} from "mui-rff";
import { UserContext } from "../contexts";


const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const userProfileUrl = process.env.REACT_APP_USER_PROFILE_URL
const changeEmailUrl = process.env.REACT_APP_CHANGE_EMAIL_URL


class UserProfile extends React.Component {

    validate = (values) => {
        console.log('Validating user profile')
      const errors = required(['email'], values);

      if (!errors.email) {
        const emailError = email(values.email, values);
      if (emailError) {
          errors.email = emailError;
        }
      }
      console.log('Validation user profile result', errors);
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

    handleSwitchChange = async (event) => {
        console.log('Mailing list event', event)
        const form = event.target.form;
        setTimeout(() => form.dispatchEvent(new Event('submit', { cancelable: true })), 0);
    }

    render() {
      const { classes } = this.props;
      this.mailingListSwitchData = [
            {label: 'Be part of our Mailing List'}
      ];
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
              <AjaxForm formID="user-profile-form" createRequest={this.createRequest} loadInitialValuesFromURL={userProfileUrl}
                        getSuccessMessage={this.getSuccessMessage} noSubmitButton={true} updateInitialValuesOnResponse
                        submitModifiedValuesOnly onSuccess={updater} validate={this.validate} classes={classes}
              analyticsEventArgs={{category: 'User', action: 'Updating user profile'}} analyticsInitialValuesAction="Get User Profile">
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
                  <Switches
                          color="primary"
                          name="mailing_list"
                          onClick={this.handleSwitchChange}
                          data={this.mailingListSwitchData}
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

export default withStyles(useStyles)(UserProfile);