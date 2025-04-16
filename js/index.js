//读写文件
var fs = require('fs');
//http请求
var request = require('request');
//读写excel
var xlsx = require('node-xlsx');
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path');
const { app, shell } = require('electron');

const node_serve_path = process.cwd(); //项目路径
// const http = require('http');

// const server = http.createServer((req, res) => {
//     console.log(req)
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// });

// const PORT = 3333;
// server.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}/`);
// });




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
    if(msg.csrftoken && msg.loginToken){
        $("#csrftoken").val(msg.csrftoken);
        $("#loginToken").val(msg.loginToken);
        alert("登陆成功");
    }
})


//初始化文件上传区域
function initFileHolder() {
    //文件上传区域
    var holder = document.getElementById('holder');
    if (holder) {
        holder.ondragover = function () {
            return false;
        }
        holder.ondragleave = holder.ondragend = function () {
            return false;
        }
        holder.ondrop = function (e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var fileExname = file.name.split(".")[file.name.split(".").length - 1];
            if (fileExname === "xls" || fileExname === "xlsx") {
                // 读xlsx
                var obj = xlsx.parse(file.path);
                console.log(file);
                console.log(obj);
                dataArrO = obj[0].data;
                if (window.location.href.indexOf("pic.html") > 0) {
                    $('#holder textarea').val(jsonToCsvforPic(obj[0].data));
                } else {
                    $('#holder textarea').val(jsonToCsv(obj[0].data));
                }
            } else if (fileExname === "csv") {
                fs.readFile(file.path, 'utf8', function (err, data) {
                    $('#holder textarea').val(data);
                });
            } else {
                alert(文件格式必须为csv或excel文件);
            }
            return false;
        }
    }
}

function jsonToCsv(arr) {
    var strTmp = "";
    for (var i = 0; i < arr.length; i++) {
        strTmp += fixCsvString(arr[i][0]);
        for (var j = 1; j < arr[i].length; j++) {
            strTmp += ("," + fixCsvString(arr[i][j]));
        }
        strTmp += "\r\n";
    }
    return strTmp;
}

function fixCsvString(str) {
    if (typeof (str) == "string") {
        str = str.replace(/,/g, "，");
        str = str.replace(/\r\n/g, " ");
        str = str.replace(/\n/g, " ");
        str = str.trim();
    }
    return str;
}

function jsonToCsvforPic(arr) {
    var strTmp = "";
    for (var i = 0; i < arr.length; i++) {
        //strTmp += arr[i][0];
        // for (var j = 1; j < arr[i].length; j++) {
        //     strTmp += ("," + fixCsvString(arr[i][j]));
        // }
        //var s = arr[i][82].match(/http:\/\/.*?(gif|png|jpg)/gi);
        var s = arr[i][82].match(/http.*?(\"|\s)/gi);
        if (s && s.length > 0) {
            for (var j = 0; j < s.length; j++) {
                s[j] = s[j].trim().replace('"', '');
                if (s[j].indexOf("weichongyi2019.g2work.com") < 0
                    &&
                    s[j].indexOf("mmbiz.qpic.cn/mmbiz_jpg") < 0
                    &&
                    s[j].indexOf("e-vet.cn") < 0
                    &&
                    s[j].indexOf("e-vet.cn") < 0
                    &&
                    s[j].indexOf("localhost") < 0) {
                    strTmp += arr[i][0] + (j > 0 ? ("_" + j) : "") + "," + fixCsvString(s[j]);
                    strTmp += "\r\n";
                }
            }
        }
        // strTmp += "\r\n";
    }
    if (strTmp == "") {
        strTmp = "无"
    }
    return strTmp;
}

$(function () {
    initFileHolder();
}
);