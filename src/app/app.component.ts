import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';

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
  version = 'Version 1.0.0';
  constructor (
    private _ElectronService: ElectronService
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

  }

  restartApp () {
    this._ElectronService.RestartAndInstallUpdate();
  }
}
