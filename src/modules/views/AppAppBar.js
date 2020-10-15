import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import compose from 'recompose/compose';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Tooltip from '@material-ui/core/Tooltip';
import { UserContext } from "../contexts";
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';


const adminUrl = process.env.REACT_APP_ADMIN_URL
const textColor = "inherit"


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
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  leftLink: {
    flex: 1,
    justifyContent: "flex-start",
    fontSize: 16,
    marginRight: theme.spacing(3),
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  center: {
    flex: 0,
    justifyContent: "center",
    alignItems: 'center',
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  }
});



function TextLinks(props){
  return (
      <React.Fragment>
        {props.links.map(link => {
          const {pathname, leftLink, rightLink, classes} = props;
          const { id, isSecondary, href, ...linkProps} = link;
          console.log('Comparing pathname', pathname, href)
          return (<Link
              id={id}
              variant="h6"
              underline="none"
              color={textColor}
              className={clsx({
                [classes.leftLink]: leftLink,
                [classes.rightLink]: rightLink,
                [classes.linkSecondary]: (pathname === href)
              })}
              component={RouterLink} to={href}
              {...linkProps}
          >
            {link.text}
          </Link>)
        })}
      </React.Fragment>
  )
}


function RightTextLinks(props){
  return (
      <TextLinks {...props} rightLink/>
  )
}


function LeftTextLinks(props){
  return (
      <TextLinks {...props} leftLink/>
  )
}


function RightIconLinks(props){
  return (
      <React.Fragment>
        {props.links.map(link => {
          const {pathname, classes} = props;
          const {Icon, id, title, description, href} = link;
          return (<Tooltip title={title} aria-label={description}>
                <IconButton
                    id={id}
                    component={RouterLink} to={href}
                    className={clsx({
                      [classes.linkSecondary]: (pathname === href)
                    })}
                    color={textColor}
                >
                  <Icon/>
                </IconButton>
               </Tooltip>)
        })}
      </React.Fragment>
  )
}



function getRightLinksText(user){
  if (!user) return [
    {
      id: 'sign-in',
      href: '/sign-in',
      text: 'Sign In'
    },
    {
      id: 'sign-up',
      href: '/sign-up',
      text: 'Sign Up'
    }
  ]
  else return [];
}


function getLeftTextLinks(user, homeText){
  const links = [{
      id: 'home',
      href: '/',
      text: homeText || 'Home'
  }]
  if (user && user.is_staff && adminUrl) links.push({
      id: 'admin',
      href: adminUrl,
      text: 'Admin'
    })
  return links;
}


function getIconLinks(user){
  if (user) return [
    {
      id: 'profile',
      title: 'Profile',
      href: "/profile",
      description: 'Account of current user',
      Icon: AccountCircle,
    },
     {
      id: 'sign-out',
      title: 'Sign out',
      href: "/sign-out",
      description: 'Sign out',
      Icon: ExitToAppIcon,
    }
  ]
  else return [];
}



class AppAppBar extends React.Component {
  state = {
    signOut: false
  }

  render() {
    const {title, location, classes} = this.props;
    console.log("LOCATION", location)
    const pathname = location.pathname;
    return (
        <div>
          <UserContext.Consumer>
              {({user, updater}) => {
                console.log("USER", user);
                    let rightTextLinks;
                    if (this.props.getRightTextLinks) rightTextLinks = this.props.getRightTextLinks(user);
                    else rightTextLinks = getRightLinksText(user);
                    if (this.props.additionalRightTextLinks) rightTextLinks = rightTextLinks.concat(this.props.additionalRightTextLinks(user));
                    let leftTextLinks;
                    if (this.props.getLeftTextLinks) rightTextLinks = this.props.getLeftTextLinks(user);
                    else leftTextLinks = getLeftTextLinks(user);
                    if (this.props.additionalLeftTextLinks) leftTextLinks = leftTextLinks.concat(this.props.additionalLeftTextLinks(user));
                    let iconLinks;
                    if (this.props.getIconLinks) iconLinks = this.props.getIconLinks(user);
                    else iconLinks = getIconLinks(user);
                    if (this.props.additionalIconLinks) leftTextLinks = leftTextLinks.concat(this.props.additionalIconLinks(user));
                return (
                  <React.Fragment>
          <AppBar position="fixed">
            <Toolbar className={classes.toolbar}>
              <div className={classes.left}>
               <LeftTextLinks links={leftTextLinks} pathname={pathname} classes={classes} />
              </div>
              {title && <Link
                  variant="h6"
                  underline="none"
                  color={textColor}
                  className={classes.title}
                  component={RouterLink} to="/"
              >
                {title}
              </Link>}
              <div className={classes.right}>
              <RightTextLinks links={rightTextLinks} pathname={pathname} classes={classes}/>
              {user && <React.Fragment>
               {user.is_staff && <Chip id="is-staff"
                  icon={<FaceIcon />}
                  label="Staff Account"
                  color="secondary"
                />}
                <RightIconLinks links={iconLinks} pathname={pathname} classes={classes}/>
                {this.props.showUserDetails && <div>
                  <Typography variant="body1" color={textColor} id="username">{user.first_name} {user.last_name}</Typography>
                  <Typography variant="body1" color={textColor} id="email">{user.email}</Typography>
                  </div>
                }
                </React.Fragment>}
              </div>
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


export default compose(
    withStyles(styles),
    withRouter
)(AppAppBar);
