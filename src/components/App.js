import React, { useState, useEffect } from 'react';
import DStorage from '../abis/DStorage.json';
import Web3 from 'web3';
import { CssBaseline, Container, Fab, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MyDrive from './Sections/MyDrive/MyDrive';
import Others from './Sections/Others/Others';
import SideIcons from './SideIcons';
import { myColor, convertBytes, convertBytestoMB } from './helpers';
import { useStyles } from './styles';
import Swal from 'sweetalert2';
import Loading from './Loading/Loading';
import './App.css';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [starredFiles, setStarredFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [dstorage, setDstorage] = useState(null);
  const [sizeUsed, setSizeUsed] = useState(0);
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
      const NoOfTrashFiles = await dstorage.methods.trashCount().call()
      // Load files&sort by the newest
      let file;
      let myFiles=[], myRecentFiles=[], myTrashFiles=[], myStarredFiles=[];
      let totalsize = 0, countRecent = 0;
      for (let i = NoOfFiles; i >= 1; i--) {
        file = await dstorage.methods.files(i).call()
        if(file && file.uploader === account) {
          if(file.starred) myStarredFiles.push(file);
          countRecent++;
          if(countRecent < 6) myRecentFiles.push(file);
          myFiles.push(file);
          totalsize += convertBytestoMB(file.fileSize);
        }
      }
      for (let i = NoOfTrashFiles; i >= 1; i--) {
        file = await dstorage.methods.trashFiles(i).call()
        if(file && file.uploader === account) {
          myTrashFiles.push(file);
          totalsize += convertBytestoMB(file.fileSize);
        }
      }
      console.log(myFiles);
      setFiles(myFiles);
      setRecentFiles(myRecentFiles);
      setStarredFiles(myStarredFiles);
      setTrashFiles(myTrashFiles);
      setSizeUsed(totalsize);
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  const uploadFile = (myBuffer, file, myDes) => {
    // console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(myBuffer, (error, result) => {
      // console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return;
      }

      setLoading(true);
      // Assign value for the file without extension
      let myType = file.type;
      if(file.type === ''){
        myType = 'none';
      }
      if(myDes === ''){
        myDes = file.name;
      }
      dstorage.methods.uploadFile(result[0].hash, result[0].size, myType, file.name, myDes).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
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
      
      uploadFile(myBuffer,file,myDes);
    }
  }

  // Deleting File(Move to trash)
  const deleteFile = async (id, hash) => {
    setLoading(true);

    dstorage.methods.deleteFile(id, hash).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'File moved to Trash',
        confirmButtonText: 'Okay',
        icon: 'success',
        backdrop: false,
        customClass: {
          container: 'my-swal'
        }
      })
      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      setLoading(false);
    })
  }

  // Deleting File Permanently (Move to trash)
  const deleteFileForever = async (id, hash) => {
    setLoading(true);

    dstorage.methods.deleteFileForever(id, hash).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'File Deleted',
        confirmButtonText: 'Okay',
        icon: 'success',
        backdrop: false,
        customClass: {
          container: 'my-swal'
        }
      })
      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      setLoading(false);
    })
  }

  // Star a file
  const starAFile = async (id, hash) => {
    setLoading(true);

    dstorage.methods.starAFile(id, hash).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'File added to Starred',
        confirmButtonText: 'Okay',
        icon: 'success',
        backdrop: false,
        customClass: {
          container: 'my-swal'
        }
      })
      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      setLoading(false);
    })
  }

  // Unstar a file
  const unstarAFile = async (id, hash) => {
    setLoading(true);

    dstorage.methods.unstarAFile(id, hash).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'File removed from Starred',
        confirmButtonText: 'Okay',
        icon: 'success',
        backdrop: false,
        customClass: {
          container: 'my-swal'
        }
      })
      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      setLoading(false);
    })
  }

  // Unstar a file
  const emptyTrash = async (fileIds) => {
    setLoading(true);

    dstorage.methods.emptyTrash(fileIds).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Emptied the Trash',
        confirmButtonText: 'Okay',
        icon: 'success',
        backdrop: false,
        customClass: {
          container: 'my-swal'
        }
      })
      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      setLoading(false);
    })
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
        if(!myDes){
          myDes = '';
        }
        
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
            setLoading(true);
          }
        })
      }
    })
  };

  useEffect(() => {
    const Load = async () => {
      await loadWeb3()
      await loadBlockchainData()
      setLoading(false);
    }
    setLoading(true);
    Load();
  }, [])

  useEffect(() => {
    loadBlockchainData();
  }, [loading, account])

  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
    {loading ? <Loading /> :
    <div className={classes.root}>
      <CssBaseline />
      
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
      
      <Sidebar 
        open={open}
        handleDrawerClose={handleDrawerClose} 
        account={account} 
        section={section} 
        setSection={setSection} 
        sizeUsed={sizeUsed}
      />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          <div>
            {section ? section === "My Drive" ?
              <MyDrive 
                recents={recentFiles} 
                files={files} 
                deleteFile={deleteFile} 
                star={starAFile}
                unstar={unstarAFile}
                sL={setLoading}
              />
              :
              <Others 
                name={section} 
                trashFiles={trashFiles}
                recents={recentFiles}
                starred={starredFiles}
                shared={sharedFiles}
                deleteFile={section === 'Trash' ? deleteFileForever : 
                deleteFile}
                star={starAFile}
                unstar={unstarAFile}
                sL={setLoading}
                emptyTrash={emptyTrash}
              />
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
    }
  </>
  );
}

export default App;