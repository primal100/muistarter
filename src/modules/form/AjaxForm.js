import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import { Redirect } from 'react-router-dom'
import compose from 'recompose/compose';
import { Form, FormSpy } from 'react-final-form';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../form/styles';
import { API } from '../api';
import { FORM_ERROR } from "final-form";


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
          redirect: false
      }
    };

    handleSubmit = async (values) => {
        this.setState({sent: true})

        try {
            let response = await API({
                method: this.props.method,
                url: this.props.url,
                data: values
            })
            let data = response.data;
            if (this.props.onSuccess) {
                this.props.onSuccess(data);
            }else if (this.props.successTo) {
                this.setState({redirect: true})
            }
        }catch (e) {
            let data = e.response.data;
            this.setState({sent: false})
            if (data[response_key] && data[response_key].length > 0) {
                return {[FORM_ERROR]: data[response_key]}
            }else if (data[non_field_errors_key] && data[non_field_errors_key].length > 0){
                return {[FORM_ERROR]: data[non_field_errors_key]}
            }else{
                return Object.keys(data).reduce(function(obj, k) {
                    let value = obj[k]
                    if (value) {
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
          return <Redirect to={this.props.successTo} />
      }
      const { classes } = this.props;
      return (
        <React.Fragment>
            <Form onSubmit={this.handleSubmit} subscription={{ submitting: true }} validate={this.props.validate}
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
                  <FormButton
                    className={classes.button}
                    disabled={submitting || this.state.sent}
                    size="large"
                    color="secondary"
                    fullWidth
                  >
                    {submitting || this.state.sent ? 'In progress…' : this.props.buttonText}
                  </FormButton>
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
  withRoot
)(AjaxForm);