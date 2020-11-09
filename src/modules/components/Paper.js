import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import MuiPaper from '@material-ui/core/Paper';
import { capitalize } from '@material-ui/core/utils';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  backgroundLight: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.main
  },
  backgroundMain: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.light
  },
  backgroundDark: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.primary.light
  },
  padding: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
    }
  },
});

function Paper(props) {
  const { background = 'light', classes, className, padding = false, ...other } = props;
  return (
    <MuiPaper
      elevation={0}
      className={clsx(
        classes[`background${capitalize(background)}`],
        {
          [classes.padding]: padding,
        },
        className,
      )}
      {...other}
    />
  );
}

Paper.propTypes = {
  background: PropTypes.oneOf(['light', 'main', 'dark']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool,
};

export default withStyles(styles)(Paper);