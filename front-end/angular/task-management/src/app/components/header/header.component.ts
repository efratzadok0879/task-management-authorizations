import { Component } from '@angular/core';
import {  Global } from '../../imports';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  //----------------PROPERTIRS-------------------

  //allow access globals via interpolation
  global: any = Global;
}
