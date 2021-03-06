import React from 'react';
import '../App.css';

import FileCard from './FileCard';

function FilesView(props) {
  
  const { star, unstar, deleteFile, sL, files, shareAFile, restoreFile, section } = props;

  return (
    <>
      {
        files.map((item, index) => (
          <FileCard 
            key={index} 
            file={item} 
            deleteFile={deleteFile} 
            star={star}
            unstar={unstar}
            sL={sL}
            shareAFile={shareAFile}
            restoreFile={restoreFile}
            section={section}
          />
        ))
      }
    </>
  )
}

export default FilesView;