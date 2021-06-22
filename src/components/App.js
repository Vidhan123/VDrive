import React, { useState, useEffect } from 'react';
import DStorage from '../abis/DStorage.json';
import Web3 from 'web3';
import clsx from 'clsx';
import { CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography, Divider, IconButton, Badge, Container, Grid, Paper, ListItem, ListItemIcon, ListItemText, Avatar, ListSubheader, Fab, Tooltip } from '@material-ui/core';
import { Menu, ChevronLeft, FolderShared, QueryBuilder, StarBorder, DeleteOutline, Storage, CloudQueue, LibraryBooks, Add } from '@material-ui/icons';
import MyDrive from './Sections/MyDrive/MyDrive';
import Others from './Sections/Others/Others';
import SideIcons from './SideIcons';
import LinearWithValueLabel from './LinearProgressWithLabel';
import { myColor } from './helpers';
import { useStyles } from './styles';
import Identicon from 'identicon.js';
import Swal from 'sweetalert2';
import './App.css';

import logo from '../assets/logo.png';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState('');
  const [filesCount, setFilesCount] = useState(0);
  const [dstorage, setDstorage] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [sizeUsed, setSizeUsed] = useState(725.5);
  const [section, setSection] = useState('My Drive');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0]);
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if(networkData) {
      // Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      setDstorage(dstorage);
      // Get files amount
      const NoOfFiles = await dstorage.methods.fileCount().call()
      setFilesCount(NoOfFiles);
      // Load files&sort by the newest
      let file;
      let myFiles = [];
      for (let i = NoOfFiles; i >= 1; i--) {
        file = await dstorage.methods.files(i).call()
        myFiles.push(file);
      }
      console.log(myFiles);
      setFiles(myFiles);
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  const uploadFile = (myBuffer, file, myDes) => {
    console.log("Submitting file to IPFS...")

    console.log(myBuffer);
    // Add file to the IPFS
    ipfs.add(myBuffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return;
      }

      setLoading(true);
      // Assign value for the file without extension
      if(file.type === ''){
        setType('none');
      }
      console.log(result[0].hash,result[0].size, file.type, file.name, myDes);
      dstorage.methods.uploadFile(result[0].hash, result[0].size, file.type, file.name, myDes).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
        setType(null);
        setName(null);
        // window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        setLoading(false);
      })
    })
  }

  // Get file from user
  const captureFile = async (file, myDes) => {
    // event.preventDefault()
    // const file = event.target.files[0]
    const reader = new window.FileReader()
    let myBuffer;
    await reader.readAsArrayBuffer(file)
    reader.onloadend = async () => {
      myBuffer = await Buffer(reader.result);
      setBuffer(Buffer(reader.result));
      setType(file.type);
      setName(file.name);

      uploadFile(myBuffer,file,myDes);
    }
  }

  // Open Modal for file upload
  const handleOpenFileUpload = () => {
    let myDes;
    Swal.fire({
      input: 'text',
      title: 'Step 1',
      text: 'Enter a name/description for your file',
      confirmButtonText: 'Next &rarr;',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    }).then((result) => {
      if (result.value) {
        const answers = result.value;
        myDes = answers;
        setFileDescription(answers);
        
        Swal.fire({
          input: 'file',
          title: 'Step 2',
          confirmButtonText: 'Upload',
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: false,
          customClass: {
            container: 'my-swal'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            captureFile(result.value, myDes);

            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'File Uploaded',
              confirmButtonText: 'Okay',
              icon: 'success',
              backdrop: false,
              customClass: {
                container: 'my-swal'
              }
            })
          }
        })
      }
    })
  };

  useEffect(() => {
    const Load = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    Load();
  }, [])

  useEffect(() =>{
    loadBlockchainData();
  }, [loading])

  const classes = useStyles();

  // const handleSignOut = () => {
  //   history.push("/");
  // };

  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const myItemsArray = [
    {
      name: "My Drive",
      icon: <LibraryBooks fontSize="large" />
    },
    {
      name: "Shared with me",
      icon: <FolderShared fontSize="large" />
    },
    {
      name: "Recent",
      icon: <QueryBuilder fontSize="large" />
    },
    {
      name: "Starred",
      icon: <StarBorder fontSize="large" />
    },
    {
      name: "Trash",
      icon: <DeleteOutline fontSize="large" />
    }
  ];

  const secondaryListItems = (
    <div>
      <List>
        <ListSubheader inset>Account Details</ListSubheader>
        <ListItem>
          <ListItemIcon>
          {account? 
            <Avatar src={`data:image/png;base64,${new Identicon(account, 30).toString()}`} />
            : <span></span>
          }
          </ListItemIcon>
          <ListItemText primary={account.substring(0,6)+'...'+account.substring(38,42)} />
        </ListItem>
      </List>
      <Divider />
      <br />
      <List>
        {myItemsArray.map((item, index) => 
           <ListItem button
           key={index} 
           onClick={() => setSection(item.name)}
           style={{backgroundColor: section === item.name && "rgba(63,81,181,0.4)", color: section === item.name && myColor}}  
          >
            <ListItemIcon style={{color: section === item.name && myColor}}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              disableTypography
              primary={section === item.name ?
                <Typography style={{fontWeight: '750'}}>
                  {item.name}
                </Typography>
                :
                <Typography>{item.name}</Typography>
              } 
            />
         </ListItem>
        )}
        <br />
        <Divider />
        <br />
        <ListItem>
          <ListItemIcon>
            <CloudQueue fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="Storage" />
        </ListItem>
        <ListItem>
          <LinearWithValueLabel left={sizeUsed} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Storage fontSize="large" />
          </ListItemIcon>
          <ListItemText secondary={`${sizeUsed} MB of 10 GB used`} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            style={{border:'none',outline:'none'}}
          >
            <Menu />
          </IconButton>
          <div className="header__logo">
            <img src={logo} alt="logo" />
          </div>
          <Typography component="h1" variant="h6" noWrap className={classes.title}>
            VDrive
          </Typography>
          {/* <IconButton color="inherit" 
          onClick={() => handleSignOut()}
          >
            <Badge color="secondary">
              <PowerSettingsNew />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} style={{border:'none',outline:'none'}}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        {secondaryListItems}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          <div>
            {section ? section === "My Drive" ?
              <MyDrive files={files} />
              :
              <Others name={section} />
            : <div></div>}
          </div>
          <Tooltip title="Upload File" aria-label="add">
            <Fab color="secondary" className={classes.absolute} style={{outline: 'none', border: 'none'}} onClick={handleOpenFileUpload}>
              <Add />
            </Fab>
          </Tooltip>
        </Container>
      </main>
      <SideIcons />
    </div>
  );
}

export default App;