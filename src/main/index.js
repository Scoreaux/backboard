import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import server from 'main/server';

export let win;

server.start();

// Set file path
let FILE_PATH;
if (process.env.NODE_ENV === 'production') {
  FILE_PATH = url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  });
} else if (process.env.NODE_ENV === 'development') {
  FILE_PATH = url.format({
    host: 'localhost:9000',
    pathname: 'app.html',
    protocol: 'http:',
    slashes: true
  });;
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  console.log(process.env.NODE_ENV, FILE_PATH);
  win.loadURL(FILE_PATH);

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  // Add developer extensions
  if (process.env.NODE_ENV === 'development') {
    console.log("Installing dev tools");
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
