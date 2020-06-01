import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import Typography from './Typography';
import AppForm from '../views/AppForm';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(12),
    },
  },
}));


function Home(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      {props.location.state && props.location.state.successMessage && <div classes={classes.root} ><Alert severity="success">{props.location.state.successMessage}</Alert></div>}
      {props.location.state && props.location.state.errorMessage && <div classes={classes.root} ><Alert severity="error">{props.location.state.errorMessage}</Alert></div>}
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Home
          </Typography>
        </React.Fragment>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(Home);
