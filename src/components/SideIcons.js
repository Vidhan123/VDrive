import React from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import { List, ListItem } from '@material-ui/core';
import { AccountBalanceWallet, Ballot, GitHub, LinkedIn, MailOutline } from '@material-ui/icons';

function SideIcons (props) {
  const { deployer, account } = props;

  let history = useHistory();

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
          <ListItem>
            <hr style={{ width: "100%" }} />
          </ListItem>
          <br />
          <ListItem button onClick={() => history.push("/news")}>
            <Ballot fontSize="large" color="primary" />
          </ListItem>
          {
            deployer === account &&
            <ListItem button onClick={() => history.push("/admin")}>
              <AccountBalanceWallet fontSize="large" color="primary" />
            </ListItem>
          }
        </List>
      </div>
    </div>
  )
}

export default SideIcons;
