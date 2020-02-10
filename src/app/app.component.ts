import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Afamosa locker';
  update_avalible = false;
  update_downloaded = false;
  interval_sub;
  interval_sub2;
  version = 'Version 1.0.0';
  device_status = {
    camera:false,
    rfid_reader:false
  }
  checking_device = true;
  timeout = 5;
  constructor (
    private _ElectronService: ElectronService,
    private router: Router,
  ) {
    _ElectronService.getAppVersion();
    this.checkForUpdate();

    console.log(this.version);
  }

  checkForUpdate () {
    this._ElectronService.isUpdateAvalible();
    var limit = 10;
    this.interval_sub = setInterval(() => {
      this.version = this._ElectronService.version;
      this.update_avalible = this._ElectronService.update_avalible;
      this.update_downloaded = this._ElectronService.update_downloaded;
      // console.log(this.update_downloaded);
      // console.log(this.update_avalible);
      if (limit == 0 && this.update_avalible == false) {
        clearInterval(this.interval_sub);
      }
      if (this.update_downloaded) {
        clearInterval(this.interval_sub);
      }
      limit = limit - 1;
    }, 1000);
    
    this.interval_sub2 = setInterval(() => {
      this._ElectronService.checkDeviceStatus();
      this.device_status = this._ElectronService.device_status;
      this.checking_device = (this.device_status.camera && this.device_status.rfid_reader);
      this.timeout--;
      console.log(this.device_status);
      if (this.device_status.camera && this.device_status.rfid_reader) {
        clearInterval(this.interval_sub2);
      }
      if (this.timeout == 0 && !this.checking_device) {
        this.timeout = 5;
        this.router.navigate(['/location']);
      }
    }, 1000);

  }

  restartApp () {
    this._ElectronService.RestartAndInstallUpdate();
  }
}
