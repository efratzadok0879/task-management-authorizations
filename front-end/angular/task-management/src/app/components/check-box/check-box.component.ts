import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})
export class CheckBoxComponent{
  
 //----------------PROPERTIRS-------------------

 @Input()
 checkControl: FormControl;

 @Input()
 label: string;

 @Output()
 changeEvent: EventEmitter<void>

 //allow access 'Object' type via interpolation
 objectHolder: typeof Object = Object;
 
 //----------------CONSTRUCTOR------------------

 constructor() {
   this.changeEvent = new EventEmitter<void>();
 }

 //----------------METHODS-------------------

 onChange() {
   this.changeEvent.emit();
 }
 
}
