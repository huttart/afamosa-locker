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

  constructor (
    private _ElectronService: ElectronService
  ) {
    _ElectronService.getAppVersion();
    this.checkForUpdate();
  }

  checkForUpdate () {
    this._ElectronService.isUpdateAvalible();

    setInterval(() => {
      this.update_avalible = this._ElectronService.update_avalible;
      this.update_downloaded = this._ElectronService.update_downloaded;

      console.log(this.update_avalible);
      console.log(this.update_downloaded);

      if (this.update_avalible) {

      }
      if (this.update_downloaded) {

      }

    }, 1000);

    // setTimeout(() => {
    //   this.update_downloaded = true;
    // }, 4000);
  }

  restartApp () {
    this._ElectronService.RestartAndInstallUpdate();
  }
}
