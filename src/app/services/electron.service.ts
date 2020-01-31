import { Injectable } from '@angular/core';
import * as SerialPort from 'serialport';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'querystring';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  serialPort: typeof SerialPort;

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  readline;
  ffi;
  path: typeof path;

  portOpts = { baudRate: 9600, autoOpen: false };

  rf_lib;
  rfid_data;
  version;

  update_avalible = false;
  update_downloaded = false;


  constructor() {
    if (this.isElectron()) {
      this.serialPort = window.require('serialport');

      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.readline = window.require('@serialport/parser-readline');
      this.fs = window.require('fs');
      // load c dll libary to access rfid reader
      // this.ffi = window.require('ffi-napi');
      // this.path = window.require('path');
      // var dllPath = this.path.resolve('src/app/services/mwrf32.dll');
      // this.rf_lib = this.ffi.Library(dllPath, {
      //   'rf_init': ['int  ', ['int', 'long']],
      //   'rf_beep': ['int  ', ['int', 'int']],
      //   'rf_request': ['int', ['int', 'int', 'int *']],
      //   'rf_anticoll': ['int', ['int', 'char', 'long *']],
      //   'rf_exit': ['int', ['int']]
      // });

      this.ipcRenderer.on('message-from-worker', (event, arg) => {
        let payload = arg.payload;
        console.log(payload);
        this.rfid_data = payload.rfidData;
      });
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  newSerialPort(path) {
    var device = new this.serialPort(path, this.portOpts);
    const parser = new this.readline();

    return {
      serial_port: device,
      parser: parser
    };
  }

  rfidReaderInit(path) {

    // var icdev = this.rf_lib.rf_init(path, '9600');

    // return { icdev: icdev, lib: this.rf_lib };
    this.ipcRenderer.send('message-from-main-renderer', {
      command: 'start_reading_rfid',
      payload: { start_reading_rfid: true }
    });
  }

  getAppVersion() {
    if (this.isElectron()) {
      this.ipcRenderer.send('app_version');
      this.ipcRenderer.on('app_version', (event, arg) => {
        this.ipcRenderer.removeAllListeners('app_version');
        this.version = 'Version ' + arg.version;
        console.log(this.version);
      });
    }
  }

  isUpdateAvalible() {
    if (this.isElectron()) {
      this.ipcRenderer.on('update_available', () => {
        this.ipcRenderer.removeAllListeners('update_available');
        this.update_avalible = true;
      });
      this.ipcRenderer.on('update_downloaded', () => {
        this.ipcRenderer.removeAllListeners('update_downloaded');
        this.update_downloaded = true;
      });
    }
  }

  RestartAndInstallUpdate () {
    if (this.isElectron()) {
      this.ipcRenderer.send('restart_app');
    }
  }


}
