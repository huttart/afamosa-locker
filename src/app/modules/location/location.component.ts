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
  constructor(
    private _TaskService: TaskService,
    private _LockerService: LockerService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.avalible_locker = this._LockerService.avalible_locker;
    if (!this.avalible_locker) {
      this.router.navigate(['/']);
    }

    this.settimeout_sub = setTimeout(() => {
      this.router.navigate(['/']);
    }, 5000);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.settimeout_sub) {
      clearTimeout(this.settimeout_sub);
    }
  }

}
