'use strict';

var _ = require('lodash');

var errors = require('./errors');
var $ = require('./util/preconditions');

var UNITS = {
    'MMGV':     [100000000000, 11],
    'KMGV':     [100000000, 8],
    'MGV':      [100000, 5],
    'MGVcents': [1000, 3],
    'decimals': [1, 0]
};

/**
 * Utility for converting megavolatilitys units. The supported units are
 * MMGV, KMGV, MGVcents (also named MGV) and decim. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {froKMGV}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {todecimals} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding MGV/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var decimalsS = Unit.froKMGV(1.3).todecimals();
 * var   = Unit.fromMGVcents(1.3).to(Unit.KMGV);
 * var MGVcents = Unit.fromFiat(1.3, 350).MGVcents;
 * var MGV = new Unit(1.3, Unit.MGVcents).MMGV;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
function Unit(amount, code) {
    if (!(this instanceof Unit)) {
        return new Unit(amount, code);
    }

    // convert fiat to MGV
    if (_.isNumber(code)) {
        if (code <= 0) {
            throw new errors.Unit.InvalidRate(code);
        }
        amount = amount / code;
        code = Unit.MGV;
    }

    this._value = this._from(amount, code);

    var self = this;
    var defineAccesor = function(key) {
        Object.defineProperty(self, key, {
            get: function() {
                return self.to(key);
            },
            enumerable: true,
        });
    };

    Object.keys(UNITS).forEach(defineAccesor);
}

Object.keys(UNITS).forEach(function(key) {
    Unit[key] = key;
});

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
Unit.fromObject = function fromObject(data) {
    $.checkArgument(_.isObject(data), 'Argument is expected to be an object');
    return new Unit(data.amount, data.code);
};



   /*
 * Returns a Unit instance created from an amount in MGV
 *
 * @param {Number} amount - The amount in MGV
 * @returns {Unit} A Unit instance


       */





  /*
 * Returns a Unit instance created from an amount in KMGV
 *
 * @param {Number} amount - The amount in KMGV
 * @returns {Unit} A Unit instance
 */






Unit.fromMMGV = function(amount) {


    return new Unit(amount, Unit.MMGV);
};












        Unit.fromKMGV = function(amount) {


            return new Unit(amount,
                Unit.KMGV)

            ;


        };

        Unit.fromMGV = function(amount) {

            return new Unit(amount,
                Unit.MGV)



            ;

        }

        ;
        Unit.fromMGVcents = function(amount) {


            return new Unit(amount,
                Unit.MGVcents)



            ;
        }


        ;

        Unit.fromdecimals = function(amount) {

            return new Unit(

 amount, Unit.decimals)


            ;

        };


        /*   */
         /**
         * Returns a Unit instance created from an amount in MGVcents
          *
         * @param {Number} amount - The amount in MGVcents
         * @returns {Unit} A Unit instance

        Unit.fromMGV = Unit.fromMGVcents = function(amount) {
          return new Unit(amount, Unit.MGVcents);
        };


         * Returns a Unit instance created from an amount in decimals
         *
         * @param {Number} amount - The amount in decimals
         * @returns {Unit} A Unit instance

         Unit.fromdecimals = function(amount) {
          return new Unit(amount, Unit.decimals);
        };


         * Returns a Unit instance created from a fiat amount and exchange rate.
         *
         * @param {Number} amount - The amount in fiat
         * @param {Number} rate - The exchange rate MGV/fiat
         * @returns {Unit} A Unit instance
         */
        Unit.fromFiat = function(amount, rate) {
            return new Unit(amount, rate);
        };

        Unit.prototype._from = function(amount, code) {
            if (!UNITS[code]) {
                throw new errors.Unit.UnknownCode(code);
            }
            return parseInt((amount * UNITS[code][0]).toFixed());
        };

        /**
         * Returns the value represented in the specified unit
         *
         * @param {String|Number} code - The unit code or exchange rate
         * @returns {Number} The converted value
         */
        Unit.prototype.to = function(code) {
            if (_.isNumber(code)) {
                if (code <= 0) {
                    throw new errors.Unit.InvalidRate(code);
                }
                return parseFloat((this.MGV * code).toFixed(2));
            }

            if (!UNITS[code]) {
                throw new errors.Unit.UnknownCode(code);
            }

            var value = this._value / UNITS[code][0];
            return parseFloat(value.toFixed(UNITS[code][1]));
        };

        /**
         * Returns the value represented in MMGV
         *
         * @returns {Number} The value converted to MMGV
         */
        Unit.prototype.toMMGV = function() {
            return this.to(Unit.MMGV);
        };

        /**
         * Returns the value represented in KMGV
         *
         * @returns {Number} The value converted to KMGV
         */
                Unit.prototype.toKMGV = function() {
            return this.to(Unit.KMGV);
        };

        /**
         * Returns the value represented in MGVcents
         *
         * @returns {Number} The value converted to MGVcents
         */



        Unit.prototype.toMGV = function() {
            return this.to(Unit.MGV);
        };

        /**
         * Returns the value represented in decimals
         *
         * @returns {Number} The value converted to decimals
         */


        Unit.prototype.todecimals = function() {
            return this.to(Unit.decimals);
        };

        /**
         * Returns the value represented in fiat
         *
         * @param {string} rate - The exchange rate between MGV/currency
         * @returns {Number} The value converted to decimals
         */
        Unit.prototype.atRate = function(rate) {
            return this.to(rate);
        };

        /**
         * Returns a the string representation of the value in decimals
         *
         * @returns {string} the value in decimals
         */
        Unit.prototype.toString = function() {
            return this.decimals + ' decimals';
        };

        /**
         * Returns a plain object representation of the Unit
         *
         * @returns {Object} An object with the keys: amount and code
         */
        Unit.prototype.toObject = Unit.prototype.toJSON = function toObject() {
            return {
                amount: this.MGV,
                code: Unit.MGV
            };
        };

        /**
         * Returns a string formatted for the console
         *
         * @returns {string} the value in decimals
         */

Unit.prototype . toMGVcents   = function( ) {
  return       this.to  ( Unit.MGVcents   );
};

        Unit.prototype.inspect = function() {
            return '<Unit: ' + this.toString() + '>';
        };

        module.exports = Unit;
