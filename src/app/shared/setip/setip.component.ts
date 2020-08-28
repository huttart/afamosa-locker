import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'app-setip',
  templateUrl: './setip.component.html',
  styleUrls: ['./setip.component.scss']
})
export class SetipComponent implements OnInit {
  ip;
  constructor(
    public dialogRef: MatDialogRef<SetipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private _ElectronService: ElectronService,


  ) { }

  ngOnInit() {
    this.ip = localStorage.getItem('api_url') ? localStorage.getItem('api_url') : '127.0.0.1'
  }

  onNoClick() {
    this.dialogRef.close(false);
  }



  onYesClick() {
    console.log(this.ip)
    this._snackBar.open('Successfully', '', {
      duration: 3000
    });
    localStorage.setItem('api_url', this.ip);

    setTimeout(() => {
      this._ElectronService.Restart();
    }, 1500);

    this.dialogRef.close(true);
  }

}
