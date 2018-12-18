import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {

  //----------------PROPERTIRS-------------------

  emailFormGroup: FormGroup;

  //----------------CONSTRUCTOR------------------

  constructor(
    public dialogRef: MatDialogRef<SendEmailComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.initFormGroup();
  }

  //----------------METHODS-------------------
  
  initFormGroup() {
    this.emailFormGroup = this.formBuilder.group({
      subject: [''],
      body: [''],
    });
  }
  close() {
    this.dialogRef.close();
  }

  //----------------GETTERS-------------------

  //getters of the form group controls

  get subject() {
    return this.emailFormGroup.controls['subject'];
  }
  get body() {
    return this.emailFormGroup.controls['body'];
  }
  
}



