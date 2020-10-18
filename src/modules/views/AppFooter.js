import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import { OutboundLink } from "react-ga";

function Copyright(props) {
  const title = props.title || "Your Website";
  return (
    <React.Fragment>
      <Typography color="inherit">
        © {title}
      </Typography>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    marginBottom: 0,
    margin: 0,
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  linkNoUnderline: {
    color: theme.palette.primary.light,
    textDecoration: 'none'
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
  rightLinks: {
    justifyContent: 'flex-end',
  }
}));

export default function AppFooter(props) {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={9} sm={9} md={9}>
            <Grid
              container
              direction="column"
              justify="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item>
                <Copyright title={props.title}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <Typography variant="body1">
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <OutboundLink className={classes.linkNoUnderline} to="/terms/" target="_blank" eventLabel="Clicked on footer link to terms & conditions">Terms</OutboundLink>
              </li>
              <li className={classes.listItem}>
                <OutboundLink className={classes.linkNoUnderline} to="/privacy/" target="_blank" eventLabel="Clicked on footer link to terms & conditions">Privacy</OutboundLink>
              </li>
            </ul>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}