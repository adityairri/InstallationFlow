const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {
  app.get("/rescheduled", async function (req, res) {
  
    await getSErescheduledOrders();
    await getSMrescheduledOrders();
    await getFarmerRescheduledOrders();
    await getAllStatusCount();
    await getAllStatusCount();
    res.render("reschedule", {
      
      newOrdersCount: newOrdersCount,
      reconfirmOrdersCount: FarmerDateConfirm,

      SErescheduledOrders: SErescheduledOrders,
      SMrescheduledOrders: SMrescheduledOrders,
      FarmerRescheduledOrders: FarmerRescheduledOrders,
      totalRescheduleCount: CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,

      readyToInstallCount: FarmerReconfirm,
      sePendingList: AssignedSE,
      seAcceptedList: ConfirmedSE,
      seDeclinedList: CancelledSE,
      farmerPendingList: SendFarmerConfirmation,
      farmerAcceptedList: FarmerFinalConfirmation,
      farmerDeclinedList: FamerFinalCancelled,
      installationPendingList: SEAttended,
      installationPartialCompleteList: PartialCompleted,
      installationCompletedList: Completed,
    });
  });

  var SErescheduledOrders;
  async function getSErescheduledOrders(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "CANCELLED_SE_RESCHEDULE",
      },
    });
    const resp = await fetch(
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    var daata = [];
    await resp.json().then((data) => {
        data.forEach(async singleInData => {
            var wooCommerseID = singleInData.order.woo_commerce_order_id;
            var a = await getRemarksList(wooCommerseID);
            // console.log(remarks);
            daata.push({
              'remarks': remarks,
              'data': singleInData
            })
          });
      SErescheduledOrders = daata;
    });
  }

  var SMrescheduledOrders;
  async function getSMrescheduledOrders(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "SM_RESCHEDULE",
      },
    });
    const resp = await fetch(
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    var daata = [];
    await resp.json().then((data) => {
        data.forEach(async singleInData => {
            var wooCommerseID = singleInData.order.woo_commerce_order_id;
            var a = await getRemarksList(wooCommerseID);
            // console.log(remarks);
            daata.push({
              'remarks': remarks,
              'data': singleInData
            })
          });
      SMrescheduledOrders = daata;
    });
  }

  var FarmerRescheduledOrders;
  async function getFarmerRescheduledOrders(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_FINAL_CANCEL",
      },
    });
    const resp = await fetch(
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    var daata = [];
    await resp.json().then((data) => {
        data.forEach(async singleInData => {
            var wooCommerseID = singleInData.order.woo_commerce_order_id;
            var a = await getRemarksList(wooCommerseID);
            // console.log(remarks);
            daata.push({
              'remarks': remarks,
              'data': singleInData
            })
          });
      FarmerRescheduledOrders = daata;
    });
  }

  var newOrdersCount;
  var FarmerDateConfirm;
  var FarmerReconfirm;
  var CancelledSEReSchedule;
  var FarmerCancelledReschedule;
  var SMReschedule;
  var AssignedSE;
  var ConfirmedSE;
  var CancelledSE;
  var SendFarmerConfirmation;
  var FarmerFinalConfirmation;
  var FamerFinalCancelled;
  var SEAttended;
  var PartialCompleted;
  var Completed;
  async function getAllStatusCount(req, res) {
    var reqBody = JSON.stringify({});
    const resp = await fetch(
      "http://45.79.117.26:8000/api/getinstallStatuscount/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    await resp.json().then((data) => {

        if(data.some(singleData => singleData.schedulestatus === "New Order")){
          data.forEach(element => {
            if(element.schedulestatus==="New Order"){
              newOrdersCount = element.total;
            }
          });
        }else{
          newOrdersCount = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Date_Confirm")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Date_Confirm"){
              FarmerDateConfirm = element.total;
            }
          });
        }else{
          FarmerDateConfirm = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Reconfirm")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Reconfirm"){
              FarmerReconfirm = element.total;
            }
          });
        }else{
          FarmerReconfirm = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Cancelled_SE_ReSchedule")){
          data.forEach(element => {
            if(element.schedulestatus==="Cancelled_SE_ReSchedule"){
              CancelledSEReSchedule = element.total;
            }
          });
        }else{
          CancelledSEReSchedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "SM_Reschedule")){
          data.forEach(element => {
            if(element.schedulestatus==="SM_Reschedule"){
              SMReschedule = element.total;
            }
          });
        }else{
          SMReschedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Famer_Final_Cancelled")){
          data.forEach(element => {
            if(element.schedulestatus==="Famer_Final_Cancelled"){
              FarmerCancelledReschedule = element.total;
            }
          });
        }else{
          FarmerCancelledReschedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Assigned_SE")){
          data.forEach(element => {
            if(element.schedulestatus==="Assigned_SE"){
              AssignedSE = element.total;
            }
          });
        }else{
          AssignedSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Send_Farmer_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Send_Farmer_Confirmation"){
              ConfirmedSE = element.total;
            }
          });
        }else{
          ConfirmedSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Cancelled_SE")){
          data.forEach(element => {
            if(element.schedulestatus==="Cancelled_SE"){
              CancelledSE = element.total;
            }
          });
        }else{
          CancelledSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Send_Farmer_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Send_Farmer_Confirmation"){
              SendFarmerConfirmation = element.total;
            }
          });
        }else{
          SendFarmerConfirmation = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Final_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Final_Confirmation"){
              FarmerFinalConfirmation = element.total;
            }
          });
        }else{
          FarmerFinalConfirmation = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Famer_Final_Cancelled")){
          data.forEach(element => {
            if(element.schedulestatus==="Famer_Final_Cancelled"){
              FamerFinalCancelled = element.total;
            }
          });
        }else{
          FamerFinalCancelled = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "SE_Attended")){
          data.forEach(element => {
            if(element.schedulestatus==="SE_Attended"){
              SEAttended = element.total;
            }
          });
        }else{
          SEAttended = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Partial Completed")){
          data.forEach(element => {
            if(element.schedulestatus==="Partial Completed"){
              PartialCompleted = element.total;
            }
          });
        }else{
          PartialCompleted = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Completed")){
          data.forEach(element => {
            if(element.schedulestatus==="Completed"){
              Completed = element.total;
            }
          });
        }else{
          Completed = 0;
        }
    });
  }

  var remarks = [];
  async function getRemarksList(req, res) {
    var req = req;
    const resp = await fetch(
      "http://45.79.117.26:8000/api/getremarksfororder/" + req + "",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    await resp.json().then((dataa) => {
      remarks = dataa;
    });
  }
};
