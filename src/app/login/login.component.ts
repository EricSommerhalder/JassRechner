import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

export interface LoginData {
  user: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  user: string;
  password: string;

  constructor(public fb: FormBuilder,
              public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) data: LoginData) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: [this.user, []],
      password: [this.password, []]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
