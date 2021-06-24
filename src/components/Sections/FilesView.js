import React from 'react';
import '../App.css';

import FileCard from './FileCard';

function FilesView(props) {
  
  const { star, unstar, deleteFile, sL } = props;

  return (
    <>
      {
        props.files.map((item, index) => (
          <FileCard 
            key={index} 
            file={item} 
            deleteFile={deleteFile} 
            star={star}
            unstar={unstar}
            sL={sL}
          />
        ))
      }
    </>
  )
}

export default FilesView;