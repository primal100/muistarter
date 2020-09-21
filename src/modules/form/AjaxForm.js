import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import compose from 'recompose/compose';
import {Form, FormSpy} from 'react-final-form';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import {withStyles} from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {FORM_ERROR} from "final-form";
import { API } from '../api';
import AjaxRequest from "../components/AjaxRequest";
import { nullOrEmptyObject } from "../utils"


const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY


function capitalize(str){
    return  `${str[0].toUpperCase()}${str.slice(1)}`
}

class AjaxForm extends React.Component {
    form = null;
    callback = null;
    formKeys = [];
    state = {
        sent: false,
        values: null,
        initialValues: null,
        submitKey: 0
    }

    async componentDidMount(){
        if (this.props.loadInitialValuesFromURL){
            const response = await API.get(this.props.loadInitialValuesFromURL);
            this.setState({initialValues: response.data})
        }else if (this.props.initialValues){
            this.setState({initialValues: this.props.initialValues})
        }
    }

    onSubmitSuccess = (data, request, reDirected) => {
        console.log('onSubmitSuccess called with', data)
        let updatedState = {};
        let unRendered;

        if (this.props.onSuccess) {
            unRendered = this.props.onSuccess(data, this.form, request);
        }

        unRendered = reDirected || unRendered;

        console.log('unRendered', unRendered);
        console.log(this.state.initialValues, "initialValues", !nullOrEmptyObject(this.state.initialValues))
        console.log(data[responseKey], "data[responseKey]", nullOrEmptyObject(data[responseKey]))
        if (!unRendered ){
            if (this.props.restartFormOnSuccess && this.form){
                console.log('Scheduling form restart')
                setTimeout(this.form.restart, 0);
            }
            else if (this.props.updateInitialValuesOnResponse && nullOrEmptyObject(data[responseKey])) {
                const updatedInitialValues = {...this.state.initialValues, ...data};
                console.log('Setting initialValues', updatedInitialValues)
                updatedState.initialValues = updatedInitialValues;
            }
            updatedState.sent = false;
            this.setState(updatedState);
            console.log('State set to false');
        }
        this.callback();
    }

    onSubmitError = (data, request) => {
        console.log('Running onSubmitError')
        console.log(!nullOrEmptyObject(data[responseKey]))
        console.log(!nullOrEmptyObject(data[non_field_errors_key]))
        console.log("Data", data)
        let errors;
        if (!nullOrEmptyObject(data[responseKey])) {
            errors = {[FORM_ERROR]: data[responseKey]}
        }else if (!nullOrEmptyObject(data[non_field_errors_key])){
            errors = {[FORM_ERROR]: data[non_field_errors_key]}
        }else{
            console.log('Getting field errors');
            errors = Object.keys(data).reduce((obj, k) => {
                let value = obj[k]
                if (value && value.length > 0) {
                    if ( !this.formKeys.includes(k)){
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
        this.callback(errors);
    }

    handleSubmit = async (values, form, callback) => {
        console.log('Submitting form with values', values);
        this.form = form;
        this.callback = callback;
        this.formKeys = Object.keys(values);
        this.setState({sent: true})
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
        this.setState({values: values, submitKey: this.state.submitKey + 1})
    }

    render() {
        const {classes, formID, initialValues, validate, onSuccess, onValuesChange, ...ajaxRequestProps} = this.props;
        return (
            <React.Fragment>
                {this.state.values &&
                <AjaxRequest key={this.state.submitKey} onSuccess={this.onSubmitSuccess}
                             onError={this.onSubmitError} values={this.state.values}
                             hideAlertsOnError {...ajaxRequestProps}/>}
                <Form onSubmit={this.handleSubmit} subscription={{submitting: true}} validate={validate}
                      initialValues={this.state.initialValues}
                      render={({submitError, handleSubmit, form}) => (
                          <form id={formID || ""} onSubmit={handleSubmit} className={classes.form} noValidate>
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
                              {this.props.onValuesChange && <FormSpy subscription={{values: true}}>
                                  {({values}) => {
                                      this.props.onValuesChange(values, form);
                                      return (<React.Fragment/>)
                                  }}
                              </FormSpy>}
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

export default compose(
  withStyles(useStyles),
  withRoot,
)(AjaxForm);