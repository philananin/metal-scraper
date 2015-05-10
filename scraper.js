var util = require('util');
var Promise = require('bluebird');
var db = require('./data/db');
var BandListProcessor = require('./processors/bandlist');
var BandProcessor = require('./processors/band');
var AlbumProcessor = require('./processors/album');
var Downloader = require('./utils/downloader');

Promise.using(db.getConnection(), function(connection) {
  var done = false; // i don't want to spam the site for now, so just download one band

  var bandListProcessor = new BandListProcessor();
  bandListProcessor.on('parse', function(band) {
    if(!done) {
      downloader.downloadBand(band.id);
      done = true;
    }
  });

  var bandProcessor = new BandProcessor();
  bandProcessor.on('parse', function(band) {
    db.writeBand(connection, band);
    band.albums.forEach(function(album) {
      downloader.downloadAlbum(album.id);
    });
  });

  var albumProcessor = new AlbumProcessor();
  albumProcessor.on('parse', function(album) {
    db.writeAlbum(connection, album);
  });

  var downloader = new Downloader();
  downloader.on('bandListDownloaded', function(rawHtml) {
    bandListProcessor.process(rawHtml);
  });
  downloader.on('bandDownloaded', function(rawHtml) {
    bandProcessor.process(rawHtml);
  });
  downloader.on('albumDownloaded', function(rawHtml) {
    albumProcessor.process(rawHtml);
  });

  var downloadBands = function() {
    var totalBandPages = 1; // todo
    for(var page = 1; page <= totalBandPages; page++) {
      downloader.downloadBandList(page);
    }
  };

  // presumably there is a nicer way of stopping the finally block executing early...
  var downloadBandsAsync = Promise.promisify(downloadBands);
  return downloadBandsAsync();
}).finally(process.exit);
