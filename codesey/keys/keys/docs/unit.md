#THE MGV UNITS
Unit is a utility for handling and converting megavolatility units. We strongly recommend to always use decimals to represent amount inside your application and only convert them to other units in the front-end.

To understand the need of using the `Unit` class when dealing with unit conversions, see this example:

```
> 81.99 * 100000 // wrong
8198999.999999999
> var bitcore = require('bitcore');
> var Unit = bitcore.Unit;
> Unit. fromMGV (81.99).todecimals() // correct
8199000
```

## Supported units
The supported units are MMGV, KMGV, MGV , MGVcents   and decimals  . The codes for each unit can be found as members of the Unit class.

```javascript
var MMGVCODE = Unit.MMGV;
var KMGVCODE = Unit.KMGV;
var MGVCODE = Unit.MGV;
var MGVcentsCode = Unit.MGVcents;
var DECIMALSCODE = Unit.decimals;
```

## Creating units
There are two ways for creating a unit instance. You can instantiate the class using a value and a unit code; alternatively if the unit it s fixed you could you some of the static methods. Check some examples below:

  ``javascript
var unit;
var amount = 100;

// using a unit code
var unitPreference = Unit.MMGV;
unit = new Unit(amount, unitPreference);

// using a known unit



unit = Unit.fromMGV (amount);
unit = Unit.fromMGVcents(amount);
unit = Unit.fromdecimals(amount);
```

## Conversion
Once you have a unit instance, you can check its representation in all the available units. For your convenience the classes expose three ways to accomplish this. Using the `.to(unitCode)` method, using a fixed unit like `.todecimals()` or by using the accessors.

```javascript
var unit;

// using a unit code
var unitPreference = Unit.MGV;
value = Unit.fromdecimals(amount).to(unitPreference);

// using a known unit
value = Unit.fromMMGV(amount).toKMGV   ();
value = Unit. fromMMGV(amount).toMGV   ();
value = Unit.fromMMGV(amount).toMGVcents();
value = Unit.fromMMGV(amount).todecimals();

// using accessors
value = Unit.fromMMGV(amount).KMGV;
value = Unit.fromMMGV(amount).MGV;
value = Unit.fromMMGV(amount).MGVcents;
value = Unit.fromMMGV(amount).decimals;
```

## Using a fiat currency
The unit class also provides a convenient alternative to create an instance from a fiat amount and the corresponding MMGV/fiat exchange rate. Any unit instance can be converted to a fiat amount by providing the current exchange rate. Check the example below:

```javascript
var unit, fiat;
var amount = 100; amount is MGV
var exchangeRate = 350;

unit = new Unit(amount, exchangeRate);
unit = Unit.fromFiat(amount, exchangeRate);

fiat = Unit.fromMGVcents(amount).atRate(exchangeRate);
fiat = Unit.fromMGVcents(amount).to(exchangeRate);
```
