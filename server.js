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
require('./backbone/reconfirm')();
require('./backbone/reschedule')();
require('./backbone/seResponseStatus')();
require('./backbone/readyForInstallation')();
require('./backbone/farmerResponseStatus')();
require('./backbone/installationStatus')();
// require('./backbone/myOrders')();


var index = require('./backbone/index');
app.use('/',index);
app.get('/assignDate/:orderID/:farmID/:date/:time/:remarks', index);
app.get('/addRemarks/:id/:remarks', index);
app.get('/assignFollowupDate/:id/:remarks/:followupDate', index);

var readyForInstallation = require('./backbone/readyForInstallation');
app.get('/readyForInstallation/:date', readyForInstallation);


var reconfirm = require('./backbone/reconfirm');
app.use('/reconfirm/:date',reconfirm);
app.use('/confirmFarmerReconfirmDate/:orderId',reconfirm);


var reschedule = require('./backbone/reschedule');
app.use('/rescheduled',reschedule);


var seResponseStatus = require('./backbone/seResponseStatus');
app.get('/assignSE/:orderID/:SEid', seResponseStatus);
app.get('/reschedule/:orderID', seResponseStatus);
app.get('/cancelledSEreschedule/:orderID', seResponseStatus);
app.get('/seResponseStatus/:SEid/:status', seResponseStatus);
app.get('/doActions/:orderID/:actionID', seResponseStatus);

var farmerResStatus = require('./backbone/farmerResponseStatus');
app.get('/viewFarmerStatus/:status', farmerResStatus);
app.get('/changeFarmerStatus/:id/:status', farmerResStatus);

var installationStatus = require('./backbone/installationStatus');
app.get('/viewInstallationStatus/:status', installationStatus);
/****************** Run Server ***************************************/
app.listen(process.env.PORT || 8080);
console.log('Server is listening on port 8080');
/****************** #END# Run Server *********************************/