import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Paper from '../components/Paper';

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundImage: '/appCurvyLines.png',
    backgroundRepeat: 'no-repeat',
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8, 6),
    },
    color: theme.palette.text.secondary
  },
  box: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(12),
    },
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    }
  }
});

function AppForm(props) {
  const { children, classes } = props;

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Box className={classes.box}>
          <Paper className={classes.paper}>{children}</Paper>
        </Box>
      </Container>
    </div>
  );
}

AppForm.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppForm);