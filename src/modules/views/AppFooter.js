import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import Link from "@material-ui/core/Link"
import { Link as RouterLink } from 'react-router-dom';


const websiteLink = process.env.REACT_APP_WEBSITE_LINK;
const footerLogo = process.env.REACT_APP_FOOTER_LOGO || "logo.svg";


function Copyright(props) {
  const title = props.title || "Your Website";
  const titleLink = props.titleLink || websiteLink;
  return (
      <Typography color="primary">
        © {new Date().getFullYear() } <Link href={titleLink}>{title}</Link>
       </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    marginBottom: 0,
    margin: 0,
    width: "100%"
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
            {footerLogo && <Link href={props.titleLink || websiteLink}>
                <img height="64" width="64" src={footerLogo} alt={props.title}/>
            </Link>}
                <Copyright title={props.title} titleLink={props.titleLink}/>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <Typography color="textSecondary" variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <Typography component={'span'}  variant="body1">
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link className={classes.linkNoUnderline} component={RouterLink} to="/terms">Terms And Conditions</Link>
              </li>
              <li className={classes.listItem}>
                <Link className={classes.linkNoUnderline} component={RouterLink} to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}