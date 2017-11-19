const express = require('express');
const path = require('path'); //built in node module
//path.join is a cleaner way to deal with moving around folders within your app
const publicPath = path.join(__dirname, '../public');

//process.env stores all of our environment variables
//heroku will change the port based on on the PORT env variable
const port = process.env.PORT || 3000; //if PORT doesn't exist, default to port 3000
//create new express app
var app = express()

//configure middleware to set up the directory for all our public files
app.use(express.static(publicPath));

//app.listen to port 3000
app.listen(port, () => console.log(`Server is up on port ${port}`));
