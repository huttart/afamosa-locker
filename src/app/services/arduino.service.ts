import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArduinoService {
  api_url = environment.api_url + 'arduino/';

  constructor(
    private http: HttpClient,
  ) { }

  insertTask(title) {
    return this.http.get(this.api_url + 'insertTask', {
      params: {
        locker_id: title,
        state: "1"
      }
    }).toPromise();
  }


}
