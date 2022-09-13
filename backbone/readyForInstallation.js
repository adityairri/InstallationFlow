const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {
  var dateUnassignedCount1;
  app.get("/readyForInstallation/:date", async function (req, res) {
    // console.log(req.params);
    var seDates;
    if (req.params.date == "0") {
      var fromDate = new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString("fr-CA");
      var toDate = fromDate;
      seDates = fromDate;
      var reqBody = JSON.stringify({
        filter: {
          status: "FARMER_RECONFIRM",
          from_date: fromDate,
          to_date: toDate,
        },
      });
    } else {
      var req = req.params;
      var fromDate = req.date + " 00:00";
      var toDate = fromDate;
      seDates = req.date;
      var reqBody = JSON.stringify({
        filter: {
          status: "FARMER_RECONFIRM",
          from_date: fromDate,
          to_date: toDate,
        },
      });
    }
    // var seDates = new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString("fr-CA");
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    var seListWithCount = [];
    resp.json().then(async (data) => {
      // console.log(data);
      await getDateUnassignedCount();
      await getSEList();
      await getSEassignedCount(seDates);
      SElist.forEach(eachSE => {
        if(SEassignedCount.find(o => o.service_engineer === eachSE.id)){
          seListWithCount.push({
            "id": eachSE.id,
            "first_name": eachSE.first_name,
            "assignedCount": SEassignedCount.find(o => o.service_engineer === eachSE.id).total
          })
        }else{
          seListWithCount.push({
            "id": eachSE.id,
            "first_name": eachSE.first_name,
            "assignedCount": 0
          })
        }
      });
      await getAssignedToSECount();
      await getReconfirmOrdersCount();

      await getSErescheduledOrders();
      await getSMrescheduledOrders();
      await getFarmerRescheduledOrders();

      await getSePendingList();
      await getSeAcceptedList();
      await getSeDeclinedList();
      await getFarmerPendingList();
      await getFarmerAcceptedList();
      await getFarmerDeclinedList();
      await getInstallationPendingList();
      await getInstallationPartialCompleteList();
      await getInstallationCompletedList();
      res.render("readyForInstallation", {
        data1: data,
        date: fromDate,
        dateConfirmedOrdersCount: data.length,
        dateUnassignedCount: dateUnassignedCount1.length,
        reconfirmOrdersCount: reconfirmOrdersCount,
       
        SErescheduledOrders: SErescheduledOrders,
        SMrescheduledOrders: SMrescheduledOrders,
        FarmerRescheduledOrders: FarmerRescheduledOrders,
        totalRescheduleCount: SErescheduledOrders.length+SMrescheduledOrders.length+FarmerRescheduledOrders.length,

        assignedToSECount: assignedToSECount1.length,
        // seList: SElist,
        seList: seListWithCount,
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
  });

  async function getDateUnassignedCount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "NEW_ORDER",
      },
    });
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      dateUnassignedCount1 = dataa;
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      // console.log(dataa);
      reconfirmOrdersCount = dataa;
    });
  }

  var SErescheduledOrders;
  async function getSErescheduledOrders(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "CANCELLED_SE_RESCHEDULE",
      },
    });
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
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


  var SElist;
  async function getSEList(req, res) {
    const resp = await fetch(
      "http://app.aquaexchange.com/api/general/serviceengineers/",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      SElist = dataa;
    });
  }

  var SEassignedCount;
  async function getSEassignedCount(req, res) {
    var date = req;
    var reqBody = JSON.stringify({
      date: date
    });
    const resp = await fetch(
      "http://app.aquaexchange.com/api/assignedorderforse/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
// console.log(dataa);
SEassignedCount = dataa;
      
    }).catch(error => {
      SEassignedCount = [];
    });
    
  }
  var assignedToSECount1;
  async function getAssignedToSECount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "ASSIGNED_SE",
      },
    });
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      assignedToSECount1 = dataa;
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
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
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      installationCompletedList = dataa;
    });
  }

  var remarks = [];
  async function getRemarksList(req, res) {
    var req = req;
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getremarksfororder/"+req+"",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );
    await resp.json().then((dataa) => {
    
      remarks = dataa;
    });
  }
};
