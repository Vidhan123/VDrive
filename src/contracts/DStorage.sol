pragma solidity ^0.5.0;

import "./EthSwap.sol";

contract DStorage {
  string public name = 'DStorage';
  EthSwap public ethSwap;

  address public deployer;

  uint public fileCount = 0;
  uint public trashCount = 0;
  uint public folderCount = 0;

  mapping(uint => File) public files;
  mapping(uint => Folder) public folders;

  mapping(uint => File) public trashFiles;

  mapping(address => uint) public totalSize;
  
  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
    string receivers;
    bool starred;
  }

  struct Folder {
    uint folderId;
    string name;      // name of node
    string data;    // list of node’s data(Files)
    address payable uploader;
    string receivers;
  }

  // struct Folder {
  //   bytes32 name;      // name of node
  //   bytes32 parent;    // parent node’s path
  //   uint[] data;    // list of node’s data(Files)
  //   bytes32[] folders; // list of linked folder's paths
  //  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    address payable uploader,
    string receivers,
    bool starred
  );

  constructor(EthSwap _token) public {
    ethSwap = _token;
    deployer = msg.sender;
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure file type exists
    require(bytes(_fileType).length > 0);
    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);
    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);

    // Increment file id
    fileCount ++; 

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender, '', false);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender, '', false);
  }

  function starAFile(uint fileId, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    files[fileId].starred = true;
  }

  function unstarAFile(uint fileId, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    files[fileId].starred = false;
  }

  function deleteFile(uint fileId, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    // Moving to trash
    trashCount++;
    files[fileId].fileId = trashCount;
    trashFiles[trashCount] = files[fileId];

    delete files[fileId];   
  }

  function restoreFile(uint fileId, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    // Moving to Drive
    fileCount++;
    trashFiles[fileId].fileId = fileCount;
    files[fileCount] = trashFiles[fileId];

    delete trashFiles[fileId];   
  }

  function deleteFileForever(uint fileId, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    delete trashFiles[fileId];   
  }

  function emptyTrash(uint[] memory fileIds) public {
    for(uint i=0;i<fileIds.length;i++) {
      delete trashFiles[fileIds[i]];
    }
    trashCount=0;
  }

  // Folders (Single hierarchy)
  function addFolder(string memory _name) public {
    folderCount++;
    folders[folderCount] = Folder(folderCount, _name, '', msg.sender, '');
  }

  function updateFiles(uint folderId, string memory _data) public {
    folders[folderId].data = _data;
  }

  function remove(uint folderId) public {
    // removes from folders
    delete folders[folderId]; 
  }

  /* Tree implementation for nested folders

  function get(bytes32 _name, bytes32 _parent) public view returns (bytes32, bytes32, uint[] memory, bytes32[] memory) {
    Folder storage folder = folders[keccak256(abi.encodePacked(_parent, _name))];
    return (folder.name, folder.parent, folder.data, folder.folders);
  }
    
  function addFolder(bytes32 _name, bytes32 _parent, uint[] memory _data) public {
    require(_name.length > 0);
    
    bytes32 path = keccak256(abi.encodePacked(_parent, _name));
    
    folders[path] = Folder({
      name: _name, 
      parent: _parent, 
      data: _data, 
      folders: new bytes32[](0),
      receivers: new address[](0)
    });
    folders[_parent].folders.push(path);
  }

  function updateFiles(bytes32 _name, bytes32 _parent, uint[] memory _data) public {
    require(_name.length > 0);
    
    bytes32 path = keccak256(abi.encodePacked(_parent, _name));
    
    Folder storage folder = folders[path];
    
    folder.data = _data;
  }

  // Can only remove leaves
  function remove(bytes32 _name, bytes32 _parent) public {
    bytes32 path = keccak256(abi.encodePacked(_parent, _name));
    // allow to remove leaves (folder without linked folders)
    require(folders[path].folders.length == 0);
    // removes from folders
    delete folders[path];
    
    // removes from parent list of folders
    bytes32[] storage childs = folders[_parent].folders;
    for (uint256 i = getIndex(childs, path); i < childs.length - 1; i++) {
      childs[i] = childs[i + 1];
    }
    delete childs[childs.length - 1];
    childs.length--;
  }

  function getIndex(bytes32[] memory childs, bytes32 _path) pure internal returns (uint256) {
    for (uint256 i = 0; i < childs.length; i++) {
      if (_path == childs[i]) {
        return i;
      }
    }
    return childs.length - 1;
  }

  */

  function shareAFile(uint fileId, string memory _fileHash, string memory _receivers) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);

    // Moving to Shared Files
    files[fileId].receivers = _receivers;
  }

  function shareAFolder(uint folderId, string memory _receivers) public { 
    // Moving to Shared Folders
    folders[folderId].receivers = _receivers;
  }

  function buyStorage(uint amt, uint tokenAmt) public {
    // Calling transfer fn
    ethSwap.transferTokensToContract(tokenAmt, msg.sender);

    // Increasing Storage
    totalSize[msg.sender] = totalSize[msg.sender] + amt;
  }

  function withdrawTokens(uint tokenAmt, address receiver) public {
    // Only deployer can call this 
    require(msg.sender == deployer);

    // Calling transfer fn
    ethSwap.transferTokensToAccount(tokenAmt, receiver);
  }
}