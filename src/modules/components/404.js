import React from 'react';
import Typography from "./Typography";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom"
import makeStyles from "@material-ui/core/styles/makeStyles";
import {UserContext} from "../contexts";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(6, 4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));


export default function NotFound404 () {

    const classes = useStyles();

    return (
        <div className={classes.root} id="error-404">
            <Typography component="h1" variant="h2" align="center" gutterBottom>
                That page does not exist
            </Typography>
            <Typography variant="h5" align="center" component="p">
                Sorry about that. Click <Link color="textPrimary" id="home-link" component={RouterLink} to="/">here</Link> to return home.
            </Typography>
        </div>
    )
}