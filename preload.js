const path = require('path')
const ipcRenderer = require('electron').ipcRenderer;
//http请求
var request = require('request');
const { session } = require('electron');


//数据
var dataArr = [];
var dataArrO = [];
//调用后台资源
function connectMain(msg) {
    console.log('主进程', msg);
    ipcRenderer.send('getMsg', msg);
}

//调用后台资源反馈
ipcRenderer.on('getMsg-reply', (event, msg) => {
    console.log("后台" + msg);
})

// if (location.href.indexOf("sd.10086.cn") >= 0) {
//     var dingshi = setInterval(function () {
//         if (localStorage.selfservice_csrftoken) {
//             var csrftoken = JSON.parse(localStorage.selfservice_csrftoken).data;
//             // fetch("http://localhost:3333/", {
//             //     "headers": {
//             //         "accept": "application/json, text/plain, */*",
//             //         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//             //         "csrftoken": JSON.parse(localStorage.selfservice_csrftoken).data,
//             //         "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
//             //         "sec-ch-ua-mobile": "?0",
//             //         "sec-ch-ua-platform": "\"Windows\"",
//             //         "sec-fetch-dest": "empty",
//             //         "sec-fetch-mode": "cors",
//             //         "sec-fetch-site": "same-origin"
//             //     },
//             //     "referrer": "https://www.sd.10086.cn/newesopcentralapp/v2/",
//             //     "referrerPolicy": "strict-origin-when-cross-origin",
//             //     "body": null,
//             //     "method": "POST",
//             //     "mode": "cors",
//             //     "credentials": "include"
//             // });

//             request({
//                 url: "http://localhost:3333/",
//                 method: "POST",
//                 //json: true,
//                 headers: {
//                   "accept": "application/json, text/plain, */*",
//                   "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//                   "content-type": "application/json;charset=UTF-8",
//                   "csrftoken": csrftoken,
//                   "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
//                   "sec-ch-ua-mobile": "?0",
//                   "sec-ch-ua-platform": "\"Windows\"",
//                   "sec-fetch-dest": "empty",
//                   "sec-fetch-mode": "cors",
//                   "sec-fetch-site": "same-origin",
//                 },
//                 // referrer: "https://www.sd.10086.cn/newesopcentralapp/v2/",
//                 // referrerPolicy: "strict-origin-when-cross-origin",
//                 body: "",
//               }, function (error, response, body) {
//                 //console.log(body);
//                 //console.log(response);
//                 if (!error && response.statusCode == 200) {
//                   clearInterval(dingshi);
//                 } else {

//                 }
//               });
//         }
//     }, 1000)
// }
document.addEventListener('DOMContentLoaded', (event) => {
    //页面内容加载之后需要引入的一些操作
    console.log('fin111');
    // var dateTime = new Date();
    // if (localStorage.selfservice_csrftoken) {
    //     JSON.parse(localStorage.selfservice_csrftoken).data;
    // }
    var dingshi = setInterval(function () {
        console.log('preload111');
        if (localStorage.selfservice_csrftoken) {
            console.log('getCookie ok');
            var csrftoken = JSON.parse(localStorage.selfservice_csrftoken).data;
            connectMain({
                "key": "getCookie",
                "csrftoken": csrftoken
            })
            clearInterval(dingshi);
        }
    }, 3000)
})

// var zhanghao = "15863019860"; //15863019860 青岛，13791396353 烟台
// var region = "";  //532 青岛  ，535 烟台 , 空 全部
// var pageSize = "1000"; //每页数据条数
// var status = "";  // 0 待归档， 1 成功， 2 失败，3 回退 ，空 全部
// var csrftoken = JSON.parse(localStorage.selfservice_csrftoken).data;
// var arrTmp = [];
// var dataTmp = [];
// var dataTmp2 = "";
// var limitpage = 10;
// var startPage = 1;
// var qryPage = startPage;

// getDate(startPage);

// function fixDate(arrTmp) {
//     for (var i = 0; i < arrTmp.length; i++) {
//         var objTmp = {
//             "createDate": arrTmp[i].createDate,
//             "masterPort": arrTmp[i].masterPort,
//             "subPort": arrTmp[i].subPort,
//             "portUnitName": arrTmp[i].portUnitName,
//             "corpSign": arrTmp[i].corpSign,
//             "region": arrTmp[i].region,
//             "accessCity": arrTmp[i].accessCity,
//             "status":arrTmp[i].status
//         }
//         dataTmp.push(objTmp);
//     }
//     console.log(dataTmp);
// }

// function fixDate2(arrTmp) {
//     for (var i = 0; i < arrTmp.length; i++) {
//         var strTmp =
//             arrTmp[i].createDate + "," +
//             arrTmp[i].masterPort + "," +
//             arrTmp[i].subPort + "," +
//             arrTmp[i].portUnitName + "," +
//             arrTmp[i].corpSign + "," +
//             arrTmp[i].region + "," +
//             arrTmp[i].accessCity + "," +
//             arrTmp[i].status;
//         dataTmp2 += strTmp + "\r\n";
//     }
//     console.log(dataTmp2);
// }


// function getDate(qryPage) {

//     fetch("https://www.sd.10086.cn/esopappservice/commonService/openEbus/commonTransRequest?method=QryGrpMASPortRealName", {
//         "headers": {
//             "accept": "application/json, text/plain, */*",
//             "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//             "callinfotoken": "5e04710397e82775e35d3d55e9f9e180434ed7a81c61a14a65f146e49311459205a8b7ffa5c0d2beb5790494bb8a7cc010d420a6eec453d54b198632a7969ea43d71843432cd325d41b8d593eebedd953931c77d0db25b0d8519b82e63120db58c33d22cfa665a6c42de547578c41a52f08dc481e85ce5e4b09899b600d5c50039fcfe26f3def894f1820c451c28d68c3fb795162a7cdcd89b62fe30290213237aa45ab5d2a18923d665e43acd43414ff2",
//             "content-type": "application/json;charset=UTF-8",
//             "csrftoken": csrftoken,
//             "region": region,
//             "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "\"Windows\"",
//             "sec-fetch-dest": "empty",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-origin",
//             "Referer": "https://www.sd.10086.cn/newesopcentralapp/v2/",
//             "Referrer-Policy": "strict-origin-when-cross-origin"
//         },
//         "body": "{\"inParams\":{\"groupId\":\"\",\"region\":\""
//             + region + "\",\"masterPort\":\"\",\"subPort\":\"\",\"portUnitName\":\"\",\"groupSign\":\"\",\"submitUnit\":\"\",\"status\":\""
//             + status + "\",\"operid\":\"000000yd\",\"qryType\":\"\",\"qryByOperRight\":\"\",\"agentCreateTel\":\""
//             + zhanghao +"\",\"qryPage\":"
//             + qryPage + ",\"pageSize\":"
//             + pageSize + "},\"toRegion\":\""
//             + region + "\",\"strRegion\":\""
//             + region + "\"}",
//         "method": "POST"
//     }).then(function (s) {
//         console.log(s.json().then(function (s) {
//             console.log("qryPage:" + qryPage);
//             console.log("请右键点击下方变量，选择 复制object");
//             console.log(s);

//             if (s.retCode == 0) {
//                 arrTmp = s.result.realNameList;
//                 fixDate2(arrTmp);
//                 if (qryPage * pageSize >= s.result.resultSize || qryPage >= limitpage) {
//                     console.log("fin" + qryPage);
//                 } else {
//                     qryPage++;
//                     getDate(qryPage);
//                 }
//             } else {
//                 console.log("error" + s.retMsg);
//             }
//         }, function (e) { }))
//     }, function (e) { })
// }



// function fixDate2(arrTmp) {
//     for (var i = 0; i < arrTmp.length; i++) {
// 	var jsonTmp = JSON.parse(arrTmp[i].adddata1);
//         var strTmp =
//             arrTmp[i].statusDate + "," +
//             jsonTmp.masterPort + "," +
//             jsonTmp.subPort + "," +
//             jsonTmp.portUnitName + "," +
//             jsonTmp.corpSign + "," +
//             jsonTmp.accessCity + "," +
//             arrTmp[i].status + "," +
// 			arrTmp[i].remark;
//         dataTmp2 += strTmp + "\r\n";
//     }
//     console.log(dataTmp2);
// }
// var dataTmp2 = ""
// fixDate2(temp1.memTaskList);

// var data = temp1; //将temp1改为存储到本地的变量名
// var dataTmp2 = "";
// fixDate2(temp1.memTaskList);

// function fixDate2(arrTmp) {
//     for (var i = 0; i < arrTmp.length; i++) {
// 	var jsonTmp = JSON.parse(arrTmp[i].adddata1);
//         var strTmp =
//             arrTmp[i].statusDate + "\t" +
//             jsonTmp.masterPort + "\t" +
//             +"=\""+jsonTmp.subPort +"\"" + "\t" +
//             jsonTmp.portUnitName + "\t" +
//             jsonTmp.corpSign + "\t" +
//             jsonTmp.accessCity + "\t" +
//             arrTmp[i].status + "\t" +
// 			arrTmp[i].remark;
//         dataTmp2 += strTmp + "\r\n";
//     }
//     console.log(dataTmp2);
// }

