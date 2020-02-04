import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'src/app/services/electron.service';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { LockerService } from 'src/app/services/locker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ipcRenderer } from 'electron';

// import * as SerialPort from 'serialport';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
  loading = true;
  timeout = 10;
  interval_sub;
  interval_sub2;
  interval_sub3;
  RFID;
  err_message;

  processing = false;

  arduino;
  rf_reader;

  constructor(
    private _ElectronService: ElectronService,
    private router: Router,
    private _TaskService: TaskService,
    private _LockerService: LockerService,
    private _snackBar: MatSnackBar,

  ) {
    this.timeout = 1000;
  }

  ngOnDestroy(): void {
    if (this.interval_sub) {
      clearInterval(this.interval_sub);
    }
    if (this.interval_sub2) {
      clearInterval(this.interval_sub2);
    }
    if (this.interval_sub3) {
      clearInterval(this.interval_sub3);
    }

    if (this.arduino && this.arduino.serial_port && this.arduino.serial_port.isOpen) {
      this.arduino.serial_port.close();
    }

    console.log('ngOnDestroy');
  }

  ngOnInit() {
    console.log('ONINIT');
    this.interval_sub = setInterval(() => {
      this.timeout -= 1;
      if (this.timeout <= 0) {
        this.router.navigate(['/']);
      }
    }, 1000);

    // this._ElectronService.serialPort.list().then(ports => {
    //   ports.forEach(port => {
    //     if (port.manufacturer == "FTDI") {
    //       this.rf_reader = this._ElectronService.rfidReaderInit(port.path);
    //     } else {
    //       this.arduino = this._ElectronService.newSerialPort(port.path);
    //     }
    //   });

    //   this.readDataFromRfidReader();

    // });

    this._ElectronService.rfidReaderInit('');
    this.readDataFromRfidReader();
  }

  sendDataToArduino(locker) {
    // this.arduino.serial_port.write(JSON.stringify({
    //   lockerID: '13',
    //   state: 0,
    // }));
    console.log('sendDataToArduino 1');
    this._ElectronService.messageToArduino(locker);
  }

  readDataFromRfidReader() {
    this.interval_sub2 = setInterval(() => {
      var rfid_data = this._ElectronService.rfid_data;
      if (rfid_data) {
        this._ElectronService.rfid_data = null;
        clearInterval(this.interval_sub2);
        clearInterval(this.interval_sub);
        this.trytoActivateLocker(rfid_data);
      }
    }, 200);
  }

  trytoActivateLocker(rfid) {
    this.processing = true;
    this.loading = false;

    this._LockerService.activateLockerByRfid(rfid).then((avalible_locker: any) => {
      setTimeout(() => {
        if (avalible_locker.status) {
          this.sendDataToArduino(avalible_locker.data);
          console.log(avalible_locker);
          this._LockerService.avalible_locker = avalible_locker.data;
          this.router.navigate(['/location']);
        } else {
          this.err_message = avalible_locker.error;
          setTimeout(() => {
            // console.log('888');
            this.router.navigate(['/']);
          }, 2000);
        }
      }, 1000);
    });
  }

}
