import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { LockerService } from 'src/app/services/locker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  avalible_locker;
  settimeout_sub;
  lang;
  lang_content = {
    'english': {
      topic_1: 'LOCATION',
      topic_2: 'YOU ARE HERE'
    },
    'chinese' : {
      topic_1: '位置',
      topic_2: '你在這裡'
    },
    'malaysia' : {
      topic_1: 'LOKASI',
      topic_2: 'KAMU DI SINI'
    }
  }

  
  constructor(
    private _TaskService: TaskService,
    private _LockerService: LockerService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.lang = this._LockerService.lang;
    this.avalible_locker = this._LockerService.avalible_locker;
    if (!this.avalible_locker) {
      this.router.navigate(['/']);
    }

    this.settimeout_sub = setTimeout(() => {
      this.router.navigate(['/']);
    }, 7000);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.settimeout_sub) {
      clearTimeout(this.settimeout_sub);
    }
  }

}
