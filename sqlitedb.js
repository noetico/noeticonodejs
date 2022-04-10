var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
let sqlitedb = new sqlite3.Database('./sdb.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    runQueries(sqlitedb);
});
function createDatabase() {
    var newdb = new sqlite3.Database('sdb.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
    create table tokenkeys (
        id int primary key autoincrement not null,
        tokenkey text not null,
        date text null,
        days text null
    );`, ()  => {
            runQueries(newdb);
    });
}
function runQueries(sqlitedb) {
    sqlitedb.all(`SELECT tokenkey FROM tokenkeys 
	ORDER BY id DESC LIMIT 1 `, (err, rows) => {
        
    });
}

module.exports = router;
