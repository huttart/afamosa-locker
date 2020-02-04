const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const ffi = require('ffi-napi');
const path = require('path');
const dllPath = path.resolve(__dirname + '/mwrf32.dll');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const lib = ffi.Library(dllPath, {
    'rf_init': ['int  ', ['int', 'long']],
    'rf_beep': ['int  ', ['int', 'int']],
    'rf_request': ['int', ['int', 'int', 'int *']],
    'rf_anticoll': ['int', ['int', 'char', 'long *']],
    'rf_exit': ['int', ['int']]
});
var tagtype = Buffer.alloc(1);
var card_data = Buffer.alloc(8);


let message2UI = (command, payload) => {
    ipcRenderer.send('message-from-worker', {
        command: command,
        payload: payload
    });
}

ipcRenderer.on('message-from-main-renderer', (event, arg) => {
    let payload = arg.payload;
    if (payload.start_reading_rfid) {
        var icdev = lib.rf_init('COM1', '9600');
        var loop_sub = setInterval(() => {
            try {
                lib.rf_request(icdev, 0x00, tagtype);
                // console.log(icdev);
                var dd = lib.rf_anticoll(icdev, 0, card_data);
                if (dd > 1000) {
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





