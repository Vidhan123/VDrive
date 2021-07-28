import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import clsx from 'clsx';
import { Drawer, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Avatar, ListSubheader, Button } from '@material-ui/core';
import { ChevronLeft, FolderShared, QueryBuilder, StarBorder, DeleteOutline, Storage, CloudQueue, LibraryBooks, DataUsage } from '@material-ui/icons';
import Identicon from 'identicon.js';
import LinearWithValueLabel from './LinearProgressWithLabel';
import Swal from 'sweetalert2';
import './App.css';
import './Plans/Plans.css';

import { myColor } from './helpers';

function Sidebar(props) {
  const { open, handleDrawerClose, account, section, setSection, sizeUsed, totalSize } = props;

  const [vidBal, setVidBal] = useState(0);

  let history = useHistory();
  const classes = useStyles();

  const handleBuyStorage = (a) => {
    console.log(a);
  };

  const handleBuyStorageModal = () => {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      title: 'Additional Storage',
      didOpen: () => {
        document.getElementById("b1").addEventListener("click", function() {
          handleBuyStorage(5);
        });
        document.getElementById("b2").addEventListener("click", function() {
          handleBuyStorage(10);
        });
        document.getElementById("b3").addEventListener("click", function() {
          handleBuyStorage(15);
        });
      },
      html: 
      `
      <h3 style="text-align: left">Available Balance: ${vidBal} VID Tokens</h3> 
      <br />
      <br />
      <div class="wrap">
      <div class="con-items">
              <div class="item item1" >
                  <header>
                      <h3>Basic</h3>
                      <p>
                          <b>
                            50 VID Tokens
                          </b>
                      </p>
                  </header>
                  <ul>
                      <li>
                          <b>
                            5 GB
                          </b>
                            Additional Storage
                      </li>
                  </ul>
                  <button id="b1">
                      Choose Plan 
                  </button>
              </div>
              <div class="item color item2">
                  <span class="badge">
                      Popular
                  </span>
                  <header>
                      <h3>Special</h3>
                      <p>
                          <b>
                            75 VID Tokens
                          </b>
                      </p>
                  </header>
                  <ul>
                      <li>
                          <b>
                              10 GB
                          </b>
                            Additional Storage
                      </li>
                  </ul>
                  <button class="border" id="b2">
                      Choose Plan 
                  </button>
              </div>
              <div class="item item3">
                  <header>
                      <h3>Super Saver</h3>
                      <p>
                          <b>
                              100 VID Tokens
                          </b>
                      </p>
                  </header>
                  <ul>
                      <li>
                          <b>
                              15 GB
                          </b>
                            Additional Storage
                      </li>
                  </ul>
                  <button id="b3">
                      Choose Plan 
                  </button>
              </div>
          </div>
      </div>
      <br />
      <br />
      `
      ,
      width: 1050,
      showConfirmButton: false,
      // confirmButtonText: 'Okay',
      // icon: 'info',
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    })
  };

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
            <DataUsage fontSize="large" />
          </ListItemIcon>
          <ListItemText secondary={`${sizeUsed} MB of ${totalSize} GB used`} style={{cursor: 'default'}} />
        </ListItem>
      </List>
      <List>
        <ListItem button style={{ backgroundColor: "rgba(63,81,181,0.5)", color: "#fff" }} onClick={() => handleBuyStorageModal()}>
          <ListItemIcon>
            <Storage fontSize="large" style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Buy Extra Storage" />
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