import React from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';

function Others(props) {

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6">{props.name}</Typography>}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" style={{border:'none',outline:'none'}}>
              <DeleteForever fontSize="large" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>      
      </List>
      
      <Divider />
    </>
  );
}

export default Others;