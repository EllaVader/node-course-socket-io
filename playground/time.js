//https://momentjs.com
const moment = require('moment');
//Jan 1st 1970 00:00:00 am UTC - this is the unix epic timestamp where time is relative to this
//time is represented in miliseconds -- 1000ms == 1 sec

//new Date.getTime()
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

var createdAt = new Date();
// console.log(date.getMonth());

var someTimestamp = moment().valueOf();
console.log(someTimestamp);
var date = moment(someTimestamp);
console.log(date.format('MMM D YYYY h:mm a'));
