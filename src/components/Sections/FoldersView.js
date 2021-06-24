import React from 'react';
import { Button } from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import '../App.css';

function FoldersView(props) {
  
  return (
    <>
      {
        props.folders.map((folder, index) => 
          <div key={index} style={{display: 'inline-block', margin: '10px'}}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<Folder />}
              style={{ outline: 'none' }}
            >
              {folder.name}
            </Button>
          </div>
        )
      }
    </>
  )
}

export default FoldersView;