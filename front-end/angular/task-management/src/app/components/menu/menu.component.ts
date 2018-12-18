import { Component } from '@angular/core';
import { MenuService, UserService, MenuItem } from '../../imports';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  //----------------PROPERTIRS-------------------

  menu: { name: string, routing: string }[];

  activeLink: string;

  //----------------CONSTRUCTOR------------------

  constructor(private menuService: MenuService, private userService: UserService) {

    menuService.menuSubject.subscribe(
      (menu: MenuItem[]) => {
        this.menu = menu;
        if (menu) {
          if (menu[menu.length - 1].name != 'Logout') {
            this.menu.push(new MenuItem('Logout', '/taskManagement/login'));
          }
          this.activeLink = this.menu[0].name;
        }
      });

    this.menuService.activeLinkSubject.subscribe(index => {
      if (this.menu && this.menu.length > index)
        this.activeLink = this.menu[index].name
    });
  }

  //----------------METHODS-------------------

  //  Whenever the data in the parent changes, this method gets triggered. You 
  // can act on the changes here. You will have both the previous value and the 
  // current value here.

  onClick(item: MenuItem) {
    if (item.name == 'Logout')
      this.logout();
  }

  logout() {
    this.userService.logout();
  }

}
