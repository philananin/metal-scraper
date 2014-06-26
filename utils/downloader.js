var request = require('request');
var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

function Downloader() {
  var self = this;
  EventEmitter.call(self);

  var bandListBaseUrl = 'http://metalstorm.net/bands/index.php?page=';
  var bandBaseUrl = 'http://metalstorm.net/bands/band.php?band_id=';
  var albumBaseUrl = 'http://www.metalstorm.net/bands/album.php?album_id=';

  self.downloadBandList = function(pageNumber) {
    request(bandListBaseUrl + pageNumber, function(error, response, html) {
      if(error)
        throw error;
      self.emit('bandListDownloaded', html);
    });
  };

  self.downloadBand = function(bandId) {
    request(bandBaseUrl + bandId, function(error, response, html) {
      if(error)
        throw error;
      self.emit('bandDownloaded', html);
    });
  };

  self.downloadAlbum = function(albumId) {
    request(albumBaseUrl + albumId, function(error, respose, html) {
      if(error)
        throw error;
      self.emit('albumDownloaded', html);
    });
  };
}

util.inherits(Downloader, EventEmitter);
module.exports = Downloader;
