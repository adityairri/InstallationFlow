const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {
  app.get("/rescheduled", async function (req, res) {
  
    await getNewOrdersCount();
    await getReconfirmOrdersCount();

    await getSErescheduledOrders();
    await getSMrescheduledOrders();
    await getFarmerRescheduledOrders();

    await getReadyToInstallCount();
    await getSePendingList();
    await getSeAcceptedList();
    await getSeDeclinedList();
    await getFarmerPendingList();
    await getFarmerAcceptedList();
    await getFarmerDeclinedList();
    await getInstallationPendingList();
    await getInstallationPartialCompleteList();
    await getInstallationCompletedList();
    res.render("reschedule", {
      
      newOrdersCount: newOrdersCount,
      reconfirmOrdersCount: reconfirmOrdersCount,

      SErescheduledOrders: SErescheduledOrders,
      SMrescheduledOrders: SMrescheduledOrders,
      FarmerRescheduledOrders: FarmerRescheduledOrders,
      totalRescheduleCount: SErescheduledOrders.length+SMrescheduledOrders.length+FarmerRescheduledOrders.length,

      readyToInstallCount: readyToInstallCount,
      sePendingList: sePendingList,
      seAcceptedList: seAcceptedList,
      seDeclinedList: seDeclinedList,
      farmerPendingList: farmerPendingList,
      farmerAcceptedList: farmerAcceptedList,
      farmerDeclinedList: farmerDeclinedList,
      installationPendingList: installationPendingList,
      installationPartialCompleteList: installationPartialCompleteList,
      installationCompletedList: installationCompletedList,
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
  async function getNewOrdersCount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "NEW_ORDER",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      newOrdersCount = dataa;
    });
  }

  var reconfirmOrdersCount;
  async function getReconfirmOrdersCount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_DATE_CONFIRM",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      reconfirmOrdersCount = dataa;
    });
  }

  var readyToInstallCount;
  async function getReadyToInstallCount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_RECONFIRM",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      readyToInstallCount = dataa;
    });
  }

  var sePendingList;
  async function getSePendingList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "ASSIGNED_SE",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      sePendingList = dataa;
    });
  }

  var seAcceptedList;
  async function getSeAcceptedList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "SEND_FARMER_CONFIRM",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      seAcceptedList = dataa;
    });
  }

  var seDeclinedList;
  async function getSeDeclinedList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "CANCELLED_SE",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      seDeclinedList = dataa;
    });
  }

  var farmerPendingList;
  async function getFarmerPendingList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "SEND_FARMER_CONFIRM",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      farmerPendingList = dataa;
    });
  }

  var farmerAcceptedList;
  async function getFarmerAcceptedList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_FINAl_CONFIRM",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      farmerAcceptedList = dataa;
    });
  }

  var farmerDeclinedList;
  async function getFarmerDeclinedList(req, res) {
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      farmerDeclinedList = dataa;
    });
  }

  var installationPendingList;
  async function getInstallationPendingList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "SE_ATTENDED",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      installationPendingList = dataa;
    });
  }

  var installationPartialCompleteList;
  async function getInstallationPartialCompleteList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "PARTIAL_COMPLETED",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      installationPartialCompleteList = dataa;
    });
  }

  var installationCompletedList;
  async function getInstallationCompletedList(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "COMPLETED",
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      installationCompletedList = dataa;
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
