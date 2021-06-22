import React from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Button } from '@material-ui/core';
import { Add, DeleteForever, Folder } from '@material-ui/icons';

import { tempFiles ,tempFiles2, tempFolders } from '../../helpers';
import FilesView from '../FilesView';
import FoldersView from '../FoldersView';

function MyDrive(props) {

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6">My Drive</Typography>}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" style={{border:'none',outline:'none'}}>
              <DeleteForever fontSize="large" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>      
      </List>
      
      <Divider />

      <List>
        <ListItem>
          <ListItemText primary="Recent" />
        </ListItem>      
      </List>
      <FilesView files={props.files} />

      <List>
        <ListItem>
          <ListItemText primary="Folders" />
          <ListItemSecondaryAction>
            <IconButton edge="end" style={{border:'none',outline:'none'}}>
               <Add />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>      
      </List>
      <FoldersView folders={tempFolders} />

      <List>
        <ListItem>
          <ListItemText primary="Files" />
        </ListItem>      
      </List>
      <FilesView files={tempFiles} />
    </>
  );
}

export default MyDrive;