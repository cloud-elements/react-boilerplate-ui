import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import queryString from 'query-string';

import ObjectMenu from './ObjectMenu';
import MainContent from '../MainContent';
// import styles from './NavBarStyles';
const drawerWidth = 240;

const styles = theme => {
  return ({
    root: {
      width: '100%',
      zIndex: 1,
      overflow: 'hidden',
    },
    appFrame: {
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    appBar: {
      position: 'absolute',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    'appBarShift-left': {
      marginLeft: drawerWidth,
    },
    'appBarShift-right': {
      marginRight: drawerWidth,
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20,
    },
    hide: {
      display: 'none',
    },
    drawerPaper: {
      position: 'relative',
      height: '100%',
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    content: {
      width: '100%',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      height: 'calc(100% - 56px)',
      minHeight: window.innerHeight * 0.9,
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
    'content-left': {
      marginLeft: -drawerWidth,
    },
    'content-right': {
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    'contentShift-left': {
      marginLeft: 0,
    },
    'contentShift-right': {
      marginRight: 0,
    },
  });
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      route: null
    };
    this.changeRoute = this.changeRoute.bind(this);
  }

  // primative route handling is tracked simply by attaching a `route` property to state of this high level component
  // route is passed to the `MainContent` component which renders the correct content based on the route prop
  // current implemented options for route are `integrations`, `settings`, `contacts`, or `accounts`
  changeRoute = (newRoute) => {
    this.setState({
      route: newRoute
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentWillMount() {
    const queryParams = queryString.parse(window.location.search);
    // If an OAuth code is detected change the route to login page
    if (queryParams.code) {
        this.changeRoute("integrations");
    }
}

  render() {
    const { classes, theme, ceKeys, appUrl } = this.props;
    const { open, route } = this.state;

    // handles the popout drawer menu, which only appears if state.open is true
    const drawer = (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={open}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <ObjectMenu
            classes={classes}
            tableChanger={(newRoute) => this.changeRoute(newRoute)}
          />
        </div>
      </Drawer>
    );


    // the actual content to be rendered is returned here
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-left`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap>
                SaaS Demo App
              </Typography>
            </Toolbar>
          </AppBar>
          {drawer}
          <main
            className={classNames(classes.content, classes[`content-left`], {
              [classes.contentShift]: open,
              [classes[`contentShift-left`]]: open,
            })}
          >
            <MainContent
              route={route}
              ceKeys={ceKeys}
              appUrl={appUrl}
            />
          </main>
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavBar);