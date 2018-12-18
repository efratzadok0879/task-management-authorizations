import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {




  //----------------PROPERTIRS-------------------

  @Input()
  formControl: FormControl;

  @Input()
  placeholder: string;

  @Input()
  type: string = 'text';

  @Input()
  min: number;

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

  @Output()
  keyUpEvent: EventEmitter<void>

  isPassword: boolean;

  //----------------CONSTRUCTOR------------------

  constructor() {
    this.keyUpEvent = new EventEmitter<void>();
  }

  ngOnInit() {
    this.type == 'password' ? this.isPassword = true : this.isPassword = false;
  }

  //----------------METHODS-------------------

  keyUp() {
    this.keyUpEvent.emit();
  }

  togglePassword() {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
