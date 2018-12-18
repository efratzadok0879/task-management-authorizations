import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { MenuService } from '../imports';

@Injectable()
export class Resolver implements Resolve<void> {

    //----------------CONSTRUCTOR------------------

    constructor(private router: Router, private menuService: MenuService) { }

    //----------------METHODS-------------------

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
        let path:string = activatedRouteSnapshot.url[0].path;
        this.router.config[0].children.find(route => {
            if (route.children) {
                let index:number = route.children.findIndex(r => r.path == path);
                if (index != -1) {
                    this.menuService.activeLinkSubject.next(index);
                    return true;
                }
                return false;
            }
            return false;
        });
    }

}