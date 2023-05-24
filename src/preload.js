// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("backend", {
    databaseData: (args) => ipcRenderer.invoke("database-data-channel", args),
});

