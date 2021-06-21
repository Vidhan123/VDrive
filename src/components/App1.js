import DStorage from '../abis/DStorage.json';
import React, { useState, useEffect } from 'react';
import Main from './Main';
import Web3 from 'web3';
import './App.css';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App1() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [dstorage, setDstorage] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [buffer, setBuffer] = useState(null);

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
      for (var i = NoOfFiles; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        setFiles([...files, file]);
      }
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  // Get file from user
  const captureFile = (event) => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      setType(file.type);
      setName(file.name);
      console.log('buffer', Buffer(reader.result))
    }
  }

  const uploadFile = (description) => {
    console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return;
      }

      setLoading(true);
      // Assign value for the file without extension
      if(type === ''){
        setType('none');
      }
      dstorage.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
        setType(null);
        setName(null);
        window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        setLoading(false);
      })
    })
  }

  useEffect(() => {
    const Load = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    Load();
  }, [])

  return (
    <div>
      {loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
            files={files}
            captureFile={captureFile}
            uploadFile={uploadFile}
          />
      }
    </div>
  );
}

export default App1;