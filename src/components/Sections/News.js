import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText, Typography, ListItemIcon, Button, Card, CardActionArea, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import moment from 'moment';
import axios from 'axios';

import Swal from 'sweetalert2';

function News(props) {
  const { myTokenBalance, Tip } = props;

  const [allNews, setAllNews] = useState([]);

  let history = useHistory();

  const fetchNews = async () => {
    const resp = await axios.get("https://newsapi.org/v2/everything?q=blockchain&sortBy=publishedAt&language=en&apiKey=dfcf5210cd9548c58bb38b49794fe05f");
    setAllNews(resp.data.articles);
    console.log(resp.data.articles);
  };

  useEffect(() => {
    if(!window.web3.utils) history.push('/');
    fetchNews();
  }, [])

  const handleTip = () => {
    let amount;
    Swal.fire({
      input: 'text',
      title: 'Enter a amount to tip',
      text: `Available Balance: ${window.web3.utils.fromWei(myTokenBalance)} VID Tokens`,
      confirmButtonText: 'Continue &rarr;',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    }).then((result) => {
      if (result.value) {
        const answers = result.value;
        amount = answers;
        
        if(parseInt(amount) > 0 && parseInt(amount) <= parseInt(window.web3.utils.fromWei(myTokenBalance))) {
          Tip(amount);
        }
      }
    })
  }

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
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Latest News</Typography>}
          />
        </ListItem>      
      </List>
      
      <Divider />
      <br />

      <List>
        {allNews.map((item, index) => (
          <Card key={index} style={{ margin: "10px", display: "inline-block" }}>
            <CardActionArea onClick={() => window.open(item.url)}>
              {
                item.urlToImage &&
                <CardMedia
                  component="img"
                  alt={`img${index}`}
                  height="240"
                  image={item.urlToImage}
                  title="Visit Website"
                />
              }
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="h6" color="textSecondary" component="h5">
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ float: "left", margin: "15px 0" }}>
                  {item.author}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ float: "right", margin: "15px 0" }}>
                  {moment(item.publishedAt).format('h:mm A M/D/Y')}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button variant="contained" size="small" color="primary" onClick={() => handleTip()}>
                Tip
              </Button>
              <Button variant="contained" size="small" color="primary" onClick={() => window.open(item.url)}>
                Read More
              </Button>
              {
                item.source && item.source.name &&
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginLeft: "auto" }}>
                  Source - {item.source.name}
                </Typography>
              }
            </CardActions>
          </Card>
        ))}
      </List>

    </>
  )
}

export default News;