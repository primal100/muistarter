import React from 'react';
import {Form, FormSpy} from 'react-final-form';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import {withStyles} from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {FORM_ERROR} from "final-form";
import { capitalize } from '@material-ui/core/utils';
import AjaxRequest from "../components/AjaxRequest";
import { nullOrEmptyObject } from "../utils"


const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const nonFieldErrorsKey = process.env.REACT_APP_NON_FIELD_ERRORS_KEY


class AjaxForm extends React.Component {
    form = null;
    callback = null;
    formKeys = [];
    state = {
        sent: false,
        values: null,
        initialValues: this.props.initialValues,
        submitKey: 0
    }

    onGetInitialValues = (responseData) => {
        this.setState({initialValues: responseData})
    }

    onSubmitSuccess = (data, request, reDirected) => {
        let updatedState = {};
        let unRendered;

        if (this.props.onSuccess) {
            unRendered = this.props.onSuccess(data, this.form, request);
        }

        unRendered = reDirected || unRendered;
        if (!unRendered ){
            if (this.props.restartFormOnSuccess && this.form){
                setTimeout(this.form.restart, 0);
            }
            else if (this.props.updateInitialValuesOnResponse) {
                if (nullOrEmptyObject(data[responseKey])) {
                    updatedState.initialValues = {...this.state.initialValues, ...data};
                }else{
                    updatedState.initialValues = {...this.state.initialValues, ...request.data};

                }
            }
            updatedState.sent = false;
            this.setState(updatedState);
        }
        this.callback();
    }

    onSubmitError = (data, request) => {
        let errors;
        if (!nullOrEmptyObject(data[responseKey])) {
            errors = {[FORM_ERROR]: data[responseKey]}
        }else if (!nullOrEmptyObject(data[nonFieldErrorsKey])){
            errors = {[FORM_ERROR]: data[nonFieldErrorsKey]}
        }else{
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
        const {classes, formID, initialValues, validate, onSuccess, onValuesChange, analyticsEventArgs,
            analyticsInitialValuesAction, noTopPadding, ...ajaxRequestProps} = this.props;
        let formProps = {};
        let buttonProps = {};

        const formAnalyticsEventArgs = {...analyticsEventArgs, label: 'Form'}
        let formAnalyticsInitialValuesEventArgs;
        if (formAnalyticsEventArgs && analyticsInitialValuesAction) {
            formAnalyticsInitialValuesEventArgs = {category: formAnalyticsEventArgs.category,
                action: analyticsInitialValuesAction, label: 'FormInitialValues'}
        }

        if (formID){
            formProps.id = formID;
            buttonProps.id = `${formID}-button`;
        }

        return (
            <React.Fragment>
                {this.props.loadInitialValuesFromURL &&
                    <AjaxRequest url={this.props.loadInitialValuesFromURL} method="GET"
                                 onSuccess={this.onGetInitialValues} showBackdrop
                    analyticsEventArgs={formAnalyticsInitialValuesEventArgs}/>}
                {this.state.values &&
                    <AjaxRequest key={this.state.submitKey} onSuccess={this.onSubmitSuccess}
                             onError={this.onSubmitError} values={this.state.values}
                             hideAlertsOnError analyticsEventArgs={formAnalyticsEventArgs} {...ajaxRequestProps}/>}
                <Form onSubmit={this.handleSubmit} subscription={{submitting: true}} validate={validate}
                      initialValues={this.state.initialValues}
                      render={({submitError, handleSubmit, form}) => (
                          <form {...formProps} onSubmit={handleSubmit} className={!noTopPadding ? classes.form : undefined} noValidate>
                              <fieldset disabled={this.state.sent} className={classes.fieldset}>
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
                                  {...buttonProps}
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

export default withStyles(useStyles)(AjaxForm);