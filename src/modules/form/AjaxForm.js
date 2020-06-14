import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import {Redirect, withRouter} from 'react-router-dom'
import compose from 'recompose/compose';
import {Form, FormSpy} from 'react-final-form';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import {withStyles} from '@material-ui/core/styles';
import useStyles from '../form/styles';
import {changeLocationState} from '../utils'
import {API} from '../api';
import {FORM_ERROR} from "final-form";


const response_key = process.env.REACT_APP_GENERAL_ERRORS_KEY
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY


function capitalize(str){
    return  `${str[0].toUpperCase()}${str.slice(1)}`
}

class AjaxForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          sent: false,
          redirect: false,
          initialValues: {},
      }
    };

    async componentDidMount(){
        if (this.props.loadInitialValuesFromURL){
            const response = await API.get(this.props.loadInitialValuesFromURL);
            this.setState({initialValues: response.data})
        }
    }

    handleSubmit = async (values) => {
        this.setState({sent: true})
        const formKeys = Object.keys(values)
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
        let request;
        if (this.props.createRequest) request = this.props.createRequest(values);
        else request = {
                    method: this.props.method || 'POST',
                    url: this.props.url,
                    data: values
                }
        console.log(request);
        try {
            let data;
            if (Object.keys(values).length !== 0) {
                let response = await API(request);
                data = response.data;
                console.log(data);
            }else{
                this.setState({sent: false});
                return
            }
            let msgs;
            if (this.props.getSuccessMessages) {
                msgs = {successMessages: this.props.getSuccessMessages(request, data)};
            }else if (this.props.showSuccessMessage && data[response_key] && data[response_key].length > 0){
                msgs = {successMessages: [data[response_key]]};
            }
            if (this.props.onSuccess) {
                this.props.onSuccess(data);
                if (msgs) changeLocationState(this.props, msgs);
                this.setState({sent: false})
            }else if (this.props.successTo) {
                if (msgs) this.props.successTo.state = msgs;
                this.setState({redirect: true});
            }else if (this.state.initialValues && Object.keys(this.state.initialValues).length !== 0 && (!data[response_key] || data[response_key].length === 0)){
                if (msgs) changeLocationState(this.props, msgs);
                this.setState({initialValues: data, sent: false})
            }else{
                if (msgs) changeLocationState(this.props, msgs);
                this.setState({sent: false})
            }
        }catch (e) {
            if (! e.response){
                throw e
            }
            let data = e.response.data;
            console.log(data);
            this.setState({sent: false})
            if (data[response_key] && data[response_key].length > 0) {
                return {[FORM_ERROR]: data[response_key]}
            }else if (data[non_field_errors_key] && data[non_field_errors_key].length > 0){
                return {[FORM_ERROR]: data[non_field_errors_key]}
            }else{
                console.log(data);
                return Object.keys(data).reduce(function(obj, k) {
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
        }
    }

    render() {
      if (this.state.redirect){
          return <Redirect to={this.successTo || this.props.successTo} />
      }
      const { classes } = this.props;
      return (
        <React.Fragment>
            <Form onSubmit={this.handleSubmit} subscription={{ submitting: true }} validate={this.props.validate} initialValues={this.state.initialValues}
              render={({ submitError, handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  <fieldset disabled={submitting || this.state.sent}>
                  {this.props.children}
                  </fieldset>
                  <FormSpy subscription={{ submitError: true }}>
                    {({ submitError }) =>
                      submitError ? (
                        <FormFeedback className={classes.feedback + " submit-error"} error>
                          {submitError}
                        </FormFeedback>
                      ) : null
                    }
                  </FormSpy>
                  {!this.props.noSubmitButton && <FormButton
                    className={classes.button}
                    disabled={submitting || this.state.sent}
                    size="large"
                    color="secondary"
                    fullWidth
                  >
                    {submitting || this.state.sent ? 'In progress…' : this.props.buttonText}
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
  withRouter
)(AjaxForm);