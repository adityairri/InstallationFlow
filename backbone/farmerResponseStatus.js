const fs = require("fs");
var ejs = require("ejs");
var http = require("http");
var axios = require("axios");
var fetch = require("cross-fetch");
//const apiURL='http://172.105.47.223:8000/api';
//const token="Token 4861d9484816c25e94be97410fd9f1ffa0b0c1fd";

const apiURL='http://app.aquaexchange.com/api';
const token="Token e50f000f342fe8453e714454abac13be07f18ac3";

module.exports = function () {
  app.get("/viewFarmerStatus/:status/:pageNo", async function (req, res) {
    await getSEList();
    if (req.params.status == "pending") {
      var variables = {
        "tableTitle": "PENDING",
        "navBarHighlight1": "background-color: #E9E9E9; color: #555555;",
        "navBarHighlight2": "",
        "navBarHighlight3": ""
      };
      var reqBody = JSON.stringify({
        filter: {
          status: "SEND_FARMER_CONFIRM",
        },
      });
    }
    if (req.params.status == "accepted") {
      var variables = {
        "tableTitle": "ACCEPTED",
        "navBarHighlight1": "",
        "navBarHighlight2": "background-color: #E9E9E9; color: #555555;",
        "navBarHighlight3": ""
      };
      var reqBody = JSON.stringify({
        filter: {
          status: "FARMER_FINAl_CONFIRM",
        },
      });
    }
    if (req.params.status == "cancelled") {
      var variables = {
        "tableTitle": "DECLINED",
        "navBarHighlight1": "",
        "navBarHighlight2": "",
        "navBarHighlight3": "background-color: #E9E9E9; color: #555555;"
      };
      var reqBody = JSON.stringify({
        filter: {
          status: "FARMER_FINAL_CANCEL",
        },
      });
    }

    const resp = await fetch(apiURL+"/getInstallationSchedule/?page="+parseInt(req.params.pageNo)+"",
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

                var SEname;
              new Promise(function(resolve, reject){
                SElist.forEach(element => {
                  if(singleInData.service_engineer == element.id){
                    SEname = element.first_name;
                  }
                });
              });


                remarks = dataa;
                daata.push({
                  remarks: remarks,
                  data: singleInData,
                  seName: SEname
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
     
      // await getFarmerPendingList();
      // await getFarmerAcceptedList();
      // await getFarmerDeclinedList();
      await getAllStatusCount();
      await getAllStatusCount();
      res.render("farmerResponseStatus", {
        dataPaginationNext: data.links.next,
        dataPaginationPrevious: data.links.previous,
        dataPaginationPageNo: data.page.page,
        dataPaginationTotalPages: data.page.pages,

        data1: daata,
        variables: variables,
        OpenOrdersCount: newOrdersCount,
        reconfirmOrdersCount: FarmerDateConfirm,
       
        totalRescheduleCount: CancelledSEReSchedule + SMReschedule + FarmerCancelledReschedule,

        ReadyForInstallationCount: FarmerReconfirm,
        sePendingList: AssignedSE,
        seAcceptedList: ConfirmedSE,
        seDeclinedList: CancelledSE,
        farmerPendingList: SendFarmerConfirmation,
        farmerAcceptedList: FarmerFinalConfirmation,
        farmerDeclinedList: FamerFinalCancelled,
        installationPendingList: SEAttended,
        installationPartialCompleteList: PartialCompleted,
        installationCompletedList: Completed
      });
    });
  });






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
      res.redirect("/viewFarmerStatus/pending/1");
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
    const resp = await fetch(apiURL+"/getinstallStatuscount/",
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
    const resp = await fetch(apiURL+"/general/serviceengineers/",
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


  var remarks = [];
  async function getRemarksList(req, res) {
    var req = req;
    const resp = await fetch(
      apiURL+"/getremarksfororder/"+req+"",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    await resp.json().then((dataa) => {
    
      remarks = dataa;
    });
  }
};
