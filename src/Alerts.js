// --- Post bootstrap -----
import React from 'react';
import Alert from "@material-ui/lab/Alert";
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { makeStyles } from '@material-ui/core/styles';
import {withStyles} from "@material-ui/core/styles";
import withRoot from "./modules/withRoot";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    '& > * + *': {
      marginTop: theme.spacing(4),
    },
  },
}));


class Alerts extends React.Component {
    render() {
        console.log(this.props)
        const { classes } = this.props;
        return (
            <React.Fragment>
            {this.props.location.state && this.props.location.state.successMessage && <div className={classes.root + " success-message"} ><Alert severity="success">{this.props.location.state.successMessage}</Alert></div>}
            {this.props.location.state && this.props.location.state.errorMessage && <div className={classes.root + " error-message"} ><Alert severity="error">{this.props.location.state.errorMessage}</Alert></div>}
            </React.Fragment>
        )
    }
}


export default compose(
    withStyles(useStyles),
    withRoot,
    withRouter
)(Alerts);
