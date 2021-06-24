pragma solidity ^0.5.0;

contract DStorage {
  string public name = 'DStorage';
  uint public fileCount = 0;
  uint public trashCount = 0;

  mapping(uint => File) public files;
  mapping(uint => File) public trashFiles;

  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
    bool starred;
  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    address payable uploader,
    bool starred
  );

  constructor() public {
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
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender, false);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender, false);
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
}