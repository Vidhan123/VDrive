<h1 align="center">VDrive</h1>

<h4 align='center'> A Decentralized Cloud Storage Solution.</h4>

## File Structure

```
.
├── migrations/                -> Contains Migrations for Smart Contracts
├── src
|   ├── components/            -> Contains Frontend React pages
|   └── contracts/             -> Conatains Smart Contracts
├── test/                      -> Contains Chai and Mocha tests for Smart Contracts
├── package.json               -> Npm package.json file
└── truffle-config.js          -> Configuration file for truffle
```

## Technology Stack

- Solidity                (0.5.0+)
- Truffle                 (5.1.0+)
- Web3                    (1.3.0+)
- HTML5
- CSS3
- ReactJs                 (16.13+)
- Material-UI             (4.11.0+)
- ES6 JavaScript


## Features

- Upload Files
	- Add description
- View Files
  - View Details (name, description, file type, file size, upload date, etc)
- Create Folders
  - Add/Remove Files
- Download Files/Folders
  - Folders are downloaded as a zip file
- Share Files/Folders
- Delete Files/Folders
- Star/Unstar Files
- Restore Files
- Permanently delete Files
  - Empty Trash option to delete all the files in the trash
- Keep track of the storage used
- See recently uploaded files

## Screenshots

<!-- #### Homepage:

![Homepage](/screenshots/home.png)


#### Profile Page:

![Profile Page](/screenshots/profile1.png)

![Profile Page](/screenshots/profile2.png) -->


## Additional Notes

- If a user shares a file/folder to another user, any updates to the original file/folder will also reflect in the shared file/folder.

- If a folder contains a file which is deleted by the user, a prompt for updating folder will appear. On confirmation folder will be automatically updated.

- If a user(sender) tries to share the same file/folder to the same user(receiver) again, the user(sender) will be informed that he has already shared the file/folder with this us. So the user will not be charged for the transaction.