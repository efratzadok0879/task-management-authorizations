import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  list: any[];

  @Input()
  key: string;

  @Input()
  value: string;

  @Input()
  formControl: FormControl;

  @Input()
  placeholder: string;

  @Output()
  onChangeEvent: EventEmitter<any>;

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

  //----------------CONSTRUCTOR------------------

  constructor() {
    this.onChangeEvent = new EventEmitter<any>();
  }

  //----------------METHODS-------------------

  onChange() {
    this.onChangeEvent.emit(this.formControl.value);
  }
  
}
