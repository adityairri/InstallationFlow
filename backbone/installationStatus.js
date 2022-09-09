const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {
  app.get("/viewInstallationStatus/:status", async function (req, res) {
    console.log(req.params);
    if (req.params.status == "pending") {
      var reqBody = JSON.stringify({
        filter: {
          status: "SE_ATTENDED",
        },
      });
    }
    if (req.params.status == "partial") {
      var reqBody = JSON.stringify({
        filter: {
          status: "PARTIAL_COMPLETED",
        },
      });
    }
    if (req.params.status == "completed") {
      var reqBody = JSON.stringify({
        filter: {
          status: "COMPLETED",
        },
      });
    }

    const resp = await fetch(
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    resp.json().then(async (data) => {
      console.log(data);
      await getOpenOrdersCount();
      await getReadyForInstallationCount();
      await getSePendingList();
      await getSeAcceptedList();
      await getSeDeclinedList();
      await getFarmerPendingList();
      await getFarmerAcceptedList();
      await getFarmerDeclinedList();
      await getInstallationPendingList();
      await getInstallationPartialCompleteList();
      await getInstallationCompletedList();
      res.render("installationStatus", {
        data1: data,
        OpenOrdersCount: OpenOrdersCount.length,
        ReadyForInstallationCount: ReadyForInstallationCount.length,
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






  app.get("/changeFarmerStatus/:id/:status", async function (req, res) {
    console.log(req.params);
    if (req.params.status == "1") {
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.params.id),
          schedulestatus: "SEND_FARMER_CONFIRM",
        },
      });
    }
    if (req.params.status == "2") {
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.params.id),
          schedulestatus: "FARMER_FINAl_CONFIRM",
        },
      });
    }
    if (req.params.status == "3") {
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.params.id),
          schedulestatus: "FARMER_FINAL_CANCEL",
        },
      });
    }

    const resp = await fetch(
      "http://45.79.117.26:8000/api/updateInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    resp.json().then(async (data) => {
      console.log(data);
      res.redirect("/viewFarmerStatus/pending");
    });
  });

  // -------------------------------------------- Counts Functions----------------------------------
  var OpenOrdersCount;
  async function getOpenOrdersCount(req, res) {
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
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      OpenOrdersCount = dataa;
    });
  }

  var ReadyForInstallationCount;
  async function getReadyForInstallationCount(req, res) {
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
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      ReadyForInstallationCount = dataa;
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
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
      "http://45.79.117.26:8000/api/getInstallationSchedule/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
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
    var reqBody=JSON.stringify({
      "filter" :{
          "status" :"SE_ATTENDED"
      }
      
  })
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
      console.log(dataa);
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
      console.log(dataa);
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
      console.log(dataa);
      installationCompletedList = dataa;
    });
  }
};
