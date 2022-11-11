const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
var Parser = require("json2csv");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get(
    "/assignDate/:orderID/:farmID/:date/:time/:remarks/:fromDate/:toDate/:pageNo/:urlBdeName/:searchByOrderID/:urlRegionName/:urlSEname",
    async function (req, res) {
      var req = req.params;

      if (req.farmID != 0) {
        var farmID = req.farmID.split(",");
        var farmsApendObject = [];
        farmID.forEach((element) => {
          farmsApendObject.push({
            farm: parseInt(element),
          });
        });
        // console.log(req);
        var date = req.date + " 00:00";
        var reqBody = JSON.stringify({
          schedule: {
            id: parseInt(req.orderID),
            confirmed_date: date,
            confirmed_slot: req.time,
            remarks: req.remarks + "(Open Orders -> Reconfirmed)",
            schedulestatus: "FARMER_DATE_CONFIRM",
          },
          farms: farmsApendObject,
        });
      } else if (req.farmID == 0) {
        var date = req.date + " 00:00";
        var reqBody = JSON.stringify({
          schedule: {
            id: parseInt(req.orderID),
            confirmed_date: date,
            confirmed_slot: req.time,
            remarks: req.remarks + "(Open Orders -> Reconfirmed)",
            schedulestatus: "FARMER_DATE_CONFIRM",
          },
        });
      }

      // console.log(reqBody);
      const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      await resp
        .json()
        .then((data) => {
          console.log("SUCCESS [Open Orders] - Date Assigned");
          res.redirect(
            "/page/" +
              req.fromDate +
              "/" +
              req.toDate +
              "/" +
              req.pageNo +
              "/" +
              req.searchByOrderID +
              "/" +
              req.urlBdeName +
              "/" +
              req.urlRegionName +
              "/" +
              req.urlSEname
          );
        })
        .catch((err) => {
          console.log("ERROR [Open Orders] - " + err);
        });
    }
  );

  app.get(
    "/assignFollowupDate/:id/:remarks/:followupDate",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var date = req.followupDate;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.id),
          followup_date: date,
          remarks: req.remarks + " - " + date,
          schedulestatus: "NEW_ORDER",
        },
      });

      // console.log(reqBody);
      const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      await resp
        .json()
        .then((data) => {
          console.log("SUCCESS [Open Orders] - Assigned Followup Date");
          res.redirect("/");
        })
        .catch((err) => {
          console.log("ERROR [Open Orders] - " + err);
        });
    }
  );

  app.get(
    "/markAsComplete/:orderID/:SEName/:dateOfCompletion/:fromDate/:toDate/:pageNo/:farmID/:urlBdeName/:searchByOrderID/:urlRegionName/:urlSEname",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var orderID = req.orderID;
      if (req.farmID != 0) {
        var farmID = req.farmID.split(",");
        var farmsApendObject = [];
        farmID.forEach((element) => {
          farmsApendObject.push({
            farm: parseInt(element),
          });
        });
        var reqBody = JSON.stringify({
          schedule: {
            id: parseInt(orderID),
            remarks: "(Open Orders -> Completed)",
            service_engineer: req.SEName,
            schedulestatus: "COMPLETED",
          },
          farms: farmsApendObject,
        });
      } else {
        var reqBody = JSON.stringify({
          schedule: {
            id: parseInt(orderID),
            remarks: "(Open Orders -> Completed)",
            service_engineer: req.SEName,
            schedulestatus: "COMPLETED",
          },
        });
      }

      // console.log(reqBody);
      const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      await resp
        .json()
        .then((data) => {
          console.log("SUCCESS [Open Orders] - Marked as Complete");
          res.redirect(
            "/page/" +
              req.fromDate +
              "/" +
              req.toDate +
              "/" +
              req.pageNo +
              "/" +
              req.searchByOrderID +
              "/" +
              req.urlBdeName +
              "/" +
              req.urlRegionName +
              "/" +
              req.urlSEname
          );
        })
        .catch((err) => {
          console.log("ERROR [Open Orders] - " + err);
        });
    }
  );

  app.get(
    "/markAsCompleteInSearch/:orderID/:wooComID/:SEName/:dateOfCompletion",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var orderID = req.orderID;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(orderID),
          remarks: "(Searched Orders -> Completed)",
          service_engineer: req.SEName,
          schedulestatus: "COMPLETED",
        },
      });

      // console.log(reqBody);
      const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      await resp.json().then((data) => {
        // console.log(data);
        res.redirect("/searchByOrderID/" + parseInt(req.wooComID));
      });
      // console.log(reqBody);
    }
  );

  app.get(
    "/cancelOrder/:orderID/:fromDate/:toDate/:pageNo/:urlBdeName/:searchByOrderID/:urlRegionName/:urlSEname",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var orderID = req.orderID;
      var reqBody = JSON.stringify({
        order_id: parseInt(orderID),
        remarks: "(Open Orders -> Cancel Order)",
      });

      // console.log(reqBody);
      const resp = await fetch(apiURL + "/cancelorder/", {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      await resp
        .json()
        .then((data) => {
          console.log(
            "SUCCESS [Open Orders] - Order " + orderID + " has been cancelled!"
          );
          res.redirect(
            "/page/" +
              req.fromDate +
              "/" +
              req.toDate +
              "/" +
              req.pageNo +
              "/" +
              req.searchByOrderID +
              "/" +
              req.urlBdeName +
              "/" +
              req.urlRegionName +
              "/" +
              req.urlSEname
          );
        })
        .catch((err) => {
          console.log("ERROR [Open Orders] - Cancel Order:" + err);
        });
    }
  );

  app.get("/cancelOrderFromSearch/:orderID", async function (req, res) {
    var req = req.params;
    // console.log(req);
    var orderID = req.orderID;
    var reqBody = JSON.stringify({
      order_id: parseInt(orderID),
      remarks: "(Open Orders -> Cancel Order)",
    });

    // console.log(reqBody);
    const resp = await fetch(apiURL + "/cancelorder/", {
      method: "post",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    await resp.json().then((data) => {
      // console.log(data);
      res.redirect("/searchByOrderID/" + parseInt(req.orderID));
    });
    // console.log(reqBody);
  });

  app.get("/addRemarks/:id/:remarks", async function (req, res) {
    var req = req.params;
    var reqBody = JSON.stringify({
      schedule: {
        id: parseInt(req.id),
        remarks: req.remarks,
        schedulestatus: "NEW_ORDER",
      },
    });
    const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
      method: "post",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    await resp.json().then((data) => {
      // console.log(data);

      res.redirect("/");
    });
    // console.log(reqBody);
  });

  app.get("/", async function (req, res) {
    res.redirect("/page/0/0/1/0/0/0/0");
  });

  app.get(
    "/page/:fromDate/:toDate/:pageNo/:searchByOrderID/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      if (
        req.params.searchByOrderID == 0 &&
        req.params.fromDate == 0 &&
        req.params.toDate == 0 &&
        req.params.bdeName == 0 &&
        req.params.regionName == 0 &&
        req.params.urlSEname == 0
      ) {
        var reqBody = JSON.stringify({
          filter: {
            status: "NEW_ORDER",
          },
        });
      } else {
        if (req.params.searchByOrderID != 0) {
          var reqBody = JSON.stringify({
            filter: {
              order_id: parseInt(req.params.searchByOrderID),
              status: "NEW_ORDER",
            },
          });
        }
        if (req.params.fromDate != 0 && req.params.toDate != 0) {
          var reqBody = JSON.stringify({
            filter: {
              from_date: req.params.fromDate + " 00:00",
              to_date: req.params.toDate + " 23:59",
              status: "NEW_ORDER",
            },
          });
        }
        if (req.params.bdeName != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              bde: req.params.bdeName,
            },
          });
        }
        if (req.params.regionName != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              region: req.params.regionName,
            },
          });
        }
        if (req.params.urlSEname != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              service_engineer: req.params.urlSEname,
            },
          });
        }
      }

      // if (req.params.searchByOrderID == 0) {
      //   if (req.params.fromDate == 0 || req.params.toDate == 0) {
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         status: "NEW_ORDER",
      //       },
      //     });
      //   } else if (req.params.fromDate != null && req.params.toDate != null) {
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         from_date: req.params.fromDate + " 00:00",
      //         to_date: req.params.toDate + " 23:59",
      //         status: "NEW_ORDER",
      //       },
      //     });
      //   }
      // } else if (req.params.searchByOrderID != 0) {
      //   var reqBody = JSON.stringify({
      //     filter: {
      //       order_id: parseInt(req.params.searchByOrderID),
      //       status: "NEW_ORDER",
      //     },
      //   });
      // }
      // if (req.params.bdeName != 0) {
      //   if (req.params.fromDate == 0 || req.params.toDate == 0) {
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         status: "NEW_ORDER",
      //         bde: req.params.bdeName,
      //       },
      //     });
      //   } else if (req.params.fromDate != null && req.params.toDate != null) {
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         from_date: req.params.fromDate + " 00:00",
      //         to_date: req.params.toDate + " 23:59",
      //         status: "NEW_ORDER",
      //         bde: req.params.bdeName,
      //       },
      //     });
      //   }
      // }

      const resp = await fetch(
        apiURL + "/getInstallationSchedule/?page=" + req.params.pageNo + "",
        {
          method: "post",
          body: reqBody,
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      var daata = [];
      await resp.json().then(async (data) => {
        if (data.msg != "Invalid page.") {
          data.results.forEach(async (singleInData) => {
            var wooCommerseID = singleInData.order.woo_commerce_order_id;

            new Promise(function (resolve, reject) {
              fetch(apiURL + "/getremarksfororder/" + wooCommerseID + "", {
                method: "get",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }).then((resp) => {
                resp.json().then((dataa) => {
                  remarks = dataa;

                  var powermonInstalled = 0;
                  var powermonNotInstalled = 0;
                  var apfcInstalled = 0;
                  var apfcNotInstalled = 0;
                  var PowermonApfcInstalled = 0;
                  var PowermonApfcNotInstalled = 0;
                  singleInData.order.items.forEach((element) => {
                    if (element.name == "Powermon 2.0") {
                      if (element.isInstalled == true) {
                        powermonInstalled = powermonInstalled + 1;
                      }
                      if (element.isInstalled == false) {
                        powermonNotInstalled = powermonNotInstalled + 1;
                      }
                    } else if (
                      element.name == "APFC - Automatic power factor Controller"
                    ) {
                      if (element.isInstalled == true) {
                        apfcInstalled = apfcInstalled + 1;
                      }
                      if (element.isInstalled == false) {
                        apfcNotInstalled = apfcNotInstalled + 1;
                      }
                    } else if (element.name == "Powermon 2.0 with APFC") {
                      if (element.isInstalled == true) {
                        PowermonApfcInstalled = PowermonApfcInstalled + 1;
                      }
                      if (element.isInstalled == false) {
                        PowermonApfcNotInstalled = PowermonApfcNotInstalled + 1;
                      }
                    }
                  });

                  daata.push({
                    remarks: remarks,
                    data: singleInData,
                    powermonItems:
                      "Powermon - " +
                      (powermonInstalled + powermonNotInstalled) +
                      " - " +
                      powermonInstalled,
                    apfcItems:
                      "APFC - " +
                      (apfcInstalled + apfcNotInstalled) +
                      " - " +
                      apfcInstalled,
                    powermonApfcItems:
                      "Powermon(APFC) - " +
                      (PowermonApfcInstalled + PowermonApfcNotInstalled) +
                      " - " +
                      PowermonApfcInstalled,
                  });
                  resolve();
                });
              });
            });
          });
        } else if (data.msg == "Invalid page.") {
          data.links = {
            next: null,
            previous: null,
          };
          data.page = {
            page: 1,
            pages: 1,
            count: 0,
          };
        }
        if (orderIDdetails == undefined) {
          orderIDdetails = 0;
        }
        await getSEList();
        await getBDEList();
        await getRegionsList();
        await getAllStatusCount();
        await getAllStatusCount();
        await getDevicesList();

        res.render("index", {
          data1: daata,
          dataPaginationNext: data.links.next,
          dataPaginationPrevious: data.links.previous,
          dataPaginationPageNo: data.page.page,
          dataPaginationTotalPages: data.page.pages,

          orderIDdetails: orderIDdetails,

          seList: SElist,
          newOrdersCount: newOrdersCount,
          reconfirmOrdersCount: FarmerDateConfirm,
          readyToInstallCount: FarmerReconfirm,
          totalRescheduleCount:
            CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,
          sePendingList: AssignedSE,
          seAcceptedList: ConfirmedSE,
          seDeclinedList: CancelledSE,
          farmerPendingList: SendFarmerConfirmation,
          farmerAcceptedList: FarmerFinalConfirmation,
          farmerDeclinedList: FamerFinalCancelled,
          installationPendingList: SEAttended,
          installationPartialCompleteList: PartialCompleted,
          installationCompletedList: Completed,

          BDElist: BDElist,
          regionsList: regionsList,

          totalAPFC: totalAPFC,
          totalPowermon: totalPowermon,
          totalPowermonAPFC: totalPowermonAPFC,
          installedAPFC: installedAPFC,
          installedPowermon: installedPowermon,
          installedPowermonAPFC: installedPowermonAPFC,
        });
        console.log("SUCCESS [Open Orders] - Page Loaded");
      });
    }
  );

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
    const resp = await fetch(apiURL + "/getinstallStatuscount/", {
      method: "post",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp.json().then((data) => {
      if (
        data.some((singleData) => singleData.schedulestatus === "New Order")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "New Order") {
            newOrdersCount = element.total;
          }
        });
      } else {
        newOrdersCount = 0;
      }

      if (
        data.some(
          (singleData) => singleData.schedulestatus === "Farmer_Date_Confirm"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Farmer_Date_Confirm") {
            FarmerDateConfirm = element.total;
          }
        });
      } else {
        FarmerDateConfirm = 0;
      }

      if (
        data.some(
          (singleData) => singleData.schedulestatus === "Farmer_Reconfirm"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Farmer_Reconfirm") {
            FarmerReconfirm = element.total;
          }
        });
      } else {
        FarmerReconfirm = 0;
      }

      if (
        data.some(
          (singleData) =>
            singleData.schedulestatus === "Cancelled_SE_ReSchedule"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Cancelled_SE_ReSchedule") {
            CancelledSEReSchedule = element.total;
          }
        });
      } else {
        CancelledSEReSchedule = 0;
      }

      if (
        data.some((singleData) => singleData.schedulestatus === "SM_Reschedule")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "SM_Reschedule") {
            SMReschedule = element.total;
          }
        });
      } else {
        SMReschedule = 0;
      }

      if (
        data.some(
          (singleData) => singleData.schedulestatus === "Famer_Final_Cancelled"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Famer_Final_Cancelled") {
            FarmerCancelledReschedule = element.total;
          }
        });
      } else {
        FarmerCancelledReschedule = 0;
      }

      if (
        data.some((singleData) => singleData.schedulestatus === "Assigned_SE")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Assigned_SE") {
            AssignedSE = element.total;
          }
        });
      } else {
        AssignedSE = 0;
      }

      if (
        data.some(
          (singleData) =>
            singleData.schedulestatus === "Send_Farmer_Confirmation"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Send_Farmer_Confirmation") {
            ConfirmedSE = element.total;
          }
        });
      } else {
        ConfirmedSE = 0;
      }

      if (
        data.some((singleData) => singleData.schedulestatus === "Cancelled_SE")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Cancelled_SE") {
            CancelledSE = element.total;
          }
        });
      } else {
        CancelledSE = 0;
      }

      if (
        data.some(
          (singleData) =>
            singleData.schedulestatus === "Send_Farmer_Confirmation"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Send_Farmer_Confirmation") {
            SendFarmerConfirmation = element.total;
          }
        });
      } else {
        SendFarmerConfirmation = 0;
      }

      if (
        data.some(
          (singleData) =>
            singleData.schedulestatus === "Farmer_Final_Confirmation"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Farmer_Final_Confirmation") {
            FarmerFinalConfirmation = element.total;
          }
        });
      } else {
        FarmerFinalConfirmation = 0;
      }

      if (
        data.some(
          (singleData) => singleData.schedulestatus === "Famer_Final_Cancelled"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Famer_Final_Cancelled") {
            FamerFinalCancelled = element.total;
          }
        });
      } else {
        FamerFinalCancelled = 0;
      }

      if (
        data.some((singleData) => singleData.schedulestatus === "SE_Attended")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "SE_Attended") {
            SEAttended = element.total;
          }
        });
      } else {
        SEAttended = 0;
      }

      if (
        data.some(
          (singleData) => singleData.schedulestatus === "Partial Completed"
        )
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Partial Completed") {
            PartialCompleted = element.total;
          }
        });
      } else {
        PartialCompleted = 0;
      }

      if (
        data.some((singleData) => singleData.schedulestatus === "Completed")
      ) {
        data.forEach((element) => {
          if (element.schedulestatus === "Completed") {
            Completed = element.total;
          }
        });
      } else {
        Completed = 0;
      }
    });
  }

  var remarks = [];
  async function getRemarksList(req, res) {
    var req = req;
    const resp = await fetch(apiURL + "/getremarksfororder/" + req + "", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp.json().then((dataa) => {
      remarks = dataa;
    });
  }

  var orderIDdetails;
  app.get("/searchByOrderID/:orderID", async function (req, res) {
    var reqBody = JSON.stringify({
      filter: {
        order_id: parseInt(req.params.orderID),
      },
    });
    const resp = await fetch(apiURL + "/getInstallationSchedule/", {
      method: "post",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await getSEList();
    await resp.json().then((data) => {
      res.render("searchByOrderID", {
        data: data.results[0],
        seList: SElist,
      });
    });
  });

  var SElist;
  async function getSEList(req, res) {
    const resp = await fetch(apiURL + "/general/serviceengineers/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp
      .json()
      .then((dataa) => {
        console.log("SUCCESS [Open Orders] - Got SE List");
        SElist = dataa;
      })
      .catch((err) => {
        console.log("ERROR [Open Orders] - SE List:" + err);
      });
  }

  var BDElist;
  async function getBDEList(req, res) {
    const resp = await fetch(apiURL + "/general/bdes/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp
      .json()
      .then((dataa) => {
        console.log("SUCCESS [Open Orders] - Got BDE List");
        BDElist = dataa;
      })
      .catch((err) => {
        console.log("ERROR [Open Orders] - BDE List:" + err);
      });
  }

  var regionsList;
  async function getRegionsList(req, res) {
    const resp = await fetch(apiURL + "/general/regions/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp
      .json()
      .then((dataa) => {
        console.log("SUCCESS [Open Orders] - Got Regions List");
        regionsList = dataa;
      })
      .catch((err) => {
        console.log("ERROR [Open Orders] - Region List:" + err);
      });
  }

  app.get(
    "/openOrdersExport/:fromDate/:toDate/:pageNo/:searchByOrderID/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      if (
        req.params.searchByOrderID == 0 &&
        req.params.fromDate == 0 &&
        req.params.toDate == 0 &&
        req.params.bdeName == 0 &&
        req.params.regionName == 0 &&
        req.params.urlSEname == 0
      ) {
        var reqBody = JSON.stringify({
          filter: {
            status: "NEW_ORDER",
          },
        });
      } else {
        if (req.params.searchByOrderID != 0) {
          var reqBody = JSON.stringify({
            filter: {
              order_id: parseInt(req.params.searchByOrderID),
              status: "NEW_ORDER",
            },
          });
        }
        if (req.params.fromDate != 0 && req.params.toDate != 0) {
          var reqBody = JSON.stringify({
            filter: {
              from_date: req.params.fromDate + " 00:00",
              to_date: req.params.toDate + " 23:59",
              status: "NEW_ORDER",
            },
          });
        }
        if (req.params.bdeName != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              bde: req.params.bdeName,
            },
          });
        }
        if (req.params.regionName != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              region: req.params.regionName,
            },
          });
        }
        if (req.params.urlSEname != 0) {
          var reqBody = JSON.stringify({
            filter: {
              status: "NEW_ORDER",
              service_engineer: req.params.urlSEname,
            },
          });
        }
      }

      const resp = await fetch(
        apiURL + "/getInstallationSchedule/?export=csv",
        {
          method: "post",
          body: reqBody,
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      resp
        .text()
        .then((data) => {
          res.header("Content-Type", "text/csv");
          res.attachment("OpenOrders.csv");
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );

  var totalAPFC;
  var totalPowermon;
  var totalPowermonAPFC;
  var installedAPFC;
  var installedPowermon;
  var installedPowermonAPFC;
  async function getDevicesList(req, res) {
    totalAPFC = 0;
    totalPowermon = 0;
    totalPowermonAPFC = 0;
    installedAPFC = 0;
    installedPowermon = 0;
    installedPowermonAPFC = 0;
    const resp = await fetch(apiURL + "/devicequantity/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp
      .json()
      .then((dataa) => {
        dataa.total.forEach(async (eachData) => {
          if (eachData.name == "APFC - Automatic power factor Controller") {
            totalAPFC = eachData.total;
          } else if (eachData.name == "Powermon 2.0") {
            totalPowermon = eachData.total;
          } else if (eachData.name == "Powermon 2.0 with APFC") {
            totalPowermonAPFC = eachData.total;
          }
        });

        dataa.installed.forEach(async (eachData) => {
          if (eachData.name == "APFC - Automatic power factor Controller") {
            installedAPFC = eachData.total;
          } else if (eachData.name == "Powermon 2.0") {
            installedPowermon = eachData.total;
          } else if (eachData.name == "Powermon 2.0 with APFC") {
            installedPowermonAPFC = eachData.total;
          }
        });
      })
      .catch((err) => {
        console.log("ERROR [Open Orders] - Region List:" + err);
      });
  }
};
