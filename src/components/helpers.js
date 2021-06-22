export function convertBytes(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const myColor = "#3f51b5";

export const tempFiles = [
   {fileDescription: "file 1"},
   {fileDescription: "file 2"},
   {fileDescription: "file 3"},
   {fileDescription: "file 4"},
   {fileDescription: "file 5"},
   {fileDescription: "file 6"},
   {fileDescription: "file 7"},
   {fileDescription: "file 8"},
   {fileDescription: "file 9"}
]

export const tempFiles2 = [
   {fileDescription: "file 1"},
   {fileDescription: "file 2"},
   {fileDescription: "file 3"},
   {fileDescription: "file 4"},
]

export const tempFolders = [
   {name: "folder 1"},
   {name: "folder 2"},
   {name: "folder 3"},
   {name: "folder 4"},
]