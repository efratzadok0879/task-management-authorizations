import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  date: FormControl;

  @Input()
  placeholder: string;

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

}
