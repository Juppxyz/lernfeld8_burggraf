const mysql = require('mysql');
const {getConfigData} = require("./configHandler");

let connection = null;

const connectToDatabase = async () => {
    return new Promise(resolve => {
        connection.connect((err) => {
            if (err){
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
}

const getConnection = async () => {
    return new Promise(async resolve => {
        if (!connection) {
            connection = mysql.createConnection(getConfigData());
            const res = await connectToDatabase();
            if (!res) resolve(null)
        }
        resolve(connection);
    })
}

module.exports = {getConnection}