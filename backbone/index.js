const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get("/assignDate/:orderID/:farmID/:date/:time/:remarks/:fromDate/:toDate/:pageNo",
    async function (req, res) {
      var req = req.params;
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
          remarks: req.remarks,
          schedulestatus: "FARMER_DATE_CONFIRM",
        },
        farms: farmsApendObject,
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
        res.redirect("/page/"+req.fromDate+"/"+req.toDate+"/"+req.pageNo+"/0");
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

      await resp.json().then((data) => {
        // console.log(data);
        res.redirect("/");
      });
      // console.log(reqBody);
    }
  );

  app.get("/markAsComplete/:orderID/:fromDate/:toDate/:pageNo", async function (req, res) {
    var req = req.params;
    // console.log(req);
    var orderID = req.orderID;
    var reqBody = JSON.stringify({
      schedule: {
        id: parseInt(orderID),
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
      res.redirect("/page/"+req.fromDate+"/"+req.toDate+"/"+req.pageNo+"/0");
    });
    // console.log(reqBody);
  });




  app.get("/cancelOrder/:orderID/:fromDate/:toDate/:pageNo", async function (req, res) {
    var req = req.params;
    // console.log(req);
    var orderID = req.orderID;
    var reqBody = JSON.stringify({
        order_id: parseInt(orderID)
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
      res.redirect("/page/"+req.fromDate+"/"+req.toDate+"/"+req.pageNo+"/0");
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
    res.redirect("/page/0/0/1/0");
//     var reqBody = JSON.stringify({
//       filter: {
//         status: "NEW_ORDER",
//       },
//     });
//     const resp = await fetch(apiURL + "/getInstallationSchedule/?page=1", {
//       method: "post",
//       body: reqBody,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     });
//     var daata = [];
//     await resp.json().then(async (data) => {
//       data.results.forEach(async (singleInData) => {
//         var wooCommerseID = singleInData.order.woo_commerce_order_id;
//         // if (dummyData.some((singleData) => singleData.woo_commerce_order_id === wooCommerseID)) {
//         //   dummyData.forEach((element) => {
//         //     if (element.woo_commerce_order_id === wooCommerseID) {
//         //       newOrdersCount = element.total;
//         //     }
//         //   });
//         // } else {
//         //   newOrdersCount = 0;
//         // }
//         new Promise(function (resolve, reject) {
//           fetch(apiURL + "/getremarksfororder/" + wooCommerseID + "", {
//             method: "get",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }).then((resp) => {
//             resp.json().then((dataa) => {
//               remarks = dataa;
//               daata.push({
//                 remarks: remarks,
//                 data: singleInData,
//               });
//               resolve();
//             });
//           });
//         });
//       });

//       // console.log(daata);
//       await getAllStatusCount();
//       await getAllStatusCount();
// // console.log(dummyData);
//       res.render("index", {
//         data1: daata,
//         dataPaginationNext: data.links.next,
//         dataPaginationPrevious: data.links.previous,
//         dataPaginationPageNo: data.page.page,
//         dataPaginationTotalPages: data.page.pages,

//         newOrdersCount: newOrdersCount,
//         reconfirmOrdersCount: FarmerDateConfirm,
//         readyToInstallCount: FarmerReconfirm,
//         totalRescheduleCount:
//           CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,
//         sePendingList: AssignedSE,
//         seAcceptedList: ConfirmedSE,
//         seDeclinedList: CancelledSE,
//         farmerPendingList: SendFarmerConfirmation,
//         farmerAcceptedList: FarmerFinalConfirmation,
//         farmerDeclinedList: FamerFinalCancelled,
//         installationPendingList: SEAttended,
//         installationPartialCompleteList: PartialCompleted,
//         installationCompletedList: Completed,
//       });
//     });
  });

  app.get("/page/:fromDate/:toDate/:pageNo/:searchByOrderID", async function (req, res) {
    if(req.params.searchByOrderID == 0){
      if (req.params.fromDate == 0 || req.params.fromDate == 0) {
        var reqBody = JSON.stringify({
          filter: {
            status: "NEW_ORDER",
          },
        });
      } else if (req.params.fromDate != null && req.params.fromDate != null) {
        var reqBody = JSON.stringify({
          filter: {
            from_date: req.params.fromDate + " 00:00",
            to_date: req.params.toDate + " 23:59",
            status: "NEW_ORDER",
          },
        });
      }
    }else if(req.params.searchByOrderID != 0){
      var reqBody = JSON.stringify({
        filter: {
          order_id: parseInt(req.params.searchByOrderID),
          status: "NEW_ORDER",
        },
      });
    }
    

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
                singleInData.order.items.forEach(element => {
                  if(element.name == "Powermon 2.0"){
                      if(element.isInstalled == true){
                        powermonInstalled = powermonInstalled+1;
                      }if(element.isInstalled == false){
                        powermonNotInstalled = powermonNotInstalled+1;
                      }
                  }else if(element.name == "APFC - Automatic power factor Controller"){
                      if(element.isInstalled == true){
                        apfcInstalled = apfcInstalled+1;
                      }if(element.isInstalled == false){
                        apfcNotInstalled = apfcNotInstalled+1;
                      }
                  }
                });

                daata.push({
                  remarks: remarks,
                  data: singleInData,
                  powermonItems: "Powermon - "+(powermonInstalled + powermonNotInstalled)+" - "+powermonInstalled,
                  apfcItems: "APFC - "+(apfcInstalled + apfcNotInstalled)+" - "+apfcInstalled
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

      res.render("index", {
        data1: daata,
        dataPaginationNext: data.links.next,
        dataPaginationPrevious: data.links.previous,
        dataPaginationPageNo: data.page.page,
        dataPaginationTotalPages: data.page.pages,

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
      });
    });
  });

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
      if (data.some((singleData) => singleData.schedulestatus === "New Order")) {
        data.forEach((element) => {
          if (element.schedulestatus === "New Order") {
            newOrdersCount = element.total;
          }
        });
      } else {
        newOrdersCount = 0;
      }

      if (data.some((singleData) => singleData.schedulestatus === "Farmer_Date_Confirm"
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




























  // var dummyData = [{"created_date":"2022-09-14 15:25:11.758 +0530","woo_commerce_order_id":2232,"Cust_name ":"ganapavaram-hub2","shipping":"Kala Lakshmi narayana  8-104 Uttarapalem Mahdevpatnam AP 534199 IN 8790333299"},{"created_date":"2022-09-14 15:26:43.944 +0530","woo_commerce_order_id":2242,"Cust_name ":"bala-kiran","shipping":"Kiran Plo Nextaqua Hddh Vjj Jcifigug AP 533247 IN 9550660450"},{"created_date":"2022-09-14 15:27:50.614 +0530","woo_commerce_order_id":2251,"Cust_name ":"ganapavaram-hub2","shipping":"Balam Srinivas  Pedagonnuru  Pedagonnuru AP 521329 IN 9908753994"},{"created_date":"2022-09-14 15:28:16.342 +0530","woo_commerce_order_id":2253,"Cust_name ":9949949198,"shipping":"Ravula Suresh  Main road matsyapuri Matsyapuri Bhimavaram AP 534207 IN 9949949198"},{"created_date":"2022-09-14 15:29:57.864 +0530","woo_commerce_order_id":2273,"Cust_name ":9885019789,"shipping":"RAJESH Sdfsdfsds Dfgsdf Sdgsdfg  Sdgsdf AP 518401 IN 9876543210"},{"created_date":"2022-09-14 15:31:38.930 +0530","woo_commerce_order_id":2294,"Cust_name ":"seshaiahp","shipping":"pavan teja  Wwwwww  Hyderabad AP 500044 IN 8331032531"},{"created_date":"2022-09-14 15:42:43.160 +0530","woo_commerce_order_id":2318,"Cust_name ":"bala-kiran","shipping":"Kiran Plo Nextaqua Appanapalli Vjj Amalapauram AP 533247 IN 9550660450"},{"created_date":"2022-09-14 15:43:26.165 +0530","woo_commerce_order_id":2323,"Cust_name ":"tallarevu-hub","shipping":"Machireddy Tadi Mohan Ganja Gollapalem Gollapalem Kakinada AP 533468 IN 8909559999"},{"created_date":"2022-09-14 15:43:29.487 +0530","woo_commerce_order_id":2324,"Cust_name ":"tallarevu-hub","shipping":"Machireddy Tadi Mohan Ganja Gollapalem Gollapalem Kakinada AP 533468 IN 8909559999"},{"created_date":"2022-09-14 15:43:33.172 +0530","woo_commerce_order_id":2325,"Cust_name ":"tallarevu-hub","shipping":"Machireddy Tadi Mohan Ganja Gollapalem Gollapalem Kakinada AP 533468 IN 8909559999"},{"created_date":"2022-09-14 15:43:36.294 +0530","woo_commerce_order_id":2326,"Cust_name ":"gudivada-hub","shipping":"Ravi Ravve  Chinthalapudi  Mudinepally AP 521345 IN 9515019999"},{"created_date":"2022-09-14 15:44:20.918 +0530","woo_commerce_order_id":2327,"Cust_name ":"gudivada-hub","shipping":"Ravi Ravve  Chinthalapudi  Mudinepally AP 521345 IN 9515019999"},{"created_date":"2022-09-14 15:44:24.559 +0530","woo_commerce_order_id":2328,"Cust_name ":"bala-kiran","shipping":"Kiran Plo Nextaqua Appanapalli Vjj Amalapauram AP 533247 IN 9550660450"},{"created_date":"2022-09-14 15:44:27.880 +0530","woo_commerce_order_id":2329,"Cust_name ":"bala-kiran","shipping":"Kiran Plo Nextaqua Appanapalli Vjj Amalapauram AP 533247 IN 9550660450"},{"created_date":"2022-09-14 14:59:27.554 +0530","woo_commerce_order_id":2350,"Cust_name ":"ganapavaram-hub2","shipping":"Pericharla Satyanarayana raju  Kolamuru Near vinayaka temple Undi AP 534199 IN 9666322229"},{"created_date":"2022-09-14 15:01:19.309 +0530","woo_commerce_order_id":2373,"Cust_name ":9704842886,"shipping":"Jetti Suresh Padhakaparam Near high school  Akkividu AP 534235 IN 9704842886"},{"created_date":"2022-09-14 15:09:11.764 +0530","woo_commerce_order_id":2390,"Cust_name ":"issaku-service","shipping":"Pericharla Suryanarayanaraju 10 acras Kolamuru Kolamuru Undi AP 534299 IN 919666322229"},{"created_date":"2022-09-14 15:09:24.991 +0530","woo_commerce_order_id":2394,"Cust_name ":"gudivada-hub","shipping":"Krishna Mohan  Pasalapudi  Mandavali AP 521345 IN 8790022997"},{"created_date":"2022-09-14 15:11:16.771 +0530","woo_commerce_order_id":2410,"Cust_name ":"ganapavaram-hub2","shipping":"Pathepuram Sitarama raju  Pathepuram Pathepuram Unguturu AP 534199 IN 9390813699"},{"created_date":"2022-09-14 15:14:21.906 +0530","woo_commerce_order_id":2431,"Cust_name ":"gudivada-hub","shipping":"Sita Ram  Chinthalapudi  Manfavalli AP 521345 IN 9989384222"},{"created_date":"2022-09-14 15:18:19.835 +0530","woo_commerce_order_id":2468,"Cust_name ":"ganapavaram-hub","shipping":"N.U Krishnam raju  Elurupaadu  Elurupaadu AP 534199 IN 9949988977"},{"created_date":"2022-09-14 15:18:42.417 +0530","woo_commerce_order_id":2470,"Cust_name ":"ganapavaram-hub","shipping":"G G.v.naresh  Kallakuru  Kallakuru AP 534199 IN 8688677779"},{"created_date":"2022-09-14 15:19:07.220 +0530","woo_commerce_order_id":2473,"Cust_name ":"ganapavaram-hub","shipping":"Ravula Suresh  Mathsyapuri  Mogalthuru AP 534199 IN 9949949198"},{"created_date":"2022-09-14 15:19:11.321 +0530","woo_commerce_order_id":2474,"Cust_name ":"s-rayavaram-hub","shipping":"Rakesh Garu K SaiRam Aqua Farm A.V Nagaram Near A.V Nagaram Vemavaram AP 531126 IN 9553792999"},{"created_date":"2022-09-14 15:19:29.655 +0530","woo_commerce_order_id":2479,"Cust_name ":"seshus","shipping":"Setharamayya N  2-5 Kuppanapudi Akividu m AP 534235 IN 9010613339"},{"created_date":"2022-09-14 14:18:06.861 +0530","woo_commerce_order_id":2486,"Cust_name ":"gudivada-hub","shipping":"B Rambabu  Lingala  Mandavalli AP 521345 IN 8187817198"},{"created_date":"2022-09-14 14:25:06.434 +0530","woo_commerce_order_id":2497,"Cust_name ":"gudivada-hub","shipping":"Vijay Kishore  Anamanapudi  Rudrapaka AP 521343 IN 9866696479"},{"created_date":"2022-09-14 14:25:31.721 +0530","woo_commerce_order_id":2500,"Cust_name ":"seshus","shipping":"Murali Krishna Y  2-5 Mudhanapalli m Padhagonnuru AP 521329 IN 9866674771"},{"created_date":"2022-09-14 14:25:42.731 +0530","woo_commerce_order_id":2501,"Cust_name ":"dharma-teja","shipping":"Chaitanya Varma  Bhimavaram Vempa Bhimavaram AP 534201 IN 9959455555"},{"created_date":"2022-09-14 14:25:46.155 +0530","woo_commerce_order_id":2502,"Cust_name ":"dharma-teja","shipping":"Chaitanya Varma  Bhimavaram Vempa Bhimavaram AP 534201 IN 9959455555"},{"created_date":"2022-09-14 14:25:59.114 +0530","woo_commerce_order_id":2505,"Cust_name ":"dharma-teja","shipping":"Nagaraju Potturi  Pathepuram Pathepuram Bhimavaram AP 534406 IN 9494344393"},{"created_date":"2022-09-14 14:26:28.346 +0530","woo_commerce_order_id":2510,"Cust_name ":"gudivada-hub","shipping":"Venkanna Babu  Koraguntapalem  Singarayapalem AP 521343 IN 9010141474"},{"created_date":"2022-09-14 14:27:10.815 +0530","woo_commerce_order_id":2519,"Cust_name ":"vinodp","shipping":"Shankar raju Sir Shankar Raju farms Machlipatnam Machlipatnam Machilipatnam AP 521001 IN 9666036678"},{"created_date":"2022-09-14 14:28:30.549 +0530","woo_commerce_order_id":2533,"Cust_name ":"gudivada-hub","shipping":"Vijay Raju  Kommaru  Singarayyapalem AP 521345 IN 9676278345"},{"created_date":"2022-09-14 14:43:09.093 +0530","woo_commerce_order_id":2596,"Cust_name ":"gudivada-hub","shipping":"Degala Srinivas reddy  Jonnapadu  Nandiwada AP 521325 IN 9247744885"},{"created_date":"2022-09-14 14:51:36.426 +0530","woo_commerce_order_id":2617,"Cust_name ":"dharma-teja","shipping":"Pradeep Garu  Chodayipalem Repalle Bapatla AP 522265 IN 9193557777"},{"created_date":"2022-09-14 14:51:42.346 +0530","woo_commerce_order_id":2618,"Cust_name ":"dharma-teja","shipping":"Chaitanya Varma  Vempa Vempa Bhimavaram AP 534207 IN 9959455555"},{"created_date":"2022-09-14 14:52:19.648 +0530","woo_commerce_order_id":2626,"Cust_name ":"seshus","shipping":"Murali Krishna V  2-5 Undi m Valivarru AP 534199 IN 9705377899"},{"created_date":"2022-09-14 14:53:25.728 +0530","woo_commerce_order_id":2632,"Cust_name ":"vinodp","shipping":"Phani Garu P Phani Aqua Farms Machlipatnam Machlipatnam Machilipatnam AP 521001 IN 9440160740"},{"created_date":"2022-09-14 14:55:38.290 +0530","woo_commerce_order_id":2657,"Cust_name ":"avanigadda-hub","shipping":"Kanna Krishnaraju Krishnaraju aqua forms Nizampatnam Nizampatnam Repalle AP 522314 IN 7207246666"},{"created_date":"2022-09-14 14:55:42.517 +0530","woo_commerce_order_id":2658,"Cust_name ":"avanigadda-hub","shipping":"Kanna Krishnaraju Krishnaraju aqua forms Nizampatnam Nizampatnam Repalle AP 522314 IN 7207246666"},{"created_date":"2022-09-14 14:55:46.558 +0530","woo_commerce_order_id":2659,"Cust_name ":"gudivada-hub","shipping":"Nani Garu  Vennanapudi  Nandiwada AP 521347 IN 9912952999"},{"created_date":"2022-09-14 14:55:56.000 +0530","woo_commerce_order_id":2661,"Cust_name ":"dharma-teja","shipping":"Aditya varma Garu  Sriparru Kikaluru Kikaluru AP 534004 IN 8341466666"},{"created_date":"2022-09-14 13:58:32.664 +0530","woo_commerce_order_id":2671,"Cust_name ":"seshus","shipping":"Yadukondallu M  2-5 Kolanapalli Kalla m AP 534237 IN 8555931779"},{"created_date":"2022-09-14 13:58:54.474 +0530","woo_commerce_order_id":2677,"Cust_name ":"dharma-teja","shipping":"Teja varma Garu  Narasayapalem Bhujalapatnam Kikaluru AP 521340 IN 9618100045"},{"created_date":"2022-09-14 13:59:27.349 +0530","woo_commerce_order_id":2682,"Cust_name ":"dharma-teja","shipping":"Srinu Garu  Narasaypalem Bhujabalapatm Kikakuru AP 521340 IN 9989310888"},{"created_date":"2022-09-14 13:59:34.588 +0530","woo_commerce_order_id":2684,"Cust_name ":"vinodp","shipping":"Phani Garu P Phani Aqua Farms Machlipatnam Machlipatnam Machilipatnam AP 521001 IN 9440160740"},{"created_date":"2022-09-14 13:59:41.975 +0530","woo_commerce_order_id":2686,"Cust_name ":"seshus","shipping":"Vijay Raju  2-5 Dhodipatalla Kikaluru m AP 521333 IN 9676278345"},{"created_date":"2022-09-14 14:00:08.119 +0530","woo_commerce_order_id":2690,"Cust_name ":"seshus","shipping":"Hari Prasad  2-5 Kuppanapudi Akividu m AP 534235 IN 7416628803"},{"created_date":"2022-09-14 14:02:25.713 +0530","woo_commerce_order_id":2701,"Cust_name ":"seshus","shipping":"Thathaya G  2-5 Pothumarru Kalidhindi m AP 521322 IN 9866251234"},{"created_date":"2022-09-14 14:03:00.372 +0530","woo_commerce_order_id":2711,"Cust_name ":"gudivada-hub","shipping":"Peddiraju Garu  Aripirala  Aarugolanu AP 521106 IN 9494658599"},{"created_date":"2022-09-14 14:03:45.457 +0530","woo_commerce_order_id":2720,"Cust_name ":"malkipuram-hub","shipping":"Pavanraju R Ravindra Gudimula Site Malkipuram AP 533250 IN 9676232341"},{"created_date":"2022-09-14 14:04:02.436 +0530","woo_commerce_order_id":2725,"Cust_name ":"dharma-teja","shipping":"Babu raju Garu  Ogirala Arugolanu Gudiwada AP 521106 IN 7331167899"},{"created_date":"2022-09-14 14:04:10.556 +0530","woo_commerce_order_id":2727,"Cust_name ":"dharma-teja","shipping":"Raghu Garu  Yenamaduru Bhimavaram Bhimavaram AP 534239 IN 9494526666"},{"created_date":"2022-09-14 14:04:17.976 +0530","woo_commerce_order_id":2729,"Cust_name ":"kaikaluru-hub","shipping":"Sheshu garu D Aqua exchange Vemavarappadu Vemavarappadu Kaikaluru AP 521333 IN 8247834270"},{"created_date":"2022-09-14 14:04:43.212 +0530","woo_commerce_order_id":2731,"Cust_name ":"dharma-teja","shipping":"Raghu varma Garu  Inathavaram Pothukuru Amalapuram AP 533216 IN 9505688888"},{"created_date":"2022-09-14 14:05:09.246 +0530","woo_commerce_order_id":2737,"Cust_name ":"gudivada-hub","shipping":"Kittu Garu  Nandiwada  Nandiwada AP 521325 IN 8455087524"},{"created_date":"2022-09-14 14:06:12.964 +0530","woo_commerce_order_id":2748,"Cust_name ":"malkipuram-hub","shipping":"Subbaraogaru Buddala Ravindra Bhavadevarapalli Site Avanigadda AP 521120 IN 7093851288"},{"created_date":"2022-09-14 14:07:13.030 +0530","woo_commerce_order_id":2755,"Cust_name ":"seshus","shipping":"Mvv Prasad  2-5 Varahapatanam Kikaluru m AP 521333 IN 9948418623"},{"created_date":"2022-09-14 14:10:49.739 +0530","woo_commerce_order_id":2764,"Cust_name ":"vinodp","shipping":"Ramakrishna K Ramakrishna Aqua Farms Machlipatnam Krishna University Machilipatnam AP 521001 IN 6300735585"},{"created_date":"2022-09-14 13:50:23.045 +0530","woo_commerce_order_id":2806,"Cust_name ":"kishoree","shipping":"Ramaraju M Ramaraju Aqua Farms Kolamurru Kolamurru Kolamurru AP 533103 IN 9100911333"},{"created_date":"2022-09-14 13:52:37.806 +0530","woo_commerce_order_id":2827,"Cust_name ":"gudivada-hub","shipping":"Somaraju Garu  Kalla  Kalla AP 534237 IN 9493777798"},{"created_date":"2022-09-14 13:54:28.459 +0530","woo_commerce_order_id":2843,"Cust_name ":"bhimavaram-hub","shipping":"vijay ramaraju garu Vijay ramaraju garu  Vempa  Vempa AP 534207 IN 8977558855"},{"created_date":"2022-09-14 13:55:26.195 +0530","woo_commerce_order_id":2851,"Cust_name ":"gudivada-hub","shipping":"Nani Garu  Polukonda  Nandiwada AP 521345 IN 9912952999"},{"created_date":"2022-09-14 13:55:51.506 +0530","woo_commerce_order_id":2858,"Cust_name ":"vinodp","shipping":"Ramana Pavuluri Ramana Machlipatnam Krishna University Machilipatnam AP 521001 IN 9550845599"},{"created_date":"2022-09-14 13:57:01.584 +0530","woo_commerce_order_id":2876,"Cust_name ":"ganapavaram-hub","shipping":"pala Venkata Durga prasad  Pennada  Pennada AP 534199 IN 9966481529"},{"created_date":"2022-09-13 12:46:52.641 +0530","woo_commerce_order_id":2885,"Cust_name ":"gudivada-hub","shipping":"Srikanth Garu  Peddagonnuru  Singaraypalem AP 521347 IN 8143919967"},{"created_date":"2022-09-14 09:48:07.488 +0530","woo_commerce_order_id":2952,"Cust_name ":"vinodp","shipping":"Kamal Garu  Devapudi Devapudi Machlipatnam AP 521343 IN 9640967777"},{"created_date":"2022-09-14 09:49:23.422 +0530","woo_commerce_order_id":2969,"Cust_name ":"gudivada-hub","shipping":"phani Garu  Nandiwada  Nandiwada AP 521321 IN 9959336965"},{"created_date":"2022-09-14 09:50:18.101 +0530","woo_commerce_order_id":2980,"Cust_name ":"gudivada-hub","shipping":"Nagaraju Garu  Apparaopeta  Hanuman junction AP 534145 IN 9959336965"},{"created_date":"2022-09-14 10:00:45.600 +0530","woo_commerce_order_id":3024,"Cust_name ":"s-rayavaram-hub","shipping":"VenkataRaju D D.VenkataRaju Aqua Farm A.V Nagaram A V Nagaram A.V Nagaram AP 533447 IN 9959176666"},{"created_date":"2022-09-14 10:15:02.784 +0530","woo_commerce_order_id":3027,"Cust_name ":"s-rayavaram-hub","shipping":"Pavan Garu Pavan Aqua Farm Ganesh Hatchery opposite site Addaripeta Addaripeta AP 531127 IN 9333043333"},{"created_date":"2022-09-14 10:16:17.626 +0530","woo_commerce_order_id":3045,"Cust_name ":"s-rayavaram-hub","shipping":"Raghu N Varun Aqua Farm Vemavaram Vemavaram Vemavaram AP 531127 IN 7399334422"},{"created_date":"2022-09-14 10:16:22.416 +0530","woo_commerce_order_id":3046,"Cust_name ":"s-rayavaram-hub","shipping":"Raghu N Varun Aqua Farm Vemavaram Vemavaram Vemavaram AP 531127 IN"},{"created_date":"2022-09-14 10:17:15.774 +0530","woo_commerce_order_id":3047,"Cust_name ":"s-rayavaram-hub","shipping":"Raghu N Varun Aqua Farm Vemavaram Vemavaram Vemavaram AP 531127 IN"},{"created_date":"2022-09-14 10:17:27.170 +0530","woo_commerce_order_id":3050,"Cust_name ":"ganapavaram-hub","shipping":"Bandreddy Rama krishna  Dusanapudi  Srungavruksham AP 534198 IN 9912473230"},{"created_date":"2022-09-14 10:18:39.137 +0530","woo_commerce_order_id":3066,"Cust_name ":"gudivada-hub","shipping":"Bale Reddy  Tummalapalli  Tummalapalli AP 521321 IN 9948325788"}];
};
