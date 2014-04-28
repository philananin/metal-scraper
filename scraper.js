var util = require('util');
var BandListProcessor = require('./processors/bandlist.js');
var BandProcessor = require('./processors/band.js');
var Downloader = require('./utils/downloader.js');

var done = false; // i don't want to spam the site for now, so just download one band
var bandListProcessor = new BandListProcessor();
bandListProcessor.on('parse', function(band) {
  if(!done) {
    downloader.downloadBand(band.id);
    done = true;
  }
});

var bandProcessor = new BandProcessor();
bandProcessor.on('parse', function(bandDetails) {
  util.puts(bandDetails.name);
  bandDetails.genres.forEach(function(genre) {
    util.puts('main: ' + genre.main + ', prefix: ' + genre.prefix);
  });
});

var downloader = new Downloader();
downloader.on('bandListDownloaded', function(rawHtml) {
  bandListProcessor.process(rawHtml);
});
downloader.on('bandDownloaded', function(rawHtml) {
  bandProcessor.process(rawHtml);
});

var totalBandPages = 1; // todo
for(var page = 1; page <= totalBandPages; page++) {
  downloader.downloadBandList(page);
}
