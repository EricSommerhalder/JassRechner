import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-popupdialog',
  templateUrl: './popupdialog.component.html',
  styleUrls: ['./popupdialog.component.css']
})
export class PopupdialogComponent implements OnInit {
  title: string;
  constructor(public authService: AuthService, private dialogRef: MatDialogRef<PopupdialogComponent>, @Inject(MAT_DIALOG_DATA) data) {this.title = data.title; }

  ngOnInit(): void {
  }
  logout() {
    this.authService.doLogout();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
