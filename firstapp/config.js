require("dotenv").config();
const path = require('path');

const basePath = path.resolve(__dirname);
const dbPath = path.join(basePath, 'db');

let config = {
    path: {
        base: basePath,
        db: dbPath,
    },
    db: {
        fullPath: path.resolve(dbPath, process.env.DB_FILE || 'database.sqlite'),
    }
};

module.exports = config;