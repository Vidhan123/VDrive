import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip, ListItemIcon } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

function Admin(props) {

  let history = useHistory();

  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <IconButton edge="end" style={{border:'none',outline:'none', marginRight: '10px'}}
              onClick={() => history.push('/')}
            >
              <ArrowBackIos />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Transfer Tokens</Typography>}
          />
        </ListItem>      
      </List>
      
      <Divider />
      <br />
    </>
  )
}

export default Admin;