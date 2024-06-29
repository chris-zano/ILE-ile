const date = new Date();

const month = String(date.getMonth() + 1).padStart(2, '0'); //get the actual month not starting from 0
const year = String(date.getFullYear()).slice(2);
const day = String(date.getDate()).padStart(2, '0');
const hour = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2,'0');
const seconds = String(date.getSeconds()).padStart(2, '0');

console.log(`AD-${month}${day}${year}${hour}${minutes}${seconds}`);