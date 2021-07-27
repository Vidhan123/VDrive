export function convertBytes(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function convertBytestoMB(bytes) {
   if (bytes === 0) return 0;
   return Math.round(bytes / Math.pow(1024, 2), 2);
}

export function convertGBtoMB(bytes) {
   if (bytes === 0) return 0;
   return (bytes * 1024);
}

export const myColor = "#3f51b5";