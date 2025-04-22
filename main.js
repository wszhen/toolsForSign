const electron = require('electron')
const path = require('path')
const { app } = electron
const { BrowserWindow } = electron
const ipcMain = require('electron').ipcMain;
const Menu = electron.Menu

const { webContents } = require('electron')


//const { app, BrowserWindow, ipcMain } = require('electron')
//读写文件
var fs = require('fs');


// In your main process file (e.g. main.js or index.js)
// const { contextBridge, ipcRenderer } = require('electron');
// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: {
//     myCustomFunction: () => ipcRenderer.sendSync('my-custom-channel', someData),
//     // ... expose other functions if needed
//   }
// });
// Then in your preload script:
// const electron = window.electron;
// electron.ipcRenderer.myCustomFunction();


let win = null;
let winSub = null;

ipcMain.on('getMsg', (event, msg) => {
  if (msg === "opendebug") {
    win.webContents.openDevTools();
  }
  if (msg === "haibao") {
    win.loadURL(`file://${__dirname}/haibao.html`);
  }
  if (msg === "email") {
    win.loadURL(`file://${__dirname}/email.html`);
  }
  if (msg === "pic") {
    win.loadURL(`file://${__dirname}/pic.html`);
  }
  if (msg === "datafix") {
    win.loadURL(`file://${__dirname}/datafix.html`);
  }
  if (msg === "openWinSub") {
    initWindowSub("https://ecloud.sd.chinamobile.com/");
  }
  if (msg.key && msg.key == "getCookie") {
    // var webContentsArr = webContents.getAllWebContents();
    // webContentsArr.forEach(function(c){
    //   //const cookies = c.session.cookies.get({},function(){});
    //   const cookies = c.session;
    //   event.sender.send('getMsg-reply', cookies);
    // })
    if (winSub) {
      const ses = winSub.webContents.session;
      const wc = win.webContents;
      const cookies = ses.cookies.get({}, function (error, cookies) {
        if(cookies){
          console.log("cookie:" + cookies.map(item => `${item.name}=${item.value};`).join(' '));
          //event.sender.send('getMsg-reply', cookies)//在main process里向web page发出message

          // const cookie2 = cookies.map(item => `${item.name}=${item.value};`).join(' ');
          // ses2.cookies.set(cookies.map(item => `${item.name}=${item.value};`).join(' '), function (err, cookies) {
          //   console.log("dasdd:" + cookies);
          // });
          console.log("111:" + cookies);
          var loginToken = cookies.filter(item => item.name == "loginToken")
          if(loginToken.length > 0){
            loginToken = loginToken[0].value;
            wc.send('getMsg-reply', {
              "csrftoken": msg.csrftoken,
              "loginToken": loginToken,
            });
            //wc.send('getMsg-reply', cookies);
          }
        }
      });
      // //event.sender.send('getMsg-reply', cookies)//在main process里向web page发出message
      // const cookie = { url: 'https://www.electronjs.org', name: 'dummy_name', value: 'dummy' };
      // ses2.cookies.set(cookie, function (err, cookies) {
      //   console.log("dasdd:" + cookies);
      // });
    }
  }
})
app.on('ready', initWindow)

app.on('window-all-cloased', () => {
  console.log(process.platform)
  if (process.platform !== 'drawin') {
    app.quit()
  }
})


app.on('activate', () => {
  if (win === null) {
    initWindow();
  }
})




function initWindow() {
  //win = new BrowserWindow({ width: 1100, height: 750 });

  win = new BrowserWindow({
    width: 1100,
    height: 750,
    //show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      //preload: `${__dirname}/preload.js`
    },
    webSecurity: false,
    //frame:false,
    // fullscreen:true,
  });
  // win.loadURL(`file://${__dirname}/email2024.html`);
  win.loadURL(`file://${__dirname}/sign.html`);
  // win.webContents.openDevTools();

  //win.webContents.userAgent = 'MyCustomUserAgent';
  console.log("ok:");
  /*electron的菜单栏*/
  //Menu.setApplicationMenu(Menu)

  win.webContents.session.on('will-download', (event, item, webContents) => {
    // 设置保存路径,使Electron不提示保存对话框。
    item.setSavePath('download/' + item.getFilename());

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully');
      } else {
        console.log(`Download failed: ${state}`);
      }
    })
  })

  win.on('close', () => {
    win = null
  })
  win.on('resize', () => {
    //win.reload()
  })

  win.on('closed', () => {
    win = null
    app.quit();
  })

  try {
    //console.log("11")
    exitsFolder("download");
  } catch (e) {
    //throw Error(e.msg);
    console.log(e)
  }
}

function initWindowSub(_url) {
  //win = new BrowserWindow({ width: 1100, height: 750 });
  console.log("https://ecloud.sd.chinamobile.com/ok:");
  winSub = new BrowserWindow({
    width: 1100,
    height: 750,
    //show: false,
    webPreferences: {
      nodeIntegration: true,
      //contextIsolation: false,
      preload: `${__dirname}/preload.js`
    },
    webSecurity: false,
    //frame:false,
    // fullscreen:true,
  });
  // win.loadURL(`file://${__dirname}/email2024.html`);
  winSub.loadURL(_url);
  //winSub.webContents.openDevTools();


  // 并且为新窗口设置监听器
  winSub.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    // 阻止默认的行为（即打开新窗口）
    event.preventDefault();
    // 这里可以自定义打开新窗口的逻辑，例如：
    // 打开系统的默认浏览器
    // const { shell } = require('electron');
    // shell.openExternal(url);
    winSub.loadURL(url);
  });
  //const ses = winSub.webContents.session;

  //win.webContents.userAgent = 'MyCustomUserAgent';
  console.log("https://ecloud.sd.chinamobile.com/ok:");
  /*electron的菜单栏*/
  //Menu.setApplicationMenu(Menu)

  winSub.on('close', () => {
    winSub = null
  })
  winSub.on('resize', () => {
    //winSub.reload()
  })

  winSub.on('closed', () => {
    winSub = null
    //app.quit();
  })
}

exitsFolder = async function (reaPath) {
  const absPath = path.resolve('', reaPath);
  //console.log("创建文件夹：" + reaPath);
  fs.stat(absPath, function (err, stats) {
    if (!stats) {
      console.log("创建文件夹：" + reaPath);
      fs.mkdir(absPath, { recursive: true }, err => {
        if (err) throw err;
      }); //Create dir in case not found
    }
  });

}

module.exports = { exitsFolder }
