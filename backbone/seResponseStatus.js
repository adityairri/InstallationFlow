const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");

module.exports = function () {
  
  app.get("/addRemarks/:id/:remarks",
    async function (req, res) {
      var req = req.params;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.id),
          ccs_remarks: req.remarks,
          schedulestatus: "NEW_ORDER",
        }
      });
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

      await resp.json().then((data) => {
        // console.log(data);
        
        res.redirect("/");
      });
      // console.log(reqBody);
    }
  );



  async function getDateUnassignedCount(req, res) {
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
      dateUnassignedCount1 = dataa;
    });
  }

  var SElist;
  async function getSEList(req, res) {
    const resp = await fetch(
      "http://45.79.117.26:8000/api/general/serviceengineers/",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd",
        },
      }
    );
    await resp.json().then((dataa) => {
      console.log(dataa);
      SElist = dataa;
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
      assignedToSECount1 = dataa;
    });
  }
};
