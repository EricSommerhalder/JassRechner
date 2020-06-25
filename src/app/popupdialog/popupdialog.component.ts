import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-popupdialog',
  templateUrl: './popupdialog.component.html',
  styleUrls: ['./popupdialog.component.css']
})
export class PopupdialogComponent implements OnInit {
  title: string;
  leftMessage: string;
  rightMessage: string;
  constructor(private dialogRef: MatDialogRef<PopupdialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title; this.leftMessage = data.leftMessage; this.rightMessage = data.rightMessage;
  }

  ngOnInit(): void {
  }

  close(reply: string) {
    this.dialogRef.close(reply);
  }
}
