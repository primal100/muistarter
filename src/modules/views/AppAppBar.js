import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Tooltip from '@material-ui/core/Tooltip';
import { isLoggedIn } from "axios-jwt";


const styles = (theme) => ({
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});


class AppAppBar extends React.Component {

  render() {
    const authenticated = isLoggedIn();
    const {classes} = this.props;

    return (
        <div>
          <AppBar position="fixed">
            <Toolbar className={classes.toolbar}>
              <div className={classes.left}/>
              <Link
                  variant="h6"
                  underline="none"
                  color="inherit"
                  className={classes.title}
                  component={RouterLink} to="/"
              >
                {'onepirate'}
              </Link>
              {!authenticated && <div className={classes.right}>
                <Link
                    id="sign-in"
                    color="inherit"
                    variant="h6"
                    underline="none"
                    className={classes.rightLink}
                    component={RouterLink} to="/sign-in"
                >
                  {'Sign In'}
                </Link>
                <Link
                    id="sign-up"
                    variant="h6"
                    underline="none"
                    className={clsx(classes.rightLink, classes.linkSecondary)}
                    component={RouterLink} to="/sign-up"
                >
                  {'Sign Up'}
                </Link>
              </div>}
              {authenticated && <div className={classes.right}>
               <Tooltip title="Profile">
                <IconButton
                    id="profile"
                    aria-label="account of current user"
                    href="/profile"
                    color="inherit"
                >
                  <AccountCircle/>
                </IconButton>
               </Tooltip>
               <Tooltip title="Sign out">
                <IconButton
                    id="sign-out"
                    aria-label="sign out"
                    href="/sign-out"
                    color="inherit"
                >
                  <ExitToAppIcon/>
                </IconButton>
               </Tooltip>
              </div>}
            </Toolbar>
          </AppBar>
          <div className={classes.placeholder}/>
        </div>
    );
  }
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);