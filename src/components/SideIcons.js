import React from 'react';
import './App.css';
import { List, ListItem } from '@material-ui/core';
import { GitHub, LinkedIn, MailOutline } from '@material-ui/icons';

function SideIcons () {
  return (
    <div className='sideIcons'>
      <div className="sideIcons__top">
        <List>
          <br />
          <ListItem button>
            <GitHub fontSize="large" color="primary" />
          </ListItem>
          <br />
          <ListItem button>
            <LinkedIn fontSize="large" color="primary" />
          </ListItem>
          <br />
          <ListItem button>
            <MailOutline fontSize="large" color="primary" />
          </ListItem>
          <br />
          <hr className="hr" />
          <br />
        </List>
      </div>
    </div>
  )
}

export default SideIcons;
