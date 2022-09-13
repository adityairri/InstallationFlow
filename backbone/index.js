const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {

  app.get("/assignDate/:orderID/:farmID/:date/:time/:remarks",
    async function (req, res) {
      var req = req.params;
      var farmID = req.farmID.split(",");
      var farmsApendObject = [];
      farmID.forEach(element => {
        farmsApendObject.push({
          "farm": parseInt(element)
        });
      });
      // console.log(req);
      var date = req.date + " 00:00";
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderID),
          confirmed_date: date,
          confirmed_slot: req.time,
          remarks: req.remarks,
          schedulestatus: "FARMER_DATE_CONFIRM",
        },
        farms:farmsApendObject
      });

      // console.log(reqBody);
      const resp = await fetch(
        "http://app.aquaexchange.com/api/updateInstallationSchedule/",
        {
          method: "post",
          body: reqBody,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
          },
        }
      );

      await resp.json().then((data) => {
        // console.log(data);
        res.redirect("/");
      });
      // console.log(reqBody);
    }
  );


  app.get("/assignFollowupDate/:id/:remarks/:followupDate",
  async function (req, res) {
    var req = req.params;
    // console.log(req);
    var date = req.followupDate;
    var reqBody = JSON.stringify({
      schedule: {
        id: parseInt(req.id),
        followup_date: date,
        remarks: req.remarks+' - '+date,
        schedulestatus: "NEW_ORDER",
      }
    });

    // console.log(reqBody);
    const resp = await fetch(
      "http://app.aquaexchange.com/api/updateInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
        },
      }
    );

    await resp.json().then((data) => {
      // console.log(data);
      res.redirect("/");
    });
    // console.log(reqBody);
  }
);


  app.get("/addRemarks/:id/:remarks",
    async function (req, res) {
      var req = req.params;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.id),
          remarks: req.remarks,
          schedulestatus: "NEW_ORDER",
        }
      });
      const resp = await fetch(
        "http://app.aquaexchange.com/api/updateInstallationSchedule/",
        {
          method: "post",
          body: reqBody,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token e50f000f342fe8453e714454abac13be07f18ac3",
          },
        }
      );

      await resp.json().then((data) => {
        // console.log(data);
        
        res.redirect("/");
      });
      // console.log(reqBody);
    }
  );


  var finalRenderData = [];
  var farmDetailsArray = [];
  app.get("/", async function (req, res) {
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
var daata = [];
    await resp.json().then(async (data) => {
      data.forEach(async singleInData => {
        var wooCommerseID = singleInData.order.woo_commerce_order_id;
        var a = await getRemarksList(wooCommerseID);
        // console.log(remarks);
        daata.push({
          'remarks': remarks,
          'data': singleInData
        })
      });
      // console.log(daata);
      await getSErescheduledOrders();
      await getSMrescheduledOrders();
      await getFarmerRescheduledOrders();

      await getReconfirmOrdersCount();
      await getReadyToInstallCount();
      await getAssignedToSECount();
      await getSePendingList();
      await getSeAcceptedList();
      await getSeDeclinedList();
      await getFarmerPendingList();
      await getFarmerAcceptedList();
      await getFarmerDeclinedList();
      await getInstallationPendingList();
      await getInstallationPartialCompleteList();
      await getInstallationCompletedList();
      res.render("index", {
        data1: daata,
        newOrdersCount: data.length,
        reconfirmOrdersCount: reconfirmOrdersCount.length,

        SErescheduledOrders: SErescheduledOrders,
        SMrescheduledOrders: SMrescheduledOrders,
        FarmerRescheduledOrders: FarmerRescheduledOrders,
        totalRescheduleCount: SErescheduledOrders.length+SMrescheduledOrders.length+FarmerRescheduledOrders.length,

        readyToInstallCount: readyToInstallCount.length,
        assignedToSECount: assignedToSECount1.length,
        sePendingList: sePendingList,
        seAcceptedList: seAcceptedList,
        seDeclinedList: seDeclinedList,
        farmerPendingList: farmerPendingList,
        farmerAcceptedList: farmerAcceptedList,
        farmerDeclinedList: farmerDeclinedList,
        installationPendingList: installationPendingList,
        installationPartialCompleteList: installationPartialCompleteList,
        installationCompletedList: installationCompletedList
      });
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



  var readyToInstallCount;
  async function getReadyToInstallCount(req, res) {
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_RECONFIRM",
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
      readyToInstallCount = dataa;
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
      // console.log(dataa);
      assignedToSECount1 = dataa;
    });
  }

  var sePendingList;
  async function getSePendingList(req, res) {
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"ASSIGNED_SE"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"SEND_FARMER_CONFIRM"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"CANCELLED_SE"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"SEND_FARMER_CONFIRM"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"FARMER_FINAl_CONFIRM"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"FARMER_FINAL_CANCEL"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"SE_ATTENDED"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"PARTIAL_COMPLETED"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"COMPLETED"
      }
      
  })
    const resp = await fetch(
      "http://app.aquaexchange.com/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token e50f000f342fe8453e714454abac13be07f18ac3",
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
