const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get("/cancelledSEreschedule/:orderID", async function (req, res) {
    var req = req.params;
    var reqBody = JSON.stringify({
      schedule: {
        id: parseInt(req.orderID),
        schedulestatus: "CANCELLED_SE_RESCHEDULE",
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
      res.redirect("/seResponseStatus/0/declined/1/0");
    });
    // console.log(reqBody);
  });

  app.get(
    "/seResponseStatus/:SEid/:status/:pageNo/:searchByOrderID",
    async function (req, res) {
      // console.log(req.params);
      await getSEList();
      if (req.params.status == "pending") {
        var variables = {
          tableTitle: "PENDING",
          navBarHighlight1: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight2: "",
          navBarHighlight3: "",
        };

        if (req.params.searchByOrderID == "0") {
          if (req.params.SEid == "0") {
            var reqBody = JSON.stringify({
              filter: {
                status: "ASSIGNED_SE",
              },
            });
          } else {
            var reqBody = JSON.stringify({
              filter: {
                status: "ASSIGNED_SE",
                service_engineer: parseInt(req.params.SEid),
              },
            });
          }
        } else {
          var reqBody = JSON.stringify({
            filter: {
              status: "ASSIGNED_SE",
              order_id: parseInt(req.params.searchByOrderID),
            },
          });
        }
      }
      if (req.params.status == "accepted") {
        var variables = {
          tableTitle: "ACCEPTED",
          navBarHighlight1: "",
          navBarHighlight2: "background-color: #E9E9E9; color: #555555;",
          navBarHighlight3: "",
        };

        if (req.params.searchByOrderID == "0") {
          if (req.params.SEid == "0") {
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
              },
            });
          } else {
            var reqBody = JSON.stringify({
              filter: {
                status: "SEND_FARMER_CONFIRM",
                service_engineer: parseInt(req.params.SEid),
              },
            });
          }
        } else {
          var reqBody = JSON.stringify({
            filter: {
              status: "SEND_FARMER_CONFIRM",
              order_id: parseInt(req.params.searchByOrderID),
            },
          });
        }
      }
      if (req.params.status == "declined") {
        var variables = {
          tableTitle: "DECLINED",
          navBarHighlight1: "",
          navBarHighlight2: "",
          navBarHighlight3: "background-color: #E9E9E9; color: #555555;",
        };

        if (req.params.searchByOrderID == "0") {
          if (req.params.SEid == "0") {
            var reqBody = JSON.stringify({
              filter: {
                status: "CANCELLED_SE",
              },
            });
          } else {
            var reqBody = JSON.stringify({
              filter: {
                status: "CANCELLED_SE",
                service_engineer: parseInt(req.params.SEid),
              },
            });
          }
        } else {
          var reqBody = JSON.stringify({
            filter: {
              status: "CANCELLED_SE",
              order_id: parseInt(req.params.searchByOrderID),
            },
          });
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
                  remarks = dataa;
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
        // console.log(data);

        // await getSEList();
        await getAllStatusCount();
        await getAllStatusCount();
        res.render("seResponseStatus", {
          dataPaginationNext: data.links.next,
          dataPaginationPrevious: data.links.previous,
          dataPaginationPageNo: data.page.page,
          dataPaginationTotalPages: data.page.pages,

          data1: daata,
          variables: variables,
          dateUnassignedCount: newOrdersCount,
          reconfirmOrdersCount: FarmerDateConfirm,
          totalRescheduleCount:
            CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,
          dateAssignedCount: FarmerReconfirm,
          seList: SElist,

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

  app.get("/doActions/:orderID/:actionID", async function (req, res) {
    var actionID = req.params.actionID;
    var orderID = req.params.orderID;
    if (actionID == "1") {
      var reqBody = JSON.stringify({
        id: parseInt(orderID),
        schedulestatus: "SEND_FARMER_CONFIRM",
      });
    }
    if (actionID == "2") {
      var reqBody = JSON.stringify({
        id: parseInt(orderID),
        schedulestatus: "CANCELLED_SE",
      });
    }
    if (actionID == "3") {
      var reqBody = JSON.stringify({
        id: parseInt(orderID),
        schedulestatus: "CANCELLED_SE",
      });
    }
    // var reqBody = JSON.stringify({
    //   id: parseInt(req.orderID),
    //   service_engineer: req.SEid,
    //   schedulestatus: "ASSIGNED_SE",
    // });
    // const resp = await fetch(
    //   apiURL+"/updateInstallationSchedule/",
    //   {
    //     method: "post",
    //     body: reqBody,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": token,
    //     },
    //   }
    // );

    // await resp.json().then((data) => {
    //   console.log(data);
    //   res.redirect("/readyForInstallation/0/1/0");
    // });
    // console.log(reqBody);
  });

  // -------------------------------------------- Counts Functions----------------------------------

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
};
