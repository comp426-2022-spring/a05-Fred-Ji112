// Put your database code here
"use strict";

const Database = require("better-sqlite3");

const db = new Database('log.db');

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`);

let row = stmt.get();

if(row === undefined) {
    console.log('Your database appears to be empty. I will initialize it now.');

    const sqlInit = `
        CREATE TABLE accesslog (
            id INTEGER PRIMARY KEY,
            remoteaddr TEXT,
            remoteuser TEXT,
            time INTEGER,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            secure TEXT,
            status INTEGER,
            referer TEXT,
            useragent TEXT
        );
    `;

    db.exec(sqlInit);

    console.log('New Table Added to Database.');
    
} else {
    console.log('Database exists.');
}

module.exports = db;