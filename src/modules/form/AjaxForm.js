import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import {Redirect} from 'react-router-dom'
import compose from 'recompose/compose';
import {Form, FormSpy} from 'react-final-form';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import {withStyles} from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {FORM_ERROR} from "final-form";
import { API } from '../api';
import { withAlerts } from "../contexts"


const responseKey = process.env.REACT_APP_GENERAL_ERRORS_KEY
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY


function capitalize(str){
    return  `${str[0].toUpperCase()}${str.slice(1)}`
}

class AjaxForm extends React.Component {
    state = {
      sent: false,
      redirect: null,
      initialValues: this.props.initialValues,
    }

    async componentDidMount(){
        if (this.props.loadInitialValuesFromURL){
            const response = await API.get(this.props.loadInitialValuesFromURL);
            this.setState({initialValues: response.data})
        }
    }

    handleSubmit = async (values, form, callback) => {
        console.log('Submitting form with values', values);
        this.setState({sent: true})
        const formKeys = Object.keys(values)
        if (this.props.additonalValues){
            const additionalValues = {};
            Object.assign(additionalValues, this.props.additonalValues)
            Object.assign(values, additionalValues);
        }
        if (this.props.submitModifiedValuesOnly) {
            console.log('InitialValues', this.state.initialValues)
            values = Object.keys(values).reduce((obj, key) => {
                if (values[key] !== this.state.initialValues[key]) {
                    obj[key] = values[key];
                }
                return obj;
            }, {})
        }
        let request;
        if (this.props.createRequest) request = this.props.createRequest(values);
        else if (this.props.method === 'GET'){
            request = {
                    method: 'GET',
                    url: this.props.url,
                    params: values
                }
        }
        else request = {
                    method: this.props.method || 'POST',
                    url: this.props.url,
                    data: values
                }
        console.log("AjaxForm request", request);
        try {
            let data;
            if (Object.keys(values).length !== 0 || request.method === 'GET') {
                let response = await API(request);
                console.log("AjaxForm API Response", response);
                data = response.data;
            }else{
                data = {}
            }
            console.log("AjaxForm API Response Data", data);

            let msg;
            if (this.props.getSuccessMessage) {
                msg = this.props.getSuccessMessage(request, data);
            }else if (this.props.successMessage) {
                msg = this.props.successMessage;
            }else if (this.props.showSuccessMessage && data[responseKey] && data[responseKey].length > 0){
                msg = data[responseKey];
            }

            console.log('AJAXForm adding alert', msg)

            this.props.addAlert(msg, "success");

            let unRendered = false;
            let updatedState = {}
            let redirect
            if (this.props.successTo) redirect = { ...this.props.successTo}
            if (redirect) {
                unRendered = true;
                if (!redirect.state) redirect.state = {}
                if (this.props.addFieldToRedirectPathname) redirect.pathname += data[this.props.addFieldToRedirectPathname]
                if (this.props.addResponseToRedirectState) redirect.state.data = data;
                console.log('redirectState', redirect)
                this.setState({redirect: redirect});
            }

            if (this.props.onSuccess) {
                unRendered = this.props.onSuccess(data, form, request);
            }
            console.log('unRendered', unRendered);
            if (!unRendered ){
                if (this.props.restartFormOnSuccess){
                    console.log('Scheduling form restart')
                    setTimeout(form.restart, 0);
                }
                else if (request.method !== "GET" && this.state.initialValues && Object.keys(this.state.initialValues).length !== 0 && (!data[responseKey] || data[responseKey].length === 0)) {
                    console.log('Setting initialValues', data)
                    updatedState.initialValues = data;
                }
                updatedState.sent = false;
                this.setState(updatedState);
                console.log('State sent to false');
            }

            callback();

        }catch (e) {
            if (! e.response){
                throw e
            }
            let data = e.response.data;
            let errors
            if (data[responseKey] && data[responseKey].length > 0) {
                errors = {[FORM_ERROR]: data[responseKey]}
            }else if (data[non_field_errors_key] && data[non_field_errors_key].length > 0){
                errors = {[FORM_ERROR]: data[non_field_errors_key]}
            }else{
                errors = Object.keys(data).reduce(function(obj, k) {
                    let value = obj[k]
                    if (value && value.length > 0) {
                        if ( !formKeys.includes(k)){
                            k = [FORM_ERROR]
                        }
                        if (Array.isArray(value)) {
                            obj[k] = value.map(v => capitalize(v));
                        } else {
                            obj[k] = capitalize(value);
                        }
                    }
                    return obj;
                }, data);
            }
            this.setState({sent: false})
            callback(errors);
        }
    }

    render() {

        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirect}/>
            )
        } else {
            const {classes, initialValues, ...formProps} = this.props;
            return (
                <React.Fragment>
                    <Form onSubmit={this.handleSubmit} subscription={{submitting: true}} validate={this.props.validate}
                          initialValues={this.state.initialValues} {...formProps}
                          render={({submitError, handleSubmit}) => (
                              <form onSubmit={handleSubmit} className={classes.form} noValidate>
                                  <fieldset disabled={this.state.sent}>
                                      {this.props.children}
                                  </fieldset>
                                  <FormSpy subscription={{submitError: true}}>
                                      {({submitError}) =>
                                          submitError ? (
                                              <FormFeedback className={classes.feedback + " submit-error"} error>
                                                  {submitError}
                                              </FormFeedback>
                                          ) : null
                                      }
                                  </FormSpy>
                                  {!this.props.noSubmitButton && <FormButton
                                      className={classes.button}
                                      disabled={this.state.sent}
                                      size="large"
                                      color="secondary"
                                      fullWidth
                                  >
                                      {this.state.sent ? 'In progress…' : this.props.buttonText}
                                  </FormButton>}
                              </form>
                          )}
                    >
                    </Form>
                </React.Fragment>
            );
        }
    }
}

export default compose(
  withStyles(useStyles),
  withRoot,
  withAlerts
)(AjaxForm);