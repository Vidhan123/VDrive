import React, { useState, useEffect } from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import FilesView from '../FilesView';

function Others(props) {

  const { name, trashFiles, recents, starred, shared, star, unstar, deleteFile, sL, emptyTrash } = props;

  const [fileIds, setFileIds] = useState([]);

  useEffect(() => {
    let myIds = [];
    for(let i=0;i<trashFiles.length;i++) {
      myIds.push(trashFiles[i].fileId);
    }
    setFileIds(myIds);
  }, [trashFiles])

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>{name}</Typography>}
          />
          {
            name !== 'Trash' ? <div></div> :
            <ListItemSecondaryAction>
              <IconButton edge="end" style={{border:'none',outline:'none'}}
                onClick={() => emptyTrash(fileIds)}
              >
                <DeleteForever fontSize="large" />
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>      
      </List>
      
      <Divider />
      <br />
      <FilesView files={
        name === 'Trash' ? trashFiles 
        :
        name === 'Recent' ? recents
        :
        name === 'Starred' ? starred
        :
        shared
      }
        deleteFile={deleteFile}
        star={star}
        unstar={unstar}
        sL={sL}
      />
    </>
  );
}

export default Others;