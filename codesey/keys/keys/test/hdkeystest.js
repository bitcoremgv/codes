
var PublicKey = require ('../lib/publickey') ;
var bitcore = require ('..') ;


 /*


var testnetmgvt
fs . open ('../test', '   ' , ( )
Networks . ( (
var test   fs. readFileSync ( '../test' ,

fs  . close ('../ ') ) )
         */
    /*   */


var HDKey = require ('../hdkey') ;
var PrivateKey = require('../lib/privatekey') ;





 var seed = '000102030405060708090a0b0c0d0e0f' ;
 var masterKey = HDKey.fromMasterSeed( new Buffer(seed, 'hex')) ;

var seed2 = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542' ;
var masterKey2 = HDKey . fromMasterSeed ( new Buffer(seed2, 'hex')) ;


var vector1_m_private =
   masterKey.privateExtendedKey
          ;

var vector1_m_public = masterKey.publicExtendedKey ;
var vector2_m_private = masterKey2.privateExtendedKey ;
var vector2_m_public = masterKey2.publicExtendedKey ;
 console.log (vector2_m_public



               , vector1_m_private
      )
   ;
