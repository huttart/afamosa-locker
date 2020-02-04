import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LockerService } from 'src/app/services/locker.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  UserRfid;
  constructor(
    private _UserService: UserService,
    private _LockerService: LockerService,
    private router: Router,
  ) { 

  }

  ngOnInit() {
    this._UserService.getUserByRfid().then((user:any) => {
      this.UserRfid = user.rfid;
    });
  }

  langOnClick (lang) {
    this._LockerService.lang = lang;
    console.log(lang);
    this.router.navigate(['/manual']);
  }

}
