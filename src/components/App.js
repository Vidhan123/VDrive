import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import DStorage from '../abis/DStorage.json';
import Web3 from 'web3';
import { CssBaseline, Container, Fab, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MyDrive from './Sections/MyDrive/MyDrive';
import Others from './Sections/Others/Others';
import FolderPage from './Sections/FolderPage';
import SideIcons from './SideIcons';
import { convertBytestoMB, convertGBtoMB } from './helpers';
import { useStyles } from './styles';
import Swal from 'sweetalert2';
import Loading from './Loading/Loading';
import './App.css';
import Admin from './Sections/Admin';
import axios from 'axios';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App() {
  const [account, setAccount] = useState('');
  const [deployer, setDeployer] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [myTokenBalance, setMyTokenBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [starredFiles, setStarredFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [sharedFoldersData, setSharedFoldersData] = useState([]);
  const [token, setToken] = useState({});
  const [ethSwapData, setEthSwapData] = useState({});
  const [dstorage, setDstorage] = useState(null);
  const [totalSize, setTotalSize] = useState(10);
  const [sizeUsed, setSizeUsed] = useState(0);
  const [section, setSection] = useState('My Drive');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

      window.ethereum.on('accountsChanged', function () {
        loadBlockchainData()
      })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      window.ethereum.on('accountsChanged', function () {
        loadBlockchainData()
      })
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
    const ethSwapData = EthSwap.networks[networkId]
    const tokenData = Token.networks[networkId]
    if(networkData && accounts[0] && ethSwapData && tokenData) {
      // Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      setDstorage(dstorage);
      // Get files amount
      const NoOfFiles = await dstorage.methods.fileCount().call()
      const NoOfTrashFiles = await dstorage.methods.trashCount().call()
      // Get folders indexes
      const NoOfFolders = await dstorage.methods.folderCount().call()

      // Get totalSize
      const store = await dstorage.methods.totalSize(accounts[0]).call()
      setTotalSize(parseInt(store)+10);

      // Get deployers address
      const dep = await dstorage.methods.deployer().call()
      setDeployer(dep);

      if(ethSwapData) {
        setEthSwapData(ethSwapData);
        if(tokenData) {
          const token = new web3.eth.Contract(Token.abi, tokenData.address)
          setToken(token);
          let tokenBalance = await token.methods.balanceOf(ethSwapData.address).call()
          let myTokenBalance = await token.methods.balanceOf(accounts[0]).call()
          setTokenBalance(tokenBalance.toString());
          setMyTokenBalance(myTokenBalance.toString());
        } 
      }

      // Load files&sort by the newest
      let file;
      let myFiles=[], myRecentFiles=[], myTrashFiles=[], myStarredFiles=[];
      let sharedF = [], allF = [];
      let totalsize = 0, countRecent = 0;
      for(let i = NoOfFiles; i >= 1; i--) {
        file = await dstorage.methods.files(i).call()
        if(file && file.uploader === account) {
          if(file.starred) myStarredFiles.push(file);
          countRecent++;
          if(countRecent < 6) myRecentFiles.push(file);
          myFiles.push(file);
          totalsize += convertBytestoMB(file.fileSize);
        }
        if(file) {
          allF.push(file);
          let re = file.receivers;
          let k = re.indexOf(account);
          if(k !== -1) {
            sharedF.push(file);
          }
        }
      }
      for(let i = NoOfTrashFiles; i >= 1; i--) {
        file = await dstorage.methods.trashFiles(i).call()
        if(file && file.uploader === account) {
          myTrashFiles.push(file);
          totalsize += convertBytestoMB(file.fileSize);
        }
      }
      // Load folders&sort by the newest
      let folder;
      let myFolders = [], sharedFo = [], sharedFoData = [], allFo = [];
      for(let i = NoOfFolders; i >= 1; i--) {
        folder = await dstorage.methods.folders(i).call()
        if(folder && folder.uploader === account) {
          myFolders.push(folder);
        }
        if(folder) {
          allFo.push(folder);
          let re = folder.receivers;
          let k = re.indexOf(account);
          if(k !== -1) {
            let asd = folder.data;
            let qwe = asd.split('0Vidhan0');
            qwe.pop();
            for(let j=0;j<qwe.length;j++) {
              let z = allF.filter((file) => {
                return (file.fileId === qwe[j])
              })
              if(z[0]) sharedFoData.push(z[0]);
            } 
            sharedFo.push(folder);
          }
        }
      }
      setAllFiles(allF);
      setAllFolders(allFo);
      setSharedFiles(sharedF);
      setSharedFolders(sharedFo);
      setSharedFoldersData(sharedFoData);
      setFiles(myFiles);
      setRecentFiles(myRecentFiles);
      setStarredFiles(myStarredFiles);
      setTrashFiles(myTrashFiles);
      setFolders(myFolders)
      setSizeUsed(totalsize);
    }
  }

  const uploadFile = (myBuffer, file, myDes) => {
    
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

  // Deleting File(Move to trash)
  const restoreFile = async (id, hash) => {
    setLoading(true);

    dstorage.methods.restoreFile(id, hash).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'File Restored',
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

  // Empty Trash
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

  // Create a folder
  const createFolder = async (name) => {
    setLoading(true);
    dstorage.methods.addFolder(name).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Folder Created',
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

  // Update a folder
  const updateFiles = async (folderId, fileIds) => {
    setLoading(true);

    dstorage.methods.updateFiles(folderId, fileIds).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Folder Updated',
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

  // Delete a folder
  const deleteFolder = async (folderId) => {
    setLoading(true);

    dstorage.methods.remove(folderId).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Folder Deleted',
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

  // Share a file
  const shareAFile = async (id, hash, re, myRe) => {
    setLoading(true);

    dstorage.methods.shareAFile(id, hash, re).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        text: `File shared with ${myRe}`,
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

  // Share a folder
  const shareAFolder = async (id, re, myRe) => {
    setLoading(true);

    dstorage.methods.shareAFolder(id, re).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        text: `Folder shared with ${myRe}`,
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

  // Buy Storage
  const buyStorage = async (amt, tokenAmt) => {
    setLoading(true);

    token.methods.approve(ethSwapData.address, window.web3.utils.toWei(tokenAmt)).send({ from: account }).on('transactionHash', (hash) => {
      dstorage.methods.buyStorage(parseInt(amt), window.web3.utils.toWei(tokenAmt)).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
        Swal.fire({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: `Storage Purchased`,
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

  // Transfer Tokens
  const withdrawTokens = async (amt, receiver) => {
    setLoading(true);

    dstorage.methods.withdrawTokens(window.web3.utils.toWei(amt), receiver).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: `Tokens Transfered`,
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

  useEffect(() => {
    const Load = async () => {
      await loadWeb3()
      await loadBlockchainData()
      const resp = await axios.get("https://newsapi.org/v2/top-headlines?language=en&apiKey=dfcf5210cd9548c58bb38b49794fe05f");
      console.log(resp.data.articles);
      setLoading(false);
    }
    setLoading(true);
    Load();
  }, [])

  useEffect(() => {
    loadBlockchainData();
  }, [account])

  useEffect(() => {
    if(loading === false) loadBlockchainData();
  }, [loading])

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
    <Router>
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
        totalSize={totalSize}
        myTokenBalance={myTokenBalance}
        buyStorage={buyStorage}
      />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          
          <Switch>
            <Route path="/Folders/:folderName">
              <FolderPage 
                files={section === 'Shared with me' ? sharedFoldersData : files} 
                myFiles={allFiles}
                folders={section === 'Shared with me' ? sharedFolders : folders}
                updateFiles={updateFiles}
                deleteFolder={deleteFolder} 
                shareAFile={shareAFile}
                shareAFolder={shareAFolder}
                star={starAFile}
                unstar={unstarAFile}
                deleteFile={deleteFile}
                sL={setLoading}
                account={account}
                restoreFile={restoreFile}
                section={section}
              />
            </Route>
            {
              deployer === account &&
              <Route path="/admin">
                <Admin 
                  deployer={deployer} 
                  account={account} 
                  tokenBalance={tokenBalance} 
                  withdrawTokens={withdrawTokens}
                />
              </Route>
            }
            <Route exact  path="/">
              <div>
                {section ? section === "My Drive" ?
                  <MyDrive
                    recents={recentFiles} 
                    files={files}
                    folders={folders}
                    createFolder={createFolder}
                    deleteFile={deleteFile} 
                    star={starAFile}
                    unstar={unstarAFile}
                    sL={setLoading}
                    shareAFile={shareAFile}
                    restoreFile={restoreFile}
                    section={section}
                  />
                  :
                  <Others 
                    name={section} 
                    trashFiles={trashFiles}
                    recents={recentFiles}
                    starred={starredFiles}
                    shared={sharedFiles}
                    sharedF={sharedFolders}
                    deleteFile={section === 'Trash' ? deleteFileForever : 
                    deleteFile}
                    star={starAFile}
                    unstar={unstarAFile}
                    sL={setLoading}
                    emptyTrash={emptyTrash}
                    shareAFile={shareAFile}
                    restoreFile={restoreFile}
                    section={section}
                  />
                : <div></div>}
              </div>
              <Tooltip title="Upload File" aria-label="add">
                <Fab color="secondary" className={classes.absolute} style={{outline: 'none', border: 'none'}} onClick={handleOpenFileUpload} disabled={sizeUsed >= convertGBtoMB(totalSize)}>
                  <Add />
                </Fab>
              </Tooltip>
            </Route>
          </Switch>  

        </Container>
      </main>

      <SideIcons deployer={deployer} account={account} />
    </div>
    }
    </Router>
  </>
  );
}

export default App;