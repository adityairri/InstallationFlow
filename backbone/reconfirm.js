const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get(
    "/confirmFarmerReconfirmDate/:orderId/:date/:pageNo/:searchByOrderID/:AllPageNo/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      var req = req.params;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderId),
          remarks: "(Reconfirmed -> Ready for Installation)",
          schedulestatus: "FARMER_RECONFIRM",
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
        res.redirect(
          "/reconfirm/" +
            req.date +
            "/" +
            req.pageNo +
            "/" +
            req.searchByOrderID +
            "/" +
            req.AllPageNo +
            "/" +
            req.bdeName +
            "/" +
            req.regionName +
            "/" +
            req.urlSEname
        );
      });
      // console.log(reqBody);
    }
  );

  app.get(
    "/farmerReschedule/:orderID/:searchByDate/:pageNo/:searchByOrderID/:AllPageNo/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      var req = req.params;
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderID),
          remarks: "(Reconfirmed -> Farmer Rescheduled)",
          schedulestatus: "FARMER_FINAL_CANCEL",
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
      resp.json().then(async (data) => {
        // console.log(data);
        res.redirect(
          "/reconfirm/" +
            req.searchByDate +
            "/" +
            req.pageNo +
            "/" +
            req.searchByOrderID +
            "/" +
            req.AllPageNo +
            "/" +
            req.bdeName +
            "/" +
            req.regionName +
            "/" +
            req.urlSEname
        );
      });
    }
  );

  app.get(
    "/assignDateFromReconfirm/:orderID/:date/:time/:searchByDate/:pageNo/:searchByOrderID/:AllPageNo/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var date = req.date + " 00:00";
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderID),
          confirmed_date: date,
          confirmed_slot: req.time,
          remarks: "(Reconfirmed -> Farmer Reconfirmed to another date)",
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
        res.redirect(
          "/reconfirm/" +
            req.searchByDate +
            "/" +
            req.pageNo +
            "/" +
            req.searchByOrderID +
            "/" +
            req.AllPageNo +
            "/" +
            req.bdeName +
            "/" +
            req.regionName +
            "/" +
            req.urlSEname
        );
      });
      // console.log(reqBody);
    }
  );

  var allReconfirmOrdersData = [];
  var totalLinks;
  var totalPage;
  async function getAllReconfirmOrders(req, res) {
    var AllPageNo = req;
    var reqBody = JSON.stringify({
      filter: {
        status: "FARMER_DATE_CONFIRM",
      },
    });

    // console.log(reqBody);
    const resp = await fetch(
      apiURL + "/getInstallationSchedule/?page=" + parseInt(AllPageNo) + "",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    await resp.json().then((data) => {
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

                allReconfirmOrdersData.push({
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
        totalLinks = {
          next: data.links.next,
          previous: data.links.previous,
        };
        totalPage = {
          page: data.page.page,
          pages: data.page.pages,
          count: data.page.count,
        };
      } else if (data.msg == "Invalid page.") {
        totalLinks = {
          next: null,
          previous: null,
        };
        totalPage = {
          page: 1,
          pages: 1,
          count: 0,
        };
      }
    });
  }

  app.get(
    "/reconfirm/:date/:pageNo/:searchByOrderID/:AllPageNo/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      if (
        req.params.searchByOrderID == 0 &&
        req.params.date == 0 &&
        req.params.bdeName == 0 &&
        req.params.regionName == 0 &&
        req.params.urlSEname == 0
      ) {
        var page = req.params.pageNo;
        var fromDate =
          new Date(
            +new Date().setHours(0, 0, 0, 0) + 86400000
          ).toLocaleDateString("fr-CA") + " 00:00";
        var toDate = fromDate;
        var reqBody = JSON.stringify({
          filter: {
            status: "FARMER_DATE_CONFIRM",
            from_date: fromDate,
            to_date: toDate,
          },
        });
      } else {
        if (req.params.searchByOrderID != 0) {
          var page = req.params.pageNo;
          var fromDate =
            new Date(
              +new Date().setHours(0, 0, 0, 0) + 86400000
            ).toLocaleDateString("fr-CA") + " 00:00";
          var toDate = fromDate;
          var reqBody = JSON.stringify({
            filter: {
              order_id: parseInt(req.params.searchByOrderID),
              status: "FARMER_DATE_CONFIRM",
            },
          });
        }
        if (req.params.date != 0) {
          var page = req.params.pageNo;
          var fromDate = req.params.date + " 00:00";
          var toDate = fromDate;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              from_date: fromDate,
              to_date: toDate,
            },
          });
        }
        if (req.params.bdeName != 0) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              bde: req.params.bdeName,
            },
          });
        }
        if (req.params.regionName != 0) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              region: req.params.regionName,
            },
          });
        }
        if (req.params.urlSEname != 0) {
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              service_engineer: req.params.urlSEname,
            },
          });
        }
      }

      // if (req.params.searchByOrderID == "0") {
      //   if (req.params.date == "0") {
      //     var page = req.params.pageNo;
      //     var fromDate =
      //       new Date(
      //         +new Date().setHours(0, 0, 0, 0) + 86400000
      //       ).toLocaleDateString("fr-CA") + " 00:00";
      //     var toDate = fromDate;
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         status: "FARMER_DATE_CONFIRM",
      //         from_date: fromDate,
      //         to_date: toDate,
      //       },
      //     });
      //   } else {
      //     var req = req.params;
      //     var page = req.pageNo;
      //     var fromDate = req.date + " 00:00";
      //     var toDate = fromDate;
      //     var reqBody = JSON.stringify({
      //       filter: {
      //         status: "FARMER_DATE_CONFIRM",
      //         from_date: fromDate,
      //         to_date: toDate,
      //       },
      //     });
      //   }
      // } else {
      //   var page = req.params.pageNo;
      //   var fromDate =
      //     new Date(
      //       +new Date().setHours(0, 0, 0, 0) + 86400000
      //     ).toLocaleDateString("fr-CA") + " 00:00";
      //   var toDate = fromDate;
      //   var reqBody = JSON.stringify({
      //     filter: {
      //       order_id: parseInt(req.params.searchByOrderID),
      //       status: "FARMER_DATE_CONFIRM",
      //     },
      //   });
      // }

      const resp = await fetch(
        apiURL + "/getInstallationSchedule/?page=" + parseInt(page) + "",
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
        await getAllStatusCount();
        await getSEList();
        await getBDEList();
        await getRegionsList();
        await getAllStatusCount();
        await getAllReconfirmOrders(req.params.AllPageNo);
        await getDevicesList();
        res.render("reconfirm", {
          data1: daata,
          date: fromDate,
          newOrdersCount: newOrdersCount,
          reconfirmOrdersCount: data.page.count,
          totalReconfirmOrdersCount: FarmerDateConfirm,

          totalReconfirmOrdersList: allReconfirmOrdersData,
          totalDataPaginationNext: totalLinks.next,
          totalDataPaginationPrevious: totalLinks.previous,
          totalDataPaginationPageNo: totalPage.page,
          totalDataPaginationTotalPages: totalPage.pages,

          dataPaginationNext: data.links.next,
          dataPaginationPrevious: data.links.previous,
          dataPaginationPageNo: data.page.page,
          dataPaginationTotalPages: data.page.pages,

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
          seList: SElist,

          totalAPFC: totalAPFC,
          totalPowermon: totalPowermon,
          totalPowermonAPFC: totalPowermonAPFC,
          installedAPFC: installedAPFC,
          installedPowermon: installedPowermon,
          installedPowermonAPFC: installedPowermonAPFC,
        });
        allReconfirmOrdersData = [];
        totalLinks = "";
        totalPage = "";
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
  // async function getRemarksList(req, res) {
  //   var req = req;
  //   const resp = await fetch(
  //     apiURL+"/getremarksfororder/"+req+"",
  //     {
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": token,
  //       },
  //     }
  //   );
  //   await resp.json().then((dataa) => {

  //     remarks = dataa;
  //   });
  // }

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

  app.get(
    "/reconfirmOrdersExport/:date/:pageNo/:searchByOrderID/:AllPageNo/:bdeName/:regionName/:urlSEname",
    async function (req, res) {
      if (
        req.params.searchByOrderID == 0 &&
        req.params.date == 0 &&
        req.params.bdeName == 0 &&
        req.params.regionName == 0 &&
        req.params.urlSEname == 0
      ) {
        var fileName = "";
        var reqBody = JSON.stringify({
          filter: {
            status: "FARMER_DATE_CONFIRM",
          },
        });
      } else {
        if (req.params.searchByOrderID != 0) {
          var fileName = "(Order ID - " + req.params.searchByOrderID + ")";
          var page = req.params.pageNo;
          var fromDate =
            new Date(
              +new Date().setHours(0, 0, 0, 0) + 86400000
            ).toLocaleDateString("fr-CA") + " 00:00";
          var toDate = fromDate;
          var reqBody = JSON.stringify({
            filter: {
              order_id: parseInt(req.params.searchByOrderID),
              status: "FARMER_DATE_CONFIRM",
            },
          });
        }
        if (req.params.date != 0) {
          var fileName = "(Date - " + req.params.date + ")";
          var page = req.params.pageNo;
          var fromDate = req.params.date + " 00:00";
          var toDate = fromDate;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              from_date: fromDate,
              to_date: toDate,
            },
          });
        }
        if (req.params.bdeName != 0) {
          var fileName = "(BDE - " + req.params.bdeName + ")";
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              bde: req.params.bdeName,
            },
          });
        }
        if (req.params.regionName != 0) {
          var fileName = "(Region - " + req.params.regionName + ")";
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
              region: req.params.regionName,
            },
          });
        }
        if (req.params.urlSEname != 0) {
          var fileName = "(SE - " + req.params.urlSEname + ")";
          var page = req.params.pageNo;
          var reqBody = JSON.stringify({
            filter: {
              status: "FARMER_DATE_CONFIRM",
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
          res.attachment("ReconfirmOrders " + fileName + ".csv");
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
