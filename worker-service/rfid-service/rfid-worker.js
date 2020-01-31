const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const ffi = require('ffi-napi');
var path = require('path');
var dllPath = path.resolve('worker-service/rfid-service/mwrf32.dll');
console.log(dllPath);
var lib = ffi.Library(dllPath, {
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
    // console.log(payload);

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




