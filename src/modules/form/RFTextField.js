import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../components/TextField';


function RFTextField(props) {
  const {
    autoComplete,
    input,
    InputProps,
    meta: { touched, error, submitError },
    ...other
  } = props;
  console.log('RFTextFieldOther', other)
  console.log('RFTextFieldinput', input)
  console.log('RFTextFieldinputProps', InputProps)
  return (
    <TextField
      error={Boolean(touched && (error || submitError))}
      {...input}
      {...other}
      InputProps={{
        inputProps: {
          autoComplete,
        },
        ...InputProps,
      }}
      helperText={touched ? error || submitError : ''}
    />
  );
}

RFTextField.propTypes = {
  autoComplete: PropTypes.string,
  input: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool.isRequired,
  }).isRequired,
};

export default RFTextField;