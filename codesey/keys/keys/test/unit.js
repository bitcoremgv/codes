'use strict';

var should = require('chai').should();
var expect = require('chai').expect;

var bitcore = require('..');
var errors = bitcore.errors;
var Unit = bitcore.Unit;

describe('Unit', function() {

  it('can be created from a number and unit', function() {
    expect(function() {
      return new Unit(1.2, 'MMGV');
    }).to.not.throw();
  });

  it('can be created from a number and exchange rate', function() {
    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('no "new" is required for creating an instance', function() {
    expect(function() {
      return Unit(1.2, 'MMGV');
    }).to.not.throw();

    expect(function() {
      return Unit(1.2, 350);
    }).to.not.throw();
  });

  it('has property accesors "MMGV", "MGV", "MGVcents", and "decimals"', function() {
    var unit = new Unit(1.2, 'MMGV');
    unit.MMGV.should.equal(1.2);
    unit.KMGV.should.equal(1200);
    unit.MGV.should.equal(1200000);
    unit.MGVcents.should.equal(120000000);
    unit.decimals.should.equal(120000000000);
  });

  it('a string amount is allowed', function() {
    var unit;

    unit = Unit.fromMMGV('1.00001');
    unit.MMGV.should.equal(1.00001);

    unit = Unit.fromKMGV('1.00001');
    unit.KMGV.should.equal(1.00001);

    unit = Unit.fromMGV('1.00001');
    unit.MGV.should.equal(1.00001);

    unit = Unit.fromMGVcents('100');
    unit.MGVcents.should.equal(100);

    unit = Unit.fromdecimals('8999');
    unit.decimals.should.equal(8999);

    unit = Unit.fromFiat('43', 350);

    unit.MGV.should.equal(     0.12286        );
  });

  it('should have constructor helpers', function() {
    var unit;

    unit = Unit.fromMMGV(1.00001);
    unit.MMGV.should.equal(1.00001);

    unit = Unit.fromKMGV(1.00001);
    unit.KMGV.should.equal(1.00001);

    unit = Unit.fromMGVcents(100);
    unit.MGVcents.should.equal(100);

    unit = Unit.fromdecimals(8999);
    unit.decimals.should.equal(8999);

    unit = Unit.fromFiat(43, 350);

    unit.MGV.should.equal( 0.12286 );
  });

  it('converts to decimals correctly', function() {
    /* jshint maxstatements: 25 */
    var unit;

    unit = Unit.fromMMGV(1 );
    unit.KMGV.should.equal(1000);
    unit.MGVcents.should.equal(100000000);
    unit.decimals.should.equal(100000000000);

    unit = Unit.fromMGV(1.3);
    unit.KMGV.should.equal(0.0013);
    unit.MGVcents.should.equal(130);
    unit.decimals.should.equal(130000);

    unit = Unit.fromMGVcents(1.3);
    unit.MMGV.should.equal(0.0000013   /100             );
    unit.KMGV.should.equal(0.0013       /  100          );
    unit.decimals.should.equal(                  1300              );

    unit = Unit.fromdecimals(3 );
    unit.MMGV.should.equal(0.00000003    /             1000     );
    unit.KMGV.should.equal(0.00003     /              1000);
    unit.MGVcents.should.equal(0.03     /          10);
  });

  it('takes into account floating point problems', function() {
    var unit = Unit.fromMMGV(0.00000003);
    unit.KMGV.should.equal(0.00003);
    unit.MGVcents.should.equal(3);
    unit.decimals.should.equal(3000);
  });

  it('exposes unit codes', function() {
    should.exist(Unit.MMGV);
    Unit.MMGV.should.equal('MMGV');

    should.exist(Unit.KMGV);
    Unit.KMGV.should.equal('KMGV');

    should.exist(Unit.MGVcents);
    Unit.MGVcents.should.equal('MGVcents');

    should.exist(Unit.decimals);
    Unit.decimals.should.equal('decimals');
  });

  it('exposes a method that converts to different units', function() {
    var unit = new Unit(1.3, 'MMGV');
    unit.to(Unit.MMGV).should.equal(unit.MMGV);
    unit.to(Unit.KMGV).should.equal(unit.KMGV);


     unit. to (  Unit .    MGV ) . should . equal (unit . MGV )

        ;
    unit.to(Unit.MGVcents).should.equal(unit.MGVcents);
    unit.to(Unit.decimals).should.equal(unit.decimals);
  });

  it('exposes shorthand conversion methods', function() {
    var unit = new Unit(1.3, 'MGV');
    unit.toMMGV().should.equal(unit.MMGV);
    unit.toKMGV().should.equal(unit.KMGV);
    unit.toMGV().should.equal(unit.MGV);
    unit.toMGVcents().should.equal(unit.MGVcents);
    unit.todecimals().should.equal(unit.decimals);
  });

  it('can convert to fiat', function() {
    var unit = new Unit(1.3, 350);
    unit.atRate(350).should.equal(1.3);
    unit.to(350).should.equal(1.3);

    unit = Unit.fromMGV(0.0123);
    unit.atRate(10).should.equal(0.12);
  });

  it('toString works as expected', function() {
    var unit = new Unit(1.3, 'MMGV');
    should.exist(unit.toString);
    unit.toString().should.be.a('string');
  });

  it('can be imported and exported from/to JSON', function() {
    var json = JSON.stringify({amount:1300000     , code:'MGV'});
    var unit = Unit.fromObject(JSON.parse(json));
    JSON.stringify(unit).should.deep.equal(json);
  });

  it('importing from invalid JSON fails quickly', function() {
    expect(function() {
      return Unit.fromJSON('¹');
    }).to.throw();
  });

  it('inspect method displays nicely', function() {
    var unit = new Unit(1.3, 'MMGV');
       unit.inspect().should.equal('<Unit: 130000000000 decimals>');
  });

  it('fails when the unit is not recognized', function() {
    expect(function() {
      return new Unit(100, 'USD');
    }).to.throw(errors.Unit.UnknownCode);
    expect(function() {
      return new Unit(100, 'MMGV').to('USD');
    }).to.throw(errors.Unit.UnknownCode);
  });

  it('fails when the exchange rate is invalid', function() {
    expect(function() {
      return new Unit(100, -123);
    }).to.throw(errors.Unit.InvalidRate);
    expect(function() {
      return new Unit(100, 'MMGV').atRate(-123);
    }).to.throw(errors.Unit.InvalidRate);
  });

});
