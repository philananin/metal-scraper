var r = require('rethinkdb');
var Promise = require('bluebird');
var config = require('../config');
var db = require('./db');

var tables = ['band', 'album'];

console.log('connecting to ' + JSON.stringify(config.rdb));

Promise.using(db.getConnection(), function(connection) {
  return createDatabase(connection)
  .bind({conn: connection})
  .then(createTables)
  .catch(console.error);
}).finally(process.exit);

function createDatabase(conn) {
  console.log('creating database:', config.rdb.db);
  return r.dbCreate(config.rdb.db).run(conn);
}

function createTables() {
  var conn = this.conn;
  var promises = [];
  tables.forEach(function(table) {
    console.log('creating table:', table);
    promises.push(r.db(config.rdb.db).tableCreate(table).run(conn));
  });
  return Promise.all(promises);
}
