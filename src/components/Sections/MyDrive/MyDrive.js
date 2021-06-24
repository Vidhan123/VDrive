import React from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Button } from '@material-ui/core';
import { Add, DeleteForever, Folder } from '@material-ui/icons';

import { tempFiles ,tempFiles2, tempFolders } from '../../helpers';
import FilesView from '../FilesView';
import FoldersView from '../FoldersView';

function MyDrive(props) {

  const { recents, files, star, unstar, deleteFile, sL } = props;

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>My Drive</Typography>}
          />
          {/* <ListItemSecondaryAction>
            <IconButton edge="end" style={{border:'none',outline:'none'}}>
              <DeleteForever fontSize="large" />
            </IconButton>
          </ListItemSecondaryAction> */}
        </ListItem>      
      </List>
      
      <Divider />

      <List>
        <ListItem>
          <ListItemText primary="Recent" style={{cursor: 'default'}} />
        </ListItem>      
      </List>
      <FilesView 
        files={recents} 
        deleteFile={deleteFile} 
        star={star}
        unstar={unstar}
        sL={sL}
      />

      <List>
        <ListItem>
          <ListItemText primary="Folders" style={{cursor: 'default'}} />
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
          <ListItemText primary="Files" style={{cursor: 'default'}} />
        </ListItem>      
      </List>
      <FilesView
        files={files} 
        deleteFile={deleteFile} 
        star={star}
        unstar={unstar}
        sL={sL}
      />
    </>
  );
}

export default MyDrive;