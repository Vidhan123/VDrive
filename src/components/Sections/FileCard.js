import React from 'react';
import { IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import '../App.css';

import { InsertDriveFile, MoreVert } from '@material-ui/icons';

function FileCard(props) {

  const { fileName, fileDescription, fileHash } = props.file;

  return (
    <div className='fileCard'>
      <a className="fileCard--top" href={`https://ipfs.infura.io/ipfs/${fileHash}`} target="_blank" rel="noopener noreferrer" >
      {/* <div id="wrap">
        <iframe title={props.name} id="scaled-frame" src="https://bafybeia244fuooxiqf6k5qi4hdcwlwd3ikdyqigryq3x3u63xyms5nes6i.ipfs.infura-ipfs.io/"></iframe>
      </div> */}
        <InsertDriveFile color="primary" style={{fontSize:130,opacity:0.7}} />
      </a>
      <div className="fileCard--bottom">
        <List>
          <ListItem>
            <ListItemText secondary={fileDescription} />
            <ListItemSecondaryAction>
              <IconButton edge="end" style={{border:'none',outline:'none'}}>
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>      
        </List>
      </div>
    </div>
  )
}

export default FileCard;
