var request = require('request');
var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

function Downloader() {
  var self = this;
  EventEmitter.call(self);

  var bandListBaseUrl = 'http://metalstorm.net/bands/index.php?page=';

  self.downloadBandList = function(pageNumber) {
    util.puts('downloading band page ' + pageNumber);
    request(bandListBaseUrl + pageNumber, function(error, response, html) {
      if(error)
        throw error;
      self.emit('bandListDownloaded', html);
    });
  };
}

util.inherits(Downloader, EventEmitter);
module.exports = Downloader;
