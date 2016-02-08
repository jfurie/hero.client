var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var localStoragePlugin = {
    addKeyValuePair: function(type, key, value, successCallback, errorCallback) {
        exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'LocalStoragePlugin', // mapped to our native Java class called "CalendarPlugin"
            'addKeyValuePair', // with this action name
            [{                  // and this array of custom arguments to create our entry
                "type": type,
                "key": key,
                "value": value
            }]
        ); 
     },
     getKeyValuePair: function(type, key, deFaultValue, successCallback, errorCallback) {
        exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'LocalStoragePlugin', // mapped to our native Java class called "CalendarPlugin"
            'getKeyValuePair', // with this action name
            [{                  // and this array of custom arguments to create our entry
                "type": type,
                "key": key,
                "deFaultValue": deFaultValue
            }]
        ); 
     }
};

module.exports = localStoragePlugin;