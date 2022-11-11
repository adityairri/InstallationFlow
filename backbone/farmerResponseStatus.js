const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get(
    "/assignRescheduleDateFromFarmerRespPage/:orderID/:date/:time",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var date = req.date + " 00:00";
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderID),
          confirmed_date: date,
          confirmed_slot: req.time,
          remarks: "Assigned Rescheduled Date (Rescheduled -> Reconfirm)",
          schedulestatus: "FARMER_DATE_CONFIRM",
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
        res.redirect("/viewFarmerStatus/cancelled/1/0/0/0/0/0");
      });
      // console.log(reqBody);
    }
  );

  app.get(
    "/viewFarmerStatus/:status/:pageNo/:date/:searchByOrderID/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      await getSEList();
      if (req.params.status == "pending") {
        var variables = {
          tableTitle: "PENDING",
          navBarHighlight1: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight2: "",
          navBarHighlight3: "",
        };

        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "SEND_FARMER_CONFIRM",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "SEND_FARMER_CONFIRM",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                service_engineer: req.params.urlSEname,
              },
            });
          }
        }
      }
      if (req.params.status == "accepted") {
        var variables = {
          tableTitle: "ACCEPTED",
          navBarHighlight1: "",
          navBarHighlight2: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight3: "",
        };
        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_FINAl_CONFIRM",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "FARMER_FINAl_CONFIRM",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                service_engineer: req.params.urlSEname,
              },
            });
          }
        }
      }
      if (req.params.status == "cancelled") {
        var variables = {
          tableTitle: "DECLINED",
          navBarHighlight1: "",
          navBarHighlight2: "",
          navBarHighlight3: "background-color: #E9E9E9; color: #555555;",
        };
        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_FINAL_CANCEL",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "FARMER_FINAL_CANCEL",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                service_engineer: req.params.urlSEname,
              },
            });
          }
        }
      }

      const resp = await fetch(
        apiURL +
          "/getInstallationSchedule/?page=" +
          parseInt(req.params.pageNo) +
          "",
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
      resp.json().then(async (data) => {
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
                  var SEname;
                  new Promise(function (resolve, reject) {
                    SElist.forEach((element) => {
                      if (singleInData.service_engineer == element.id) {
                        SEname = element.first_name;
                      }
                    });
                  });

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

                  remarks = dataa;
                  daata.push({
                    remarks: remarks,
                    data: singleInData,
                    seName: SEname,
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

        await getAllStatusCount();
        await getAllStatusCount();
        await getDevicesList();
        await getSEList();
        await getBDEList();
        await getRegionsList();
        res.render("farmerResponseStatus", {
          dataPaginationNext: data.links.next,
          dataPaginationPrevious: data.links.previous,
          dataPaginationPageNo: data.page.page,
          dataPaginationTotalPages: data.page.pages,

          data1: daata,
          variables: variables,
          OpenOrdersCount: newOrdersCount,
          reconfirmOrdersCount: FarmerDateConfirm,

          totalRescheduleCount:
            CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,

          ReadyForInstallationCount: FarmerReconfirm,
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
          seList: SElist,

          totalAPFC: totalAPFC,
          totalPowermon: totalPowermon,
          totalPowermonAPFC: totalPowermonAPFC,
          installedAPFC: installedAPFC,
          installedPowermon: installedPowermon,
          installedPowermonAPFC: installedPowermonAPFC,
        });
      });
    }
  );

  app.get("/changeFarmerStatus/:id/:status", async function (req, res) {
    // console.log(req.params);
    if (req.params.status == "1") {
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.params.id),
          schedulestatus: "FARMER_FINAl_CONFIRM",
        },
      });
    }
    if (req.params.status == "2") {
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.params.id),
          schedulestatus: "FARMER_FINAL_CANCEL",
        },
      });
    }

    const resp = await fetch(apiURL + "/updateInstallationSchedule/", {
      method: "post",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    resp.json().then(async (data) => {
      // console.log(data);
      res.redirect("/viewFarmerStatus/pending/1/0/0/0/0/0");
    });
  });

  // -------------------------------------------- Counts Functions----------------------------------

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

  var SElist;
  async function getSEList(req, res) {
    const resp = await fetch(apiURL + "/general/serviceengineers/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    await resp.json().then((dataa) => {
      // console.log(dataa);
      SElist = dataa;
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      regionsList = dataa;

      //console.log(regionsList);
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
    await resp.json().then((dataa) => {
      // console.log(dataa);
      BDElist = dataa;

      //console.log(BDElist);
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


  app.get("/viewFarmerStatusExport/:status/:pageNo/:date/:searchByOrderID/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      if (req.params.status == "pending") {
        var variables = {
          tableTitle: "PENDING",
          navBarHighlight1: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight2: "",
          navBarHighlight3: "",
        };

        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "SEND_FARMER_CONFIRM",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "SEND_FARMER_CONFIRM",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                service_engineer: req.params.urlSEname,
              },
            });
          }
        }
      }
      if (req.params.status == "accepted") {
        var variables = {
          tableTitle: "ACCEPTED",
          navBarHighlight1: "",
          navBarHighlight2: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight3: "",
        };
        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_FINAl_CONFIRM",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "FARMER_FINAl_CONFIRM",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAl_CONFIRM",
                service_engineer: req.params.urlSEname,
              },
            });
          }
        }
      }
      if (req.params.status == "cancelled") {
        var variables = {
          tableTitle: "DECLINED",
          navBarHighlight1: "",
          navBarHighlight2: "",
          navBarHighlight3: "background-color: #E9E9E9; color: #555555;",
        };
        if (
          req.params.searchByOrderID == 0 &&
          req.params.date == 0 &&
          req.params.bdeName == 0 &&
          req.params.regionName == 0 &&
          req.params.urlSEname == 0
        ) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_FINAL_CANCEL",
            },
          });
        } else {
          if (req.params.searchByOrderID != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                order_id: parseInt(req.params.searchByOrderID),
                status: "FARMER_FINAL_CANCEL",
              },
            });
          }
          if (req.params.date != 0) {
            var page = req.params.pageNo;
            var fromDate = req.params.date + " 00:00";
            var toDate = fromDate;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                from_date: fromDate,
                to_date: toDate,
              },
            });
          }
          if (req.params.bdeName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                bde: req.params.bdeName,
              },
            });
          }
          if (req.params.regionName != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                region: req.params.regionName,
              },
            });
          }
          if (req.params.urlSEname != 0) {
            var page = req.params.pageNo;
            var reqBody = JSON.stringify({
              filter: {
                status: "FARMER_FINAL_CANCEL",
                service_engineer: req.params.urlSEname,
              },
            });
          }
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
          res.attachment("FarmerResponseStatus.csv");
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
};
