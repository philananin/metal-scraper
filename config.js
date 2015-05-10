var config = {};

config.rdb = {
    host: process.env.RDB_HOST || 'localhost',
    port: process.env.RDB_PORT || 28015,
    db: process.env.RDB_DB || 'metal'
};

module.exports = config;
