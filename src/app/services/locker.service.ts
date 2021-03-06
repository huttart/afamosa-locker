import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  api_url = environment.api_url + 'locker/';
  public avalible_locker;
  public lang = 'english';

  constructor(
    private http: HttpClient,
  ) { }

  getLockerSizeOptions() {
    return this.http.get(this.api_url + 'getLockerSizeOptions').toPromise();
  }

  activateLockerByRfid(rfid) {
    return this.http.get(this.api_url + 'activateLockerByRfid', {
      params: {
        rfid: rfid,
        lang: this.lang
      }
    }).toPromise();
  }

  insertTask(title) {
    return this.http.get(this.api_url + 'insertTask', {
      params: {
        locker_id: title,
        state: "1"
      }
    }).toPromise();
  }
}
