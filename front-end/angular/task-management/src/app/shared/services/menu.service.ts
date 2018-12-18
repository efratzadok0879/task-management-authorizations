import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuItem } from '../../imports';

@Injectable()
export class MenuService {

    //----------------PROPERTIRS-------------------

    menuSubject: Subject<MenuItem[]>;
    activeLinkSubject: Subject<number> = new Subject<number>();

    //----------------CONSTRUCTOR------------------

    constructor() {
        this.menuSubject = new Subject<MenuItem[]>();
        this.activeLinkSubject = new Subject<number>();

    }

    //----------------METHODS-------------------

    setMenu(menu: MenuItem[]) {
        this.menuSubject.next(menu);
    }
    
}
