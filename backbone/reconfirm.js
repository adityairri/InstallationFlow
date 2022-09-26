const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
const apiURL = "http://app.aquaexchange.com/api";
const token = "Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  
    app.get("/confirmFarmerReconfirmDate/:orderId", async function (req, res) {
        var req = req.params;
        var reqBody = JSON.stringify({
          schedule:{
            id: parseInt(req.orderId),
            schedulestatus: "FARMER_RECONFIRM",
          }
        });
        const resp = await fetch(
          apiURL+"/updateInstallationSchedule/",
          {
            method: "post",
            body: reqBody,
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            },
          }
        );
    
        await resp.json().then((data) => {
          // console.log(data);
          res.redirect("/reconfirm/0/1/0");
        });
        // console.log(reqBody);
      });


      app.get("/farmerReschedule/:orderID", async function (req, res) {
        
          var reqBody = JSON.stringify({
            schedule: {
              id: parseInt(req.params.orderID),
              schedulestatus: "FARMER_FINAL_CANCEL",
            },
          });
    
        const resp = await fetch(
          apiURL+"/updateInstallationSchedule/",
          {
            method: "post",
            body: reqBody,
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            },
          }
        );
        resp.json().then(async (data) => {
          // console.log(data);
          res.redirect("/reconfirm/0/1/0");
        });
      });


      app.get("/assignDateFromReconfirm/:orderID/:date/:time",
    async function (req, res) {
      var req = req.params;
      // console.log(req);
      var date = req.date + " 00:00";
      var reqBody = JSON.stringify({
        schedule: {
          id: parseInt(req.orderID),
          confirmed_date: date,
          confirmed_slot: req.time,
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
        res.redirect("/reconfirm/0/1/0");
      });
      // console.log(reqBody);
    }
  );



  
    app.get("/reconfirm/:date/:pageNo/:searchByOrderID", async function (req, res) {
      if(req.params.searchByOrderID == "0"){
    if (req.params.date == "0") {
      var page = req.params.pageNo;
        var fromDate = new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString("fr-CA")  + " 00:00";
        var toDate = fromDate;
        var reqBody = JSON.stringify({
          filter: {
            status: "FARMER_DATE_CONFIRM",
            from_date: fromDate,
            to_date: toDate,
          },
        });
      } else {
        var req = req.params;
        var page = req.pageNo;
        var fromDate = req.date + " 00:00";
        var toDate = fromDate;
        var reqBody = JSON.stringify({
          filter: {
            status: "FARMER_DATE_CONFIRM",
            from_date: fromDate,
            to_date: toDate,
          },
        });
      }
    } else{
      var page = req.params.pageNo;
      var fromDate = new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString("fr-CA")  + " 00:00";
      var toDate = fromDate;
      var reqBody = JSON.stringify({
        filter: {
          order_id: parseInt(req.params.searchByOrderID),
          status: "FARMER_DATE_CONFIRM"
        },
      });
    }

    const resp = await fetch(
      apiURL+"/getInstallationSchedule/?page="+parseInt(page)+"",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    var daata = [];
    await resp.json().then(async (data) => {
      if (data.msg != "Invalid page.") {
      data.results.forEach(async (singleInData) => {
        var wooCommerseID = singleInData.order.woo_commerce_order_id;
        
        new Promise(function(resolve, reject){
          fetch(apiURL+"/getremarksfororder/" + wooCommerseID + "",
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          ).then(resp=>{
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
          })
        });
      });
    }else if(data.msg == "Invalid page."){
      data.links={
        "next": null,
        "previous": null
    };
    data.page={
      "page": 1,
      "pages": 1,
      "count": 0
  }
    }
      await getAllStatusCount();
      await getAllStatusCount();
      res.render("reconfirm", {
        data1: daata,
        date: fromDate,
        newOrdersCount: newOrdersCount,
        reconfirmOrdersCount: data.page.count,
        totalReconfirmOrdersCount: FarmerDateConfirm,
        
        dataPaginationNext: data.links.next,
        dataPaginationPrevious: data.links.previous,
        dataPaginationPageNo: data.page.page,
        dataPaginationTotalPages: data.page.pages,

        readyToInstallCount: FarmerReconfirm,
        totalRescheduleCount: CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,
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
    const resp = await fetch(
      apiURL+"/getinstallStatuscount/",
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

        if(data.some(singleData => singleData.schedulestatus === "New Order")){
          data.forEach(element => {
            if(element.schedulestatus==="New Order"){
              newOrdersCount = element.total;
            }
          });
        }else{
          newOrdersCount = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Date_Confirm")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Date_Confirm"){
              FarmerDateConfirm = element.total;
            }
          });
        }else{
          FarmerDateConfirm = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Reconfirm")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Reconfirm"){
              FarmerReconfirm = element.total;
            }
          });
        }else{
          FarmerReconfirm = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Cancelled_SE_ReSchedule")){
          data.forEach(element => {
            if(element.schedulestatus==="Cancelled_SE_ReSchedule"){
              CancelledSEReSchedule = element.total;
            }
          });
        }else{
          CancelledSEReSchedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "SM_Reschedule")){
          data.forEach(element => {
            if(element.schedulestatus==="SM_Reschedule"){
              SMReschedule = element.total;
            }
          });
        }else{
          SMReschedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Famer_Final_Cancelled")){
          data.forEach(element => {
            if(element.schedulestatus==="Famer_Final_Cancelled"){
              FarmerCancelledReschedule = element.total;
            }
          });
        }else{
          FarmerCancelledReschedule = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Assigned_SE")){
          data.forEach(element => {
            if(element.schedulestatus==="Assigned_SE"){
              AssignedSE = element.total;
            }
          });
        }else{
          AssignedSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Send_Farmer_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Send_Farmer_Confirmation"){
              ConfirmedSE = element.total;
            }
          });
        }else{
          ConfirmedSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Cancelled_SE")){
          data.forEach(element => {
            if(element.schedulestatus==="Cancelled_SE"){
              CancelledSE = element.total;
            }
          });
        }else{
          CancelledSE = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Send_Farmer_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Send_Farmer_Confirmation"){
              SendFarmerConfirmation = element.total;
            }
          });
        }else{
          SendFarmerConfirmation = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Farmer_Final_Confirmation")){
          data.forEach(element => {
            if(element.schedulestatus==="Farmer_Final_Confirmation"){
              FarmerFinalConfirmation = element.total;
            }
          });
        }else{
          FarmerFinalConfirmation = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Famer_Final_Cancelled")){
          data.forEach(element => {
            if(element.schedulestatus==="Famer_Final_Cancelled"){
              FamerFinalCancelled = element.total;
            }
          });
        }else{
          FamerFinalCancelled = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "SE_Attended")){
          data.forEach(element => {
            if(element.schedulestatus==="SE_Attended"){
              SEAttended = element.total;
            }
          });
        }else{
          SEAttended = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Partial Completed")){
          data.forEach(element => {
            if(element.schedulestatus==="Partial Completed"){
              PartialCompleted = element.total;
            }
          });
        }else{
          PartialCompleted = 0;
        }

        if(data.some(singleData => singleData.schedulestatus === "Completed")){
          data.forEach(element => {
            if(element.schedulestatus==="Completed"){
              Completed = element.total;
            }
          });
        }else{
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
};
