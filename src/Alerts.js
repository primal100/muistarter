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
        const { classes } = this.props;
        if (this.props.location.state) {
            return (
                <React.Fragment>
                    {this.props.location.state.successMessages && this.props.location.state.successMessages.map((value, index) => {
                        return (
                            <div key={index} className={classes.root + " success-message"}>
                                <Alert severity="success">{value}</Alert>
                            </div>
                        )
                    })}
                   {this.props.location.state.errorMessages && this.props.location.state.errorMessages.map((value, index) => {
                       return (
                           <div key={index} className={classes.root + " error-message"}>
                               <Alert severity="error">{value}</Alert>
                           </div>
                       )
                   })}
                </React.Fragment>
            )
        }else {
            return (<div></div>)
        }
    }
}


export default compose(
    withStyles(useStyles),
    withRoot,
    withRouter
)(Alerts);
