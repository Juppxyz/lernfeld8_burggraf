const { app, BrowserWindow, ipcMain, dialog }   = require('electron');
const path                                     = require('path');
const {getConfigData}                          = require("./configHandler");
const {getConnection}                          = require("./databaseHandler");
if (require('electron-squirrel-startup')) app.quit();


const sendSQLQuery = async (query) => {
  return new Promise(async resolve => {
    const con = await getConnection();
    con.query(query, (err, rows) => {
      if(err) {
        console.log("Es ist ein Fehler aufgetreten beim Ausführen der Abfrage");
        return resolve(false);
      }
      console.log("rows",rows)
      return resolve(rows);
    });
  })
}



// ipc handler
ipcMain.handle("database-data-channel", async (event, args) => {
  // stellt eine Verbindung zu der Datenbank sicher
  const database = await getConnection();
  if (!database) return {error: "Fehler bei der Verbindung der Datenbank!"}
  if (args.length < 1) return {error: "Keine Argumente"}
  const action = args;
  let data = null;
  console.log("args", args)
  if (action === 'Alle-Kunde') {
    data = await sendSQLQuery("SELECT * FROM Kunden;");
  } else if (action.endsWith("-Kunde")) {
    data = await sendSQLQuery(`SELECT * FROM Kunden WHERE Name LIKE '%${action.split("-")[0]}%';`);
  } else if (action === 'Alle-Produkt') {
    data = await sendSQLQuery("SELECT * FROM Produkte;");
  } else if (action.endsWith(`-Produkt`)) {
    data = await sendSQLQuery(`SELECT * FROM Produkte WHERE Produktname LIKE '%${args.split("-")[0]}%';`);
  }

  console.log(data)
  return {data:data};
});

/*
*             window.api.getLoginUsage((this.props.type === "Anmelden" ? "login" : "register") + " " + username + " " + password).then(data => {

                if (data.token!==null) {
                    this.setState({infoText: ""});
                    console.log("updated token", data.token)
                    this.props.updateToken(data.token);
                    this.props.updateConfig(data);
                    return;
                }

                if(data.info) {
                    this.setState({infoText: data.info})
                }else {
                    this.setState({infoText: "Das hat leider nicht funktioniert."});
                }

            });
*
* */


const createWindow = async () => {
  // ladet die Konfigurationsdatei, welche für die MySQL-Verbindung notwendig ist.
  const config = getConfigData();
  if (config.error !== null) {
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Fehler!',
      message: config.error
    })
    app.quit()
  }

  // erstelle das Fenster Objekt
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));
  mainWindow.webContents.openDevTools();
};


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

