import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api_url = environment.api_url + 'taskqueue/';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  newTaskQueueByType(type) {
    return this.http.get(this.api_url + 'newTaskQueueByType',{
      params: {
        type:type
      }
    }).toPromise();
  }

  removeTaskQueueByID(type, task_id) {
    return this.http.get(this.api_url + 'removeTaskQueueByID',{
      params: {
        type:type,
        task_id:task_id
      }
    }).toPromise();
  }

  getTaskQueueByType (type, task_id) {
    return this.http.get(this.api_url + 'getTaskQueueByType',{
      params: {
        type:type,
        task_id:task_id
      }
    }).toPromise();
  }
}
