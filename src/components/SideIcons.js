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
          <ListItem button onClick={() => window.open("https://github.com/Vidhan123")}>
            <GitHub fontSize="large" color="primary" />
          </ListItem>
          <br />
          <ListItem button onClick={() => window.open("https://in.linkedin.com/in/vidhan-s-8461b6104")}>
            <LinkedIn fontSize="large" color="primary" />
          </ListItem>
          <br />
          <ListItem button onClick={() => window.open("mailto:shahvidhan123@gmail.com")}>
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
