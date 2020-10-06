var mysql = require("mysql");

var conn = mysql.createConnection({
    host: "localhost",
    user: "glido",
    password: "glido",
    database: "glido",
    multipleStatements: true
});

conn.connect((err)=>{
    if (!err){
        console.log('Connected.');
    }
    else {
        throw err;
    }
});

module.exports = conn;