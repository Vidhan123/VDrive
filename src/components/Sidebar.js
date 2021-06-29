import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import clsx from 'clsx';
import { Drawer, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Avatar, ListSubheader } from '@material-ui/core';
import { ChevronLeft, FolderShared, QueryBuilder, StarBorder, DeleteOutline, Storage, CloudQueue, LibraryBooks } from '@material-ui/icons';
import Identicon from 'identicon.js';
import LinearWithValueLabel from './LinearProgressWithLabel';
import './App.css';

import { myColor } from './helpers';

function Sidebar(props) {
  const { open, handleDrawerClose, account, section, setSection, sizeUsed } = props;

  let history = useHistory();
  const classes = useStyles();

  const myItemsArray = [
    {
      name: "My Drive",
      icon: <LibraryBooks fontSize="large" />
    },
    {
      name: "Shared with me",
      icon: <FolderShared fontSize="large" />
    },
    {
      name: "Recent",
      icon: <QueryBuilder fontSize="large" />
    },
    {
      name: "Starred",
      icon: <StarBorder fontSize="large" />
    },
    {
      name: "Trash",
      icon: <DeleteOutline fontSize="large" />
    }
  ];

  const secondaryListItems = (
    <div>
      <List>
        <ListSubheader inset style={{cursor: 'default'}}>Account Details</ListSubheader>
        <ListItem>
          <ListItemIcon>
          {account? 
            <Avatar src={`data:image/png;base64,${new Identicon(account, 30).toString()}`} />
            : <span></span>
          }
          </ListItemIcon>
          <ListItemText primary={account && account.substring(0,6)+'...'+account.substring(38,42)} style={{cursor: 'default'}} />
        </ListItem>
      </List>
      <Divider />
      <br />
      <List>
        {myItemsArray.map((item, index) => 
           <ListItem button
           key={index} 
           onClick={() => {
              setSection(item.name);
              history.push('/');
            }}
           style={{backgroundColor: section === item.name && "rgba(63,81,181,0.4)", color: section === item.name && myColor}}  
          >
            <ListItemIcon style={{color: section === item.name && myColor}}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              disableTypography
              primary={section === item.name ?
                <Typography style={{fontWeight: '750'}}>
                  {item.name}
                </Typography>
                :
                <Typography>{item.name}</Typography>
              } 
            />
         </ListItem>
        )}
        <br />
        <Divider />
        <br />
        <ListItem>
          <ListItemIcon>
            <CloudQueue fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="Storage" style={{cursor: 'default'}} />
        </ListItem>
        <ListItem>
          <LinearWithValueLabel left={sizeUsed} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Storage fontSize="large" />
          </ListItemIcon>
          <ListItemText secondary={`${sizeUsed} MB of 10 GB used`} style={{cursor: 'default'}} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} style={{border:'none',outline:'none'}}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        {secondaryListItems}
      </Drawer>
    </>
  )
}

export default Sidebar;