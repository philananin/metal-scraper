var r = require('rethinkdb');
var Promise = require('bluebird');
var util = require('util');
var config = require('../config');

function getConnection() {
  return r.connect({
    host: config.rdb.host,
    port: config.rdb.port,
    db: config.rdb.db
  }).disposer(function(conn) {
    console.log('connection closed');
    conn.close();
  });
}

function writeBand(conn, band) {
  console.log('band: ' + band.name + ', id: ' + band.id);
  band.genres.forEach(function(genre) {
    console.log(util.format('genre: %s, prefix: %s, start: %s, end: %s',
                            genre.main, genre.prefix, genre.startYear,
                            genre.endYear));
  });
  r.db('metal').table('band').insert(band, {conflict: 'replace'}).run(conn);
}

function writeAlbum(conn, album) {
  console.log(util.format('album name: %s, id: %s, rating: %s (%s votes)',
                          album.name, album.id, album.rating.value,
                          album.rating.votes));
  r.db('metal').table('album').insert(album, {conflict: 'replace'}).run(conn);
}

module.exports = {
  getConnection: getConnection,
  writeBand: writeBand,
  writeAlbum: writeAlbum
};
