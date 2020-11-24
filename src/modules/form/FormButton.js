import React from 'react';
import PropTypes from 'prop-types';
import defer from './defer';
import Button from '../components/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    notMounted: {
      '&.Mui-disabled':{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.light,
        }
      }
    })
)


function FormButton(props) {
  const classes = useStyles();
  let { disabled, mounted, ...others } = props;
  if (!mounted) others.classes = {disabled: classes.notMounted}
  return <Button disabled={!mounted || disabled} type="submit" variant="contained" {...others} />;
}

FormButton.propTypes = {
  disabled: PropTypes.bool,
  mounted: PropTypes.bool,
};

export default defer(FormButton);