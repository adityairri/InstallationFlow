'use strict';
/****************** dependencies *************************************/
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var http = require('http');
var path = require('path');
// var Calendar = require('@toast-ui/calendar');
// require('@toast-ui/calendar/dist/toastui-calendar.min.css');
/****************** #END# dependencies *******************************/


/****************************global Requirements *********************/
global.app = express();

/************************* #END# global Requirements *****************/

/********************************Set the view engine******************/
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
/************************* #END# Set the view engine******************/

require('./backbone/index')();
require('./backbone/readyForInstallation')();
require('./backbone/assignDate')();
require('./backbone/farmerResponseStatus')();
require('./backbone/installationStatus')();
// require('./backbone/myOrders')();


var index = require('./backbone/index');
app.use('/',index);
app.get('/assignDate/:orderID/:farmID/:date/:time/:remarks', index);
app.get('/addRemarks/:id/:remarks', index);
var assignDate = require('./backbone/assignDate');
app.get('/listOfDatesConfirmedOrders/:date', assignDate);


var readyForInstallation = require('./backbone/readyForInstallation');
app.get('/assignSE/:orderID/:SEid', readyForInstallation);
app.get('/reschedule/:orderID', readyForInstallation);
app.get('/cancelledSEreschedule/:orderID', readyForInstallation);
app.get('/viewAssignedToSEOrders/:SEid/:status', readyForInstallation);
app.get('/doActions/:orderID/:actionID', readyForInstallation);

var farmerResStatus = require('./backbone/farmerResponseStatus');
app.get('/viewFarmerStatus/:status', farmerResStatus);
app.get('/changeFarmerStatus/:id/:status', farmerResStatus);

var installationStatus = require('./backbone/installationStatus');
app.get('/viewInstallationStatus/:status', installationStatus);
/****************** Run Server ***************************************/
app.listen(process.env.PORT || 8080);
console.log('Server is listening on port 8080');
/****************** #END# Run Server *********************************/