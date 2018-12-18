import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  @Input()
  formControl: FormControl;
  @Input()
  placeholder: string;
  @Input()
  rows: number = 2;

  rowNumber: number;

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

  //----------------METHODS-------------------

  ngOnInit() {
    this.rowNumber = this.rows;
  }
  
  keyDown(event) {
    let rows: string[] = event.target.value.split('\n');
    if (rows.length >= this.rows) {
      this.rowNumber = rows.length;
      if (event.key == 'Enter')
        this.rowNumber++;
      else
        if (event.key == 'Backspace' && this.rowNumber > this.rows && rows[this.rowNumber - 1] == '')
          this.rowNumber--;
    }
  }
  
}