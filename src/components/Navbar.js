import React from 'react';
import { useStyles } from './styles';
import clsx from 'clsx';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import './App.css';

import logo from '../assets/logo.png';

function Navbar(props) {
  const { open, handleDrawerOpen } = props;

  const classes = useStyles();

  return (
    <>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            style={{border:'none',outline:'none'}}
          >
            <Menu />
          </IconButton>
          <div className="header__logo">
            <img src={logo} alt="logo" />
          </div>
          <Typography component="h1" variant="h6" noWrap className={classes.title}>
            VDrive
          </Typography>
          {/* <IconButton color="inherit" 
          onClick={() => handleSignOut()}
          >
            <Badge color="secondary">
              <PowerSettingsNew />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar;