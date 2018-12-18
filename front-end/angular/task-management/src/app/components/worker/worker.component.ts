import { Component } from '@angular/core';
import { MenuService,MenuItem  } from '../../imports';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent {

  //----------------PROPERTIRS-------------------

  menu: MenuItem[];

  //----------------CONSTRUCTOR------------------

  constructor(private menuService: MenuService) {
    this.menu = [
      new MenuItem('home', '/taskManagement/main/worker/home')
    ];
    this.menuService.setMenu(this.menu);
  }
  
}
