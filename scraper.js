var util = require('util');
var BandListProcessor = require('./processors/bandlist.js');
var BandProcessor = require('./processors/band.js');
var Downloader = require('./utils/downloader.js');

var bandListProcessor = new BandListProcessor();
bandListProcessor.on('parse', function(band) {
  downloader.downloadBand(band.id);
});

var bandProcessor = new BandProcessor();
bandProcessor.on('parse', function(bandDetails) {
  util.puts(bandDetails.name);
});

var downloader = new Downloader();
downloader.on('bandListDownloaded', function(rawHtml) {
  bandListProcessor.process(rawHtml);
});
downloader.on('bandDownloaded', function(rawHtml) {
  bandProcessor.process(rawHtml);
});

var totalBandPages = 2; // todo
for(var page = 1; page <= totalBandPages; page++) {
  downloader.downloadBandList(page);
}
