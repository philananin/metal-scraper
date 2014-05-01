var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var BandProcessor = require('../processors/band.js');

describe('BandProcessor', function() {
  var html = fs.readFileSync('test/periphery.html', {encoding: 'utf-8'});
  var bandProcessor;

  beforeEach(function() {
    bandProcessor = new BandProcessor();
  });

  describe('process', function() {
    it('extracts the correct band name and id', function(done) {
      bandProcessor.on('parse', function(bandDetails) {
        expect(bandDetails.name).to.equal('Periphery');
        expect(bandDetails.id).to.equal('5269');
        done();
      });
      bandProcessor.process(html);
    });

    it('extracts the correct genres', function(done) {
      var expectedGenres = [{
        fullName: 'Progressive metal',
        main: 'Progressive',
        prefix: '',
        startYear: '2005',
        endYear: ''
      }, {
        fullName: 'Math metal',
        main: 'Math',
        prefix: '',
        startYear: '2005',
        endYear: ''
      }, {
        fullName: 'Djent',
        main: '',
        prefix: 'Djent',
        startYear: '2005',
        endYear: ''
      }];

      bandProcessor.on('parse', function(bandDetails) {
        expect(bandDetails.genres).to.deep.equal(expectedGenres);
        done();
      });
      bandProcessor.process(html);
    });
  });
});
