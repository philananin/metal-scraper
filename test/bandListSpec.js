var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var BandList = require('../processors/bandlist.js');

describe('BandList', function() {
  var html = fs.readFileSync('test/bandlist.html', {encoding: 'utf-8'});
  var bandList;

  beforeEach(function() {
    bandList = new BandList();
  });

  describe('process', function() {
    it('extracts the expected list', function(done) {
      var expectedList = [{
        name: 'Iron Maiden',
        url: 'band.php?band_id=60',
        id: '60'
      },{
        name: 'Opeth',
        url: 'band.php?band_id=13',
        id: '13'
      },{
        name: 'Metallica',
        url: 'band.php?band_id=176',
        id: '176'
      },{
        name: 'Megadeth',
        url: 'band.php?band_id=163',
        id: '163'
      },{
        name: 'Amon Amarth',
        url: 'band.php?band_id=25',
        id: '25'
      }];
      
      var actualList = [];

      bandList.on('parse', function(bandDetails) {
        actualList.push(bandDetails);
      });

      bandList.on('done', function() {
        expect(actualList).to.deep.equal(expectedList);
        done();
      });

      bandList.process(html);
    });
  });
});
