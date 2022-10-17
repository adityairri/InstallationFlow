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
app.use('/page/:fromDate/:toDate/:pageNo/:searchByOrderID',index);
app.get('/assignDate/:orderID/:farmID/:date/:time/:remarks/:fromDate/:toDate/:pageNo', index);
app.get('/addRemarks/:id/:remarks', index);
app.get('/assignFollowupDate/:id/:remarks/:followupDate', index);
app.use('/markAsComplete/:orderID/:SEName/:dateOfCompletion/:fromDate/:toDate/:pageNo',index);
app.use('/openSearchByOrderIdTotal/:searchByOrderID',index);
app.use('/markAsCompleteInSearch/:orderID/:wooComID/:SEName/:dateOfCompletion', index);

app.use('/searchByOrderID/:orderID',index);

var readyForInstallation = require('./backbone/readyForInstallation');
app.get('/readyForInstallation/:date/:pageNo/:searchByOrderID', readyForInstallation);
app.get('/assignSE/:orderID/:SEid', readyForInstallation);
app.get('/reschedule/:orderID', readyForInstallation);


var reconfirm = require('./backbone/reconfirm');
app.use('/reconfirm/:date/:pageNo/:searchByOrderID',reconfirm);
app.use('/confirmFarmerReconfirmDate/:orderId',reconfirm);
app.use('/farmerReschedule/:orderID',reconfirm);
app.use('/assignDateFromReconfirm/:orderID/:date/:time', reconfirm);


var reschedule = require('./backbone/reschedule');
app.use('/rescheduled/:pageNo',reschedule);
app.use('/assignRescheduleDate/:orderID/:date/:time', reschedule);


var seResponseStatus = require('./backbone/seResponseStatus');
app.get('/cancelledSEreschedule/:orderID', seResponseStatus);
app.get('/seResponseStatus/:SEid/:status/:pageNo/:searchByOrderID', seResponseStatus);
app.get('/doActions/:orderID/:actionID', seResponseStatus);

var farmerResStatus = require('./backbone/farmerResponseStatus');
app.get('/assignRescheduleDateFromFarmerRespPage/:orderID/:date/:time', farmerResStatus);
app.get('/viewFarmerStatus/:status/:pageNo/:searchByOrderID', farmerResStatus);
app.get('/changeFarmerStatus/:id/:status', farmerResStatus);

var installationStatus = require('./backbone/installationStatus');
app.get('/partialOrderReschedule/:orderID/:date/:time', installationStatus);
app.get('/viewInstallationStatus/:status/:pageNo/:orderID/:fromDate/:toDate', installationStatus);
/****************** Run Server ***************************************/
app.listen(process.env.PORT || 8081);
console.log('Server is listening on port 8081');
/****************** #END# Run Server *********************************/