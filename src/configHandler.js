const fs = require("fs");
const {dialog, app} = require("electron");

let configData = null;

const loadConfigData = () => {
    if (!configData) {
        let rawData = null;
        try {
            rawData = fs.readFileSync(`config.json`);
        } catch (e) {
            console.log("config file not found")
            return {error: "Die Config-Datei konnte nicht gefunden werden! Die Datei muss 'config.json' lauten und im selben Ordner liegen."};
        }
        let json = null;
        try {
            json = JSON.parse(rawData.toString());
            json["error"] = null;
            configData = json;
        } catch (e) {
            console.log("invalid config file")
            return {error: "Ungültiges Config-Format! Die Config muss ein gültiges JSON Format haben."};
        }
    }
    return configData;
}

const getConfigData = () => {
    if (!configData) {
        configData = loadConfigData();
    }
    return configData;
}

module.exports = {getConfigData};