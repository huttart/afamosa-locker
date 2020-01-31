import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  api_url = environment.api_url + 'user/';
  constructor(
    private http: HttpClient,
  ) { }

  getUserByRfid() {
    return this.http.get(this.api_url + 'getUserByRfid', {
      params: {
        rfid:'ABcglk97slji8sfsnhkHJ'
      }
    }).toPromise();
  }
}
