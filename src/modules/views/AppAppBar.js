import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Tooltip from '@material-ui/core/Tooltip';
import { UserContext } from "../contexts";
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import SignOut from "../components/SignOut";


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
    justifyContent: "flex-start"
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  center: {
    flex: 0,
    justifyContent: "center"
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
  state = {
    signOut: false
  }

  changeSignOutState = () => {
    this.setState({signOut: !this.state.signOut})
  }

  render() {
    const {classes} = this.props;

    return (
        <div>
          <UserContext.Consumer>
              {({user, updater}) => {
                console.log(user);
                return (
                  <React.Fragment>
          {user && this.state.signOut && <SignOut onSuccess={this.changeSignOutState}/>}
          <AppBar position="fixed">
            <Toolbar className={classes.toolbar}>
              <div className={classes.left}>
               <Tooltip title="Home" aria-label="Go Home">
                <IconButton
                    id="home"
                    component={RouterLink} to="/"
                    color="inherit"
                >
                  <HomeIcon/>
                </IconButton>
               </Tooltip>
              </div>
              <div className={classes.center}/>
              <Link
                  variant="h6"
                  underline="none"
                  color="inherit"
                  className={classes.title}
                  component={RouterLink} to="/"
              >
                {'onepirate'}
              </Link>
              {!user && <div className={classes.right}>
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
              {user && <div className={classes.right}>
               {this.props.children}
               <Tooltip title="Profile" aria-label="Account of current user">
                <IconButton
                    id="profile"
                    component={RouterLink} to="/profile"
                    color="inherit"
                >
                  <AccountCircle/>
                </IconButton>
               </Tooltip>
               <Tooltip title="Sign out" aria-label="Sign out">
                <IconButton
                    id="sign-out"
                    component={Link}
                    onClick={this.changeSignOutState}
                    color="inherit"
                >
                  <ExitToAppIcon/>
                </IconButton>
               </Tooltip>
                {user.is_staff && <Chip id="is-staff"
                  icon={<FaceIcon />}
                  label="Staff Account"
                  color="secondary"
                />}
                {this.props.showName && <span id="username">{user.first_name} {user.last_name} {user.email}</span>}
              </div>}
            </Toolbar>
          </AppBar>
          <div className={classes.placeholder}/>
          </React.Fragment>
          )}}
        </UserContext.Consumer>
        </div>
    );
  }
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);