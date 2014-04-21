var BandListProcessor = require('./processors/bandlist.js');
var Downloader = require('./utils/downloader.js');

var bands = 0;
var bandListProcessor = new BandListProcessor();
bandListProcessor.on('parse', function(band) {
  bands = bands + 1;
  console.log(band.name);
  console.log('bands: ' + bands);
});

var downloader = new Downloader();
downloader.on('bandListDownloaded', function(rawHtml) {
  console.log('bandList downloaded');
  bandListProcessor.process(rawHtml);
});

var totalBandPages = 2; // todo
for(var page = 1; page <= totalBandPages; page++) {
  downloader.downloadBandList(page);
}
