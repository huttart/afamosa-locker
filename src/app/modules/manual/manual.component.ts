import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'src/app/services/electron.service';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { LockerService } from 'src/app/services/locker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArduinoService } from 'src/app/services/arduino.service';
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

  lang;


  lang_content = {
    'english': {
      topic_1: 'SCAN HERE',
    },
    'chinese' : {
      topic_1: '在這裡掃描'
    },
    'malaysia' : {
      topic_1: 'SCAN DI SINI'
    }
  }

  constructor(
    private _ElectronService: ElectronService,
    private router: Router,
    private _TaskService: TaskService,
    private _LockerService: LockerService,
    private _snackBar: MatSnackBar,
    private _ArduinoService: ArduinoService

  ) {
    this.timeout = 5;
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
    this.lang = this._LockerService.lang;
    console.log(this.lang_content[this.lang]);
    // this.interval_sub = setInterval(() => {
    //   this.timeout -= 1;
    //   if (this.timeout <= 0) {
    //     // this.router.navigate(['/']);
    //     this.processing = true;
    //     this.loading = false;
    //   }
    // }, 1000);

    this._ElectronService.rfidReaderInit('');
    this.readDataFromRfidReader();
  }

  sendDataToArduino(locker) {
    this._ArduinoService.insertTask(locker.title).then((res:any) => {
      if (res.status) {
        this.router.navigate(['/location']);
      }
    });
  }

  readDataFromRfidReader() {
    this.interval_sub2 = setInterval(() => {
      var rfid_data = this._ElectronService.rfid_data;
      if (rfid_data) {
        this._ElectronService.rfid_data = null;
        clearInterval(this.interval_sub2);
        // clearInterval(this.interval_sub);
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
          console.log(avalible_locker);
          this._LockerService.avalible_locker = avalible_locker.data;
          this.sendDataToArduino(avalible_locker.data);

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
