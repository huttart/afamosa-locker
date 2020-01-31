import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  UserRfid;
  constructor(
    private _UserService: UserService,
  ) { 

  }

  ngOnInit() {
    this._UserService.getUserByRfid().then((user:any) => {
      this.UserRfid = user.rfid;
    });
  }

}
