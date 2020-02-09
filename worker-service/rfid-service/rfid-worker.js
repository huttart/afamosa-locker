const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const ffi = require('ffi-napi');
const path = require('path');
const dllPath = path.resolve(__dirname + '/mwrf32.dll');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const request = require('request');
var base_url = 'http://127.0.0.1/gmc-locker-api/';
var WebCamera = require("webcamjs");
var enabledWebCamera = false;

const lib = ffi.Library(dllPath, {
    'rf_init': ['int  ', ['int', 'long']],
    'rf_beep': ['int  ', ['int', 'int']],
    'rf_request': ['int', ['int', 'int', 'int *']],
    'rf_anticoll': ['int', ['int', 'char', 'long *']],
    'rf_exit': ['int', ['int']]
});
var tagtype = Buffer.alloc(1);
var card_data = Buffer.alloc(8);
var icdev;

let message2UI = (command, payload) => {
    ipcRenderer.send('message-from-worker', {
        command: command,
        payload: payload
    });
}

openCamera();

ipcRenderer.on('message-from-main-renderer', (event, arg) => {
    let payload = arg.payload;
    if (payload.start_reading_rfid) {
        icdev = lib.rf_init('COM1', '9600');
        console.log(icdev);
        var loop_sub = setInterval(() => {
            try {
                lib.rf_request(icdev, 0x00, tagtype);
                // console.log(icdev);
                var dd = lib.rf_anticoll(icdev, 0, card_data);
                if (dd > 100000) {
                    lib.rf_beep(icdev, 10);
                    lib.rf_exit(icdev);
                    clearInterval(loop_sub);
                    // icdev = lib.rf_init('COM1', '9600');
                    message2UI('sendRfidData', { rfidData: card_data.toString('hex') });
                }
            } catch (error) {
                lib.rf_exit(icdev);
            }

        }, 300);
    }

});


ipcRenderer.on('message-to-arduino', (event, arg) => {
    var port = new SerialPort('COM5', { baudRate: 9600, autoOpen: false });
    port.write(JSON.stringify(arg.payload), function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }

        port.close(function (err) {
            console.log('port closed', err);
            message2UI('successfuly-send-data-to-arduino','successfuly-send-data-to-arduino');
        });
    });


});

ipcRenderer.on('take-photo-request', (event, arg) => {
    console.log(arg);
    if (enabledWebCamera) {
        WebCamera.snap(function (data_uri) {
            // console.log(data_uri);
            // document.getElementById('results').innerHTML =
            //     '<img src="' + data_uri + '"/>';
            var post_data = {
                url:data_uri,
                log_id:arg.payload
            }

            console.log(post_data);
            request({
                url: base_url + 'image/insertImage',
                body: JSON.stringify(post_data)
            }, (error, response, body) => {
                if (error) { return console.log(error); }
                // if (element) element.innerText = response.statusCode;
            });
        });
    } else {
        openCamera();
    }
});

ipcRenderer.on('get-device-status', (event, arg) => {
    checkDevice();
});





function openCamera () {
    if (!enabledWebCamera) { // Start the camera !
        enabledWebCamera = true;
        WebCamera.attach('#camdemo');
        console.log(WebCamera);
        console.log("The camera has been started");
    } else { // Disable the camera !
        enabledWebCamera = false;
        WebCamera.reset();
        console.log("The camera has been disabled");
    }
}


function checkDevice() {
    var deviceStatus = {
        'camera':false,
        'rfid_reader':false
    };
    deviceStatus.camera = WebCamera.loaded;
    deviceStatus.rfid_reader = (icdev > 0);
    // console.log(deviceStatus);
    if (!deviceStatus.camera) {
        openCamera();
    }
    ipcRenderer.send('send-device-status-to-main', {
        command: 'send-device-status-to-main',
        payload: deviceStatus
    });

}