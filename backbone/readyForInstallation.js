const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
// const apiURL = "http://172.105.47.223:8000/api";
// const token = "Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd";

const apiURL='http://app.aquaexchange.com/api';
const token="Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get("/assignSE/:orderID/:SEid", async function (req, res) {
    var req = req.params;
    var reqBody = JSON.stringify({
      schedule:{
        id: parseInt(req.orderID),
        service_engineer: req.SEid,
        schedulestatus: "ASSIGNED_SE",
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
      res.redirect("/readyForInstallation/0/1");
    });
    // console.log(reqBody);
  });







  app.get("/reschedule/:orderID", async function (req, res) {
    var req = req.params;
    var reqBody = JSON.stringify({
      schedule:{
        id: parseInt(req.orderID),
        schedulestatus: "SM_RESCHEDULE",
      }
    });
    const resp = await fetch(apiURL+"/updateInstallationSchedule/",
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
      res.redirect("/readyForInstallation/0/1");
    });
    // console.log(reqBody);
  });
  var dateUnassignedCount1;
  app.get("/readyForInstallation/:date/:pageNo", async function (req, res) {
    // console.log(req.params);
    var seDates;
    if (req.params.date == "0") {
      var page = req.params.pageNo;
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
      var page = req.pageNo;
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
    var seListWithCount = [];
    var daata = [];
    resp.json().then(async (data) => {
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
      // console.log(data);
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
      await getAllStatusCount();
      await getAllStatusCount();
      
      res.render("readyForInstallation", {
        data1: daata,
        date: fromDate,

        dataPaginationNext: data.links.next,
        dataPaginationPrevious: data.links.previous,
        dataPaginationPageNo: data.page.page,
        dataPaginationTotalPages: data.page.pages,

        newOrdersCount: newOrdersCount,
        reconfirmOrdersCount: FarmerDateConfirm,
        readyToInstallCount: FarmerReconfirm,
       
        seList:seListWithCount,
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

  var SElist;
  async function getSEList(req, res) {
    const resp = await fetch(
      apiURL+"/general/serviceengineers/",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    await resp.json().then((dataa) => {
      // console.log(dataa);
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
      apiURL+"/assignedorderforse/",
      {
        method: "post",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    await resp.json().then((dataa) => {
// console.log(dataa);
if(dataa.status!=false){
  SEassignedCount = dataa;
}else{
  SEassignedCount = [];
}

      
    }).catch(error => {
      SEassignedCount = [];
    });
    
  }
  // var assignedToSECount1;
  // async function getAssignedToSECount(req, res) {
  //   var reqBody = JSON.stringify({
  //     filter: {
  //       status: "ASSIGNED_SE",
  //     },
  //   });
  //   const resp = await fetch(
  //     apiURL+"/getInstallationSchedule/",
  //     {
  //       method: "post",
  //       body: reqBody,
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": token,
  //       },
  //     }
  //   );
  //   await resp.json().then((dataa) => {
  //     console.log(dataa);
  //     assignedToSECount1 = dataa;
  //   });
  // }

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
