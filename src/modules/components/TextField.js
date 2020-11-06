import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';
import { capitalize } from '@material-ui/core/utils';


const styles = (theme) => ({
  input: {
    minWidth: theme.spacing(6),
    color: theme.palette.primary.main
  },
  disabled: {
    color: theme.palette.text.disabled
  },
  inputSizeSmall: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
  },
  inputSizeMedium: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
  },
  inputSizeLarge: {
    width: `calc(100% - ${22 * 2}px)`,
  },
  inputSizeXlarge: {
    width: `calc(100% - ${25 * 2}px)`,
  },
  formLabel: {
  },
  select: {
    height: 'auto',
  },
  selectIcon: {

  }
});

function TextField(props) {
  const {
    classes,
    disabledProps,
    InputProps = {},
    InputLabelProps,
    noBorder = false,
    size = 'medium',
    SelectProps,
    ...other
  } = props;
  console.log('TextFieldOther', other)
  console.log('TextFieldSelectProps', SelectProps)
  const {
    classes: { input: InputPropsClassesInput, ...InputPropsClassesOther } = {},
    ...InputPropsOther
  } = InputProps;
  return (
    <MuiTextField
      InputProps={{
        classes: {
          input: clsx(
            classes.input,
            classes[`inputSize${capitalize(size)}`],
            InputPropsClassesInput,
          ),
          disabled: disabledProps || classes.disabled,
          ...InputPropsClassesOther,
        },
        ...InputPropsOther,
      }}
      InputLabelProps={{
        ...InputLabelProps,
        className: classes.formLabel,
      }}
      SelectProps={{
        ...SelectProps,
        classes: {
          select: classes.select,
          icon: classes.selectIcon,
        },
      }}
      {...other}
    />
  );
}

TextField.propTypes = {
  classes: PropTypes.object.isRequired,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  noBorder: PropTypes.bool,
  SelectProps: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'comment', 'description']),
};

export default withStyles(styles)(TextField);