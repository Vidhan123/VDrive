import React, { useState, useEffect } from 'react';
import '../App.css';

import FileCard from './FileCard';

function FilesView(props) {
  
  return (
    <>
      {
        props.files.map((item, index) => (
          <FileCard key={index} file={item} deleteFile={props.deleteFile} />
        ))
      }
    </>
  )
}

export default FilesView;